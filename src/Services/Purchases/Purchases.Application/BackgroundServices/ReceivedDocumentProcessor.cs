using System.Text.Json;
using Acontplus.Billing.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Purchases.Application.Dtos.ReceivedDocuments;
using Purchases.Application.Interfaces;

namespace Purchases.Application.BackgroundServices;

public class ReceivedDocumentProcessor : BackgroundService
{
    private readonly ILogger<ReceivedDocumentProcessor> _logger;
    private readonly IServiceProvider _serviceProvider;
    private readonly IConfiguration _configuration;

    private readonly string _pendingFolder;
    private readonly string _processingFolder;
    private readonly string _completedFolder;
    private readonly string _failedFolder;
    private readonly string _retryFolder;

    private readonly int _maxRetries;
    private readonly int _retryDelayMinutes;
    private readonly int _pollIntervalSeconds;
    private DateTime _lastCleanupTime = DateTime.MinValue;

    public ReceivedDocumentProcessor(
        ILogger<ReceivedDocumentProcessor> logger,
        IServiceProvider serviceProvider,
        IConfiguration configuration)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
        _configuration = configuration;

        var baseFolder = configuration["ReceivedDocuments:WorkerFolder"] ?? "C:\\AcontPlus\\ReceivedDocuments";
        _pendingFolder = Path.Combine(baseFolder, "pending");
        _processingFolder = Path.Combine(baseFolder, "processing");
        _completedFolder = Path.Combine(baseFolder, "completed");
        _failedFolder = Path.Combine(baseFolder, "failed");
        _retryFolder = Path.Combine(baseFolder, "retry");

        _maxRetries = int.Parse(configuration["ReceivedDocuments:MaxRetries"] ?? "3");
        _retryDelayMinutes = int.Parse(configuration["ReceivedDocuments:RetryDelayMinutes"] ?? "5");
        _pollIntervalSeconds = int.Parse(configuration["ReceivedDocuments:PollIntervalSeconds"] ?? "10");

        EnsureFoldersExist();
    }

    private void EnsureFoldersExist()
    {
        Directory.CreateDirectory(_pendingFolder);
        Directory.CreateDirectory(_processingFolder);
        Directory.CreateDirectory(_completedFolder);
        Directory.CreateDirectory(_failedFolder);
        Directory.CreateDirectory(_retryFolder);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("📋 ReceivedDocument processor starting...");

        await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);

        await RecoverOrphanedFilesAsync(stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessRetryFilesAsync(stoppingToken);
                await ProcessPendingFilesAsync(stoppingToken);
                await CleanupOldFilesAsync(stoppingToken);

                await Task.Delay(TimeSpan.FromSeconds(_pollIntervalSeconds), stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error in processor loop");
                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
            }
        }

        _logger.LogInformation("📋 ReceivedDocument processor stopped");
    }

    private async Task ProcessRetryFilesAsync(CancellationToken cancellationToken)
    {
        var retryFiles = Directory.GetFiles(_retryFolder, "*.json");

        foreach (var file in retryFiles)
        {
            if (cancellationToken.IsCancellationRequested) break;

            try
            {
                var json = await File.ReadAllTextAsync(file, cancellationToken);
                var message = json.DeserializeOptimized<ReceivedDocumentFileMessage>();

                if (message == null) continue;

                if (message.LastRetryAt.HasValue)
                {
                    var timeSinceRetry = DateTime.UtcNow - message.LastRetryAt.Value;
                    if (timeSinceRetry.TotalMinutes < _retryDelayMinutes)
                    {
                        continue;
                    }
                }

                var fileName = Path.GetFileName(file);
                var processingPath = Path.Combine(_processingFolder, fileName);
                File.Move(file, processingPath, true);

                await ProcessFileAsync(processingPath, message, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing retry file: {File}", Path.GetFileName(file));
            }
        }
    }

    private async Task ProcessPendingFilesAsync(CancellationToken cancellationToken)
    {
        var pendingFiles = Directory.GetFiles(_pendingFolder, "*.json");

        foreach (var file in pendingFiles)
        {
            if (cancellationToken.IsCancellationRequested) break;

            try
            {
                var fileName = Path.GetFileName(file);
                var processingPath = Path.Combine(_processingFolder, fileName);

                File.Move(file, processingPath, true);

                var json = await File.ReadAllTextAsync(processingPath, cancellationToken);
                var message = json.DeserializeOptimized<ReceivedDocumentFileMessage>();

                if (message == null)
                {
                    _logger.LogWarning("Invalid JSON in file: {File}", fileName);
                    MoveToFailed(processingPath, "Invalid JSON format");
                    continue;
                }

                await ProcessFileAsync(processingPath, message, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing pending file: {File}", Path.GetFileName(file));
            }
        }
    }

    private async Task ProcessFileAsync(string filePath, ReceivedDocumentFileMessage message, CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var sriService = scope.ServiceProvider.GetRequiredService<IWebServiceSri>();
        var receivedDocService = scope.ServiceProvider.GetRequiredService<IReceivedDocumentService>();

        try
        {
            _logger.LogInformation("🔄 Processing: {AccessKey} (Attempt {Retry})",
                message.AccessKey, message.RetryCount + 1);

            // Download XML from SRI and save using service method (which will insert the document)
            await DownloadAndSaveXmlAsync(message, sriService, receivedDocService, cancellationToken);

            _logger.LogInformation("✅ Successfully processed: {AccessKey}", message.AccessKey);

            // Delete file immediately after successful processing (already in DB)
            File.Delete(filePath);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error processing {AccessKey}", message.AccessKey);
            await HandleFailureAsync(filePath, message, ex.Message, cancellationToken);
        }
    }

    private async Task DownloadAndSaveXmlAsync(ReceivedDocumentFileMessage message,
        IWebServiceSri sriService, IReceivedDocumentService receivedDocService,
        CancellationToken cancellationToken)
    {
        var urlSri = _configuration["UrlSriComprobantes"] ?? string.Empty;

        // Get XML from SRI
        var xmlResponse = await sriService.CheckExistenceAsync(message.AccessKey, urlSri);
        var xml = xmlResponse.XmlSri ?? string.Empty;

        if (xml.Trim().Length <= 500)
        {
            _logger.LogWarning("XML too short for accessKey: {AccessKey}", message.AccessKey);
            throw new Exception("XML response from SRI is too short or invalid");
        }

        // Use service's UploadXmlAsync which handles document creation and XML upload
        var result = await receivedDocService.UploadXmlAsync(
            xml,
            message.AccessKey,
            message.EstablishmentId,
            message.SubcategoryId,
            message.UserRoleId,
            cancellationToken);

        if (!result.IsSuccess)
        {
            throw new Exception(result.Error.Message ?? "Failed to upload XML to document");
        }
    }

    private async Task HandleFailureAsync(string filePath, ReceivedDocumentFileMessage message,
        string error, CancellationToken cancellationToken)
    {
        var updatedMessage = message with
        {
            RetryCount = message.RetryCount + 1,
            LastRetryAt = DateTime.UtcNow,
            LastError = error
        };

        if (updatedMessage.RetryCount >= _maxRetries)
        {
            _logger.LogError("❌ Max retries ({Max}) exceeded for: {AccessKey}",
                _maxRetries, message.AccessKey);
            MoveToFailed(filePath, error);
        }
        else
        {
            _logger.LogWarning("⏳ Retry {Retry}/{Max} scheduled for: {AccessKey} (next in {Delay} min)",
                updatedMessage.RetryCount, _maxRetries, message.AccessKey, _retryDelayMinutes);

            var fileName = Path.GetFileName(filePath);
            var retryFileName = fileName.Replace(".json", $".retry-{updatedMessage.RetryCount}.json");
            var retryPath = Path.Combine(_retryFolder, retryFileName);

            var updatedJson = JsonSerializer.Serialize(updatedMessage, new JsonSerializerOptions { WriteIndented = true });
            await File.WriteAllTextAsync(retryPath, updatedJson, cancellationToken);

            File.Delete(filePath);
        }
    }

    private async Task CleanupOldFilesAsync(CancellationToken cancellationToken)
    {
        // Run cleanup only once per hour
        if ((DateTime.UtcNow - _lastCleanupTime).TotalHours < 1)
            return;

        _lastCleanupTime = DateTime.UtcNow;
        var cutoffDate = DateTime.UtcNow.AddDays(-7);

        try
        {
            // Cleanup old failed files (older than 7 days)
            var failedFiles = Directory.GetFiles(_failedFolder, "*.json")
                .Where(f => File.GetCreationTimeUtc(f) < cutoffDate)
                .ToList();

            foreach (var file in failedFiles)
            {
                try
                {
                    File.Delete(file);
                    var errorFile = file.Replace(".json", ".error.txt");
                    if (File.Exists(errorFile))
                        File.Delete(errorFile);
                }
                catch { /* Ignore cleanup errors */ }
            }

            if (failedFiles.Count > 0)
                _logger.LogInformation("🧹 Cleaned up {Count} old failed files", failedFiles.Count);

            // Cleanup old retry files (older than 7 days - these are stuck)
            var retryFiles = Directory.GetFiles(_retryFolder, "*.json")
                .Where(f => File.GetCreationTimeUtc(f) < cutoffDate)
                .ToList();

            foreach (var file in retryFiles)
            {
                try { File.Delete(file); } catch { /* Ignore */ }
            }

            if (retryFiles.Count > 0)
                _logger.LogInformation("🧹 Cleaned up {Count} old retry files", retryFiles.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during file cleanup");
        }

        await Task.CompletedTask;
    }

    private async Task RecoverOrphanedFilesAsync(CancellationToken cancellationToken)
    {
        var orphanedFiles = Directory.GetFiles(_processingFolder, "*.json");
        if (orphanedFiles.Length > 0)
        {
            _logger.LogWarning("🔄 Found {Count} orphaned files in processing folder, moving back to pending", orphanedFiles.Length);

            foreach (var file in orphanedFiles)
            {
                try
                {
                    var fileName = Path.GetFileName(file);
                    var pendingPath = Path.Combine(_pendingFolder, fileName);
                    File.Move(file, pendingPath, true);
                    _logger.LogInformation("↩️ Recovered orphaned file: {File}", fileName);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to recover orphaned file: {File}", Path.GetFileName(file));
                }
            }
        }

        await Task.CompletedTask;
    }

    private void MoveToFailed(string filePath, string error)
    {
        var fileName = Path.GetFileName(filePath);
        var failedPath = Path.Combine(_failedFolder, fileName);
        var errorPath = Path.Combine(_failedFolder, fileName.Replace(".json", ".error.txt"));

        File.Move(filePath, failedPath, true);
        File.WriteAllText(errorPath, $"Failed at: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}\nError: {error}");
    }
}


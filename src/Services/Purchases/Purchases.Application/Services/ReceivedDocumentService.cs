using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Purchases.Application.Dtos.ReceivedDocuments;


namespace Purchases.Application.Services;

public class ReceivedDocumentService(
    IUnitOfWork unitOfWork,
    IConfiguration configuration,
    ILogger<ReceivedDocumentService> logger) : IReceivedDocumentService
{
    private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;
    private readonly IConfiguration _configuration = configuration;
    private readonly ILogger<ReceivedDocumentService> _logger = logger;
    private const string ModuleName = "Purchases";

    public async Task<Result<PagedResult<ReceivedDocumentItem>, DomainError>> GetAsync(PaginationRequest paginationRequest, CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _adoRepository.GetPagedFromStoredProcedureAsync<ReceivedDocumentItem>(
              $"{ModuleName}GetReceivedDocuments", paginationRequest, cancellationToken: cancellationToken);

            if (response.Items.Any())
            {
                return Result<PagedResult<ReceivedDocumentItem>, DomainError>.Success(response);
            }

            var error = DomainError.NotFound("RECEIVED_DOCUMENT_NOT_FOUND", "No items were found.");
            return Result<PagedResult<ReceivedDocumentItem>, DomainError>.Failure(error);
        }
        catch (Exception ex)
        {
            var error = DomainError.Internal("RECEIVED_DOCUMENT_GET_ERROR",
              $"An error occurred while retrieving items. {ex.Message}");
            return Result<PagedResult<ReceivedDocumentItem>, DomainError>.Failure(error);
        }
    }

    public async Task<Result<ReceivedDocumentItem, DomainError>> GetByIdAsync(int id, int userRoleId, CancellationToken cancellationToken = default)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "id", id }, { "userRoleId", userRoleId } };
            var document = await _adoRepository.QuerySingleOrDefaultAsync<ReceivedDocumentItem>($"{ModuleName}GetReceivedDocumentById", parameters);
            return document != null
              ? Result<ReceivedDocumentItem, DomainError>.Success(document)
              : Result<ReceivedDocumentItem, DomainError>.Failure(DomainError.NotFound("RECEIVED_DOCUMENT_NOT_FOUND", "Received document not found"));
        }
        catch (Exception ex)
        {
            return Result<ReceivedDocumentItem, DomainError>.Failure(DomainError.Internal("RECEIVED_DOCUMENT_GETBYID_ERROR", ex.Message));
        }
    }

    public async Task<Result<string, DomainError>> GetByIdXmlAsync(int id, int userRoleId, CancellationToken cancellationToken = default)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "id", id }, { "userRoleId", userRoleId } };
            var ds = await _adoRepository.GetDataSetAsync("Purchases.GetReceivedDocumentXmlById", parameters);
            var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
            if (dt.Rows.Count > 0 && dt.Columns.Contains("xmlDoc"))
            {
                var xmlDoc = dt.Rows[0]["xmlDoc"].ToString();
                return !string.IsNullOrEmpty(xmlDoc)
                  ? Result<string, DomainError>.Success(xmlDoc)
                  : Result<string, DomainError>.Failure(DomainError.NotFound("XML_NOT_FOUND", "XML document not found"));
            }
            return Result<string, DomainError>.Failure(DomainError.NotFound("XML_NOT_FOUND", "XML document not found"));
        }
        catch (Exception ex)
        {
            return Result<string, DomainError>.Failure(DomainError.Internal("RECEIVED_DOCUMENT_GETXML_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> AddAsync(ReceivedDocumentCreate request, CancellationToken cancellationToken = default)
    {
        try
        {
            // Save to file for background processing (NO database insert)
            var pendingFolder = _configuration["ReceivedDocuments:PendingFolder"] ??
                Path.Combine(Directory.GetCurrentDirectory(), "pending-documents");

            if (!Directory.Exists(pendingFolder))
            {
                Directory.CreateDirectory(pendingFolder);
            }

            var searchPattern = $"*{request.AccessKey}*.json";
            var existingFiles = Directory.GetFiles(pendingFolder, searchPattern);

            if (existingFiles.Length > 0)
            {
                return Result<bool, DomainError>.Failure(
                    DomainError.Validation("RECEIVED_DOCUMENT_EXISTS",
                    $"Document with access key '{request.AccessKey}' is already queued for processing"));
            }

            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmssfff");
            var fileName = $"received-doc-{request.AccessKey}-{timestamp}.json";
            var filePath = Path.Combine(pendingFolder, fileName);

            // Save file message (no DB ID yet)
            var fileMessage = new ReceivedDocumentFileMessage(
                AccessKey: request.AccessKey,
                EstablishmentId: request.EstablishmentId,
                SubcategoryId: request.SubcategoryId,
                UserRoleId: request.UserRoleId,
                DocumentId: 0  // Will be set after DB insert by worker
            );

            var jsonContent = JsonExtensions.SerializeOptimized(fileMessage);
            await File.WriteAllTextAsync(filePath, jsonContent, cancellationToken);

            _logger.LogInformation("Document queued for processing: {AccessKey}", request.AccessKey);

            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error queueing received document");
            return Result<bool, DomainError>.Failure(DomainError.Internal("RECEIVED_DOCUMENT_ADD_ERROR", ex.Message));
        }
    }

    public async Task<Result<ReceivedDocumentItem, DomainError>> UpdateAsync(int id, ReceivedDocumentUpdate request, int userRoleId, CancellationToken cancellationToken = default)
    {
        try
        {
            var parameters = new Dictionary<string, object>
      {
        { "userRoleId", userRoleId },
        { "json", JsonExtensions.SerializeOptimized(request) }
      };
            var response = await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Update", parameters);
            if (response?.Code == "0")
            {
                return await GetByIdAsync(id, userRoleId, cancellationToken);
            }
            return Result<ReceivedDocumentItem, DomainError>.Failure(DomainError.Validation("RECEIVED_DOCUMENT_UPDATE_ERROR", response?.Message ?? "Failed to update received document"));
        }
        catch (Exception ex)
        {
            return Result<ReceivedDocumentItem, DomainError>.Failure(DomainError.Internal("RECEIVED_DOCUMENT_UPDATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> UpdateSubcategoryAsync(int id, ReceivedDocumentCategoryUpdate request, CancellationToken cancellationToken = default)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "id", id }, { "subcategoryId", request.SubcategoryId }, { "userId", id } };
            var response = await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}UpdateSubcategoryReceivedDocument", parameters);
            return response?.Code == "0"
              ? Result<bool, DomainError>.Success(true)
              : Result<bool, DomainError>.Failure(DomainError.Validation("RECEIVED_DOCUMENT_UPDATE_CATEGORY_ERROR", response?.Message ?? "Failed to update category"));
        }
        catch (Exception ex)
        {
            return Result<bool, DomainError>.Failure(DomainError.Internal("RECEIVED_DOCUMENT_UPDATE_CATEGORY_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, int userRoleId, CancellationToken cancellationToken = default)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "id", id }, { "userRoleId", userRoleId } };
            var response = await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}DeleteReceivedDocument", parameters);
            return response?.Code == "0"
              ? Result<bool, DomainError>.Success(true)
              : Result<bool, DomainError>.Failure(DomainError.Validation("RECEIVED_DOCUMENT_DELETE_ERROR", response?.Message ?? "Failed to delete received document"));
        }
        catch (Exception ex)
        {
            return Result<bool, DomainError>.Failure(DomainError.Internal("RECEIVED_DOCUMENT_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<ReceivedDocumentItem, DomainError>> MigrateAsync(ReceivedDocumentMigrate request, CancellationToken cancellationToken = default)
    {
        try
        {
            var parameters = new Dictionary<string, object>
      {
        { "userRoleId", request.UserRoleId },
        { "json", JsonExtensions.SerializeOptimized(request) }
      };
            var response = await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}MigrateReceivedDocument", parameters);
            if (response?.Code == "0")
            {
                return await GetByIdAsync(request.Id, request.UserRoleId, cancellationToken);
            }
            return Result<ReceivedDocumentItem, DomainError>.Failure(DomainError.Validation("RECEIVED_DOCUMENT_MIGRATE_ERROR", response?.Message ?? "Failed to migrate document"));
        }
        catch (Exception ex)
        {
            return Result<ReceivedDocumentItem, DomainError>.Failure(DomainError.Internal("RECEIVED_DOCUMENT_MIGRATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<byte[], DomainError>> DownloadAsync(int id, int userRoleId, CancellationToken cancellationToken = default)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "id", id }, { "userRoleId", userRoleId } };
            var data = await _adoRepository.QuerySingleOrDefaultAsync<byte[]>($"{ModuleName}DownloadReceivedDocument", parameters);
            return data != null
              ? Result<byte[], DomainError>.Success(data)
              : Result<byte[], DomainError>.Failure(DomainError.NotFound("DOCUMENT_FILE_NOT_FOUND", "Document file not found"));
        }
        catch (Exception ex)
        {
            return Result<byte[], DomainError>.Failure(DomainError.Internal("RECEIVED_DOCUMENT_DOWNLOAD_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> UploadXmlAsync(int id, string xmlContent, int establishmentId, int subcategoryId, int userRoleId, CancellationToken cancellationToken = default)
    {
        try
        {
            // XML sanitization handled by database function f_sanitize_xml
            var parameters = new Dictionary<string, object>
            {
                { "id", id },
                { "xmlContent", xmlContent },
                { "establishmentId", establishmentId },
                { "subcategoryId", subcategoryId },
                { "userRoleId", userRoleId }
            };
            var response = await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}UploadXmlReceivedDocument", parameters);
            return response?.Code == "0"
              ? Result<bool, DomainError>.Success(true)
              : Result<bool, DomainError>.Failure(DomainError.Validation("RECEIVED_DOCUMENT_UPLOAD_XML_ERROR", response?.Message ?? "Failed to upload XML"));
        }
        catch (Exception ex)
        {
            return Result<bool, DomainError>.Failure(DomainError.Internal("RECEIVED_DOCUMENT_UPLOAD_XML_ERROR", ex.Message));
        }
    }
}

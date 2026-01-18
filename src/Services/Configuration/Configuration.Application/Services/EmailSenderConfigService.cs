using Acontplus.Utilities.Security.Interfaces;

namespace Configuration.Application.Services;

public class EmailSenderConfigService : IEmailSenderConfigService
{
    private readonly ILogger<EmailSenderConfigService> _logger;
    private readonly IRepository<EmailSenderConfig> _emailSenderConfigRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;
    private readonly ISensitiveDataEncryptionService _sensitiveDataEncryptionService;
    private readonly IMapper _mapper;

    public EmailSenderConfigService(
        IUnitOfWork unitOfWork,
        IConfiguration configuration,
        ISensitiveDataEncryptionService sensitiveDataEncryptionService,
        ILogger<EmailSenderConfigService> logger,
        IMapper mapper)
    {
        ArgumentNullException.ThrowIfNull(unitOfWork);
        ArgumentNullException.ThrowIfNull(configuration);
        ArgumentNullException.ThrowIfNull(sensitiveDataEncryptionService);
        ArgumentNullException.ThrowIfNull(logger);
        ArgumentNullException.ThrowIfNull(mapper);

        _unitOfWork = unitOfWork;
        _emailSenderConfigRepository = _unitOfWork.GetRepository<EmailSenderConfig>();
        _configuration = configuration;
        _sensitiveDataEncryptionService = sensitiveDataEncryptionService;
        _logger = logger;
        _mapper = mapper;
    }

    public async Task<Result<EmailSenderConfigItem, DomainError>> AddAsync(EmailSenderConfigCreate request, CancellationToken cancellationToken = default)
    {
        await using var transaction = await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            // Validate business rules
            var validationResult = await ValidateForCreationAsync(request, cancellationToken);
            if (validationResult.IsFailure)
                return Result<EmailSenderConfigItem, DomainError>.Failure(validationResult.Error);

            // Check if configuration already exists for the company
            var existsResult = await ExistsByCompanyAsync(request.CompanyId, cancellationToken);
            if (existsResult.IsSuccess && existsResult.Value)
                return Result<EmailSenderConfigItem, DomainError>.Failure(DomainError.Conflict("EMAIL_CONFIG_EXISTS",
                    "Email configuration already exists for this company"));

            // Encrypt password
            var dataProtectionSettings = _configuration.GetSection("DataProtection");
            var encryptedPassword = await _sensitiveDataEncryptionService.EncryptToBytesAsync(
                dataProtectionSettings["ProtectorKey"]!, request.Password);

            // Create domain model
            var emailSenderConfig = _mapper.Map<EmailSenderConfig>(request);
            emailSenderConfig.EncryptedPassword = encryptedPassword;
            emailSenderConfig.CreatedByUserId = 0; // Will be set by the endpoint
            emailSenderConfig.UpdatedByUserId = 0;

            // Save to repository
            await _emailSenderConfigRepository.AddAsync(emailSenderConfig, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            // Return response
            var response = _mapper.Map<EmailSenderConfigItem>(emailSenderConfig);
            return Result<EmailSenderConfigItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error creating email sender configuration");
            return Result<EmailSenderConfigItem, DomainError>.Failure(DomainError.Internal("CREATE_ERROR", "Failed to create email sender configuration"));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        await using var transaction = await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            if (id <= 0)
                return Result<bool, DomainError>.Failure(DomainError.Validation("INVALID_ID", "Invalid ID provided"));

            // Check if configuration exists
            var config = await _emailSenderConfigRepository.GetByIdAsync(id, cancellationToken);
            if (config == null)
                return Result<bool, DomainError>.Failure(DomainError.NotFound("CONFIG_NOT_FOUND", "Email sender configuration not found"));

            // Delete from repository
            await _emailSenderConfigRepository.DeleteAsync(config, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error deleting email sender configuration with ID {Id}", id);
            return Result<bool, DomainError>.Failure(DomainError.Internal("DELETE_ERROR", "Failed to delete email sender configuration"));
        }
    }

    public async Task<Result<IReadOnlyList<EmailSenderConfigItem>, DomainError>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var configs = await _emailSenderConfigRepository.GetAllAsync(cancellationToken);
            var responses = _mapper.Map<List<EmailSenderConfigItem>>(configs);
            return Result<IReadOnlyList<EmailSenderConfigItem>, DomainError>.Success(responses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching email sender configurations");
            return Result<IReadOnlyList<EmailSenderConfigItem>, DomainError>.Failure(DomainError.Internal("FETCH_ERROR", "Failed to fetch email sender configurations"));
        }
    }

    public async Task<Result<EmailSenderConfigItem, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            if (id <= 0)
                return Result<EmailSenderConfigItem, DomainError>.Failure(DomainError.Validation("INVALID_ID", "Invalid ID provided"));

            var config = await _emailSenderConfigRepository.GetByIdAsync(id, cancellationToken);
            if (config == null)
                return Result<EmailSenderConfigItem, DomainError>.Failure(DomainError.NotFound("CONFIG_NOT_FOUND", "Email sender configuration not found"));

            var response = _mapper.Map<EmailSenderConfigItem>(config);
            return Result<EmailSenderConfigItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching email sender configuration with ID {Id}", id);
            return Result<EmailSenderConfigItem, DomainError>.Failure(DomainError.Internal("FETCH_ERROR", "Failed to fetch email sender configuration"));
        }
    }

    public async Task<Result<EmailSenderConfigItem, DomainError>> UpdateAsync(int id, EmailSenderConfigUpdate request, CancellationToken cancellationToken = default)
    {
        await using var transaction = await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            if (id <= 0)
                return Result<EmailSenderConfigItem, DomainError>.Failure(DomainError.Validation("INVALID_ID", "Invalid ID provided"));

            // Validate business rules
            var validationResult = await ValidateForUpdateAsync(request, cancellationToken);
            if (validationResult.IsFailure)
                return Result<EmailSenderConfigItem, DomainError>.Failure(validationResult.Error);

            // Check if configuration exists
            var existingConfig = await _emailSenderConfigRepository.GetByIdAsync(id, cancellationToken);
            if (existingConfig == null)
                return Result<EmailSenderConfigItem, DomainError>.Failure(DomainError.NotFound("CONFIG_NOT_FOUND", "Email sender configuration not found"));

            // Encrypt password
            var dataProtectionSettings = _configuration.GetSection("DataProtection");
            var encryptedPassword = await _sensitiveDataEncryptionService.EncryptToBytesAsync(
                dataProtectionSettings["ProtectorKey"]!, request.Password);

            // Update domain model
            existingConfig.CompanyId = request.CompanyId;
            existingConfig.IsGlobal = request.IsGlobal;
            existingConfig.SenderEmail = request.SenderEmail;
            existingConfig.SenderName = request.SenderName;
            existingConfig.SmtpServer = request.SmtpServer;
            existingConfig.SmtpPort = request.SmtpPort;
            existingConfig.UseSsl = request.UseSsl;
            existingConfig.Username = request.Username;
            existingConfig.Password = request.Password;
            existingConfig.EncryptedPassword = encryptedPassword;
            existingConfig.UpdatedByUserId = 0; // Will be set by the endpoint

            // Update in repository
            await _emailSenderConfigRepository.UpdateAsync(existingConfig, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            // Return response
            var response = _mapper.Map<EmailSenderConfigItem>(existingConfig);
            return Result<EmailSenderConfigItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error updating email sender configuration with ID {Id}", id);
            return Result<EmailSenderConfigItem, DomainError>.Failure(DomainError.Internal("UPDATE_ERROR", "Failed to update email sender configuration"));
        }
    }

    public async Task<Result<bool, DomainError>> ExistsByCompanyAsync(int companyId, CancellationToken cancellationToken = default)
    {
        try
        {
            var config = await _emailSenderConfigRepository.GetFirstOrDefaultAsync(c => c.CompanyId == companyId, cancellationToken);
            return Result<bool, DomainError>.Success(config != null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if email sender configuration exists for company {CompanyId}", companyId);
            return Result<bool, DomainError>.Failure(DomainError.Internal("CHECK_ERROR", "Failed to check email sender configuration existence"));
        }
    }

    private Task<Result<bool, DomainError>> ValidateForCreationAsync(EmailSenderConfigCreate request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.SenderEmail))
            return Task.FromResult(Result<bool, DomainError>.Failure(DomainError.Validation("INVALID_EMAIL", "Sender email is required")));

        if (string.IsNullOrWhiteSpace(request.SmtpServer))
            return Task.FromResult(Result<bool, DomainError>.Failure(DomainError.Validation("INVALID_SMTP_SERVER", "SMTP server is required")));

        return request.SmtpPort is <= 0 or > 65535
            ? Task.FromResult(Result<bool, DomainError>.Failure(DomainError.Validation("INVALID_SMTP_PORT", "SMTP port must be between 1 and 65535")))
            : string.IsNullOrWhiteSpace(request.Username)
            ? Task.FromResult(Result<bool, DomainError>.Failure(DomainError.Validation("INVALID_USERNAME", "Username is required")))
            : string.IsNullOrWhiteSpace(request.Password)
            ? Task.FromResult(Result<bool, DomainError>.Failure(DomainError.Validation("INVALID_PASSWORD", "Password is required")))
            : Task.FromResult(Result<bool, DomainError>.Success(true));
    }

    private Task<Result<bool, DomainError>> ValidateForUpdateAsync(EmailSenderConfigUpdate request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.SenderEmail))
            return Task.FromResult(Result<bool, DomainError>.Failure(DomainError.Validation("INVALID_EMAIL", "Sender email is required")));

        if (string.IsNullOrWhiteSpace(request.SmtpServer))
            return Task.FromResult(Result<bool, DomainError>.Failure(DomainError.Validation("INVALID_SMTP_SERVER", "SMTP server is required")));

        return request.SmtpPort is <= 0 or > 65535
            ? Task.FromResult(Result<bool, DomainError>.Failure(DomainError.Validation("INVALID_SMTP_PORT", "SMTP port must be between 1 and 65535")))
            : string.IsNullOrWhiteSpace(request.Username)
            ? Task.FromResult(Result<bool, DomainError>.Failure(DomainError.Validation("INVALID_USERNAME", "Username is required")))
            : string.IsNullOrWhiteSpace(request.Password)
            ? Task.FromResult(Result<bool, DomainError>.Failure(DomainError.Validation("INVALID_PASSWORD", "Password is required")))
            : Task.FromResult(Result<bool, DomainError>.Success(true));
    }
}

namespace Configuration.Application.Services;

public class LicenseTypeService : ILicenseTypeService
{
    private readonly IRepository<LicenseType> _licenseTypeRepository;
    private readonly ILogger<LicenseTypeService> _logger;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public LicenseTypeService(IUnitOfWork unitOfWork, ILogger<LicenseTypeService> logger, IMapper mapper)
    {
        ArgumentNullException.ThrowIfNull(unitOfWork);
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _licenseTypeRepository = unitOfWork.GetRepository<LicenseType>();
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Result<LicenseType, DomainError>> AddAsync(LicenseTypeCreate request,
        CancellationToken cancellationToken)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var licenseType = _mapper.Map<LicenseTypeCreate, LicenseType>(request);
            var existingLicenseType =
                await _licenseTypeRepository.GetFirstOrDefaultAsync(x => x.Code == licenseType.Code, cancellationToken);
            if (existingLicenseType != null && existingLicenseType.Id > 0)
                return Result<LicenseType, DomainError>.Failure(DomainError.Conflict("LICENSETYPE_EXISTS",
                    $"License type with code {licenseType.Code} already exists"));

            await _licenseTypeRepository.AddAsync(licenseType, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            return Result<LicenseType, DomainError>.Success(licenseType);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error creating license type");
            return Result<LicenseType, DomainError>.Failure(
                DomainError.Internal("LICENSETYPE_CREATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var licenseType = await _licenseTypeRepository.GetByIdAsync(id, cancellationToken);
            if (licenseType == null)
                return Result<bool, DomainError>.Failure(DomainError.Validation("LICENSETYPE_NOT_FOUND",
                    "License type not found"));

            await _licenseTypeRepository.DeleteAsync(licenseType, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error deleting license type with ID {Id}", id);
            return Result<bool, DomainError>.Failure(DomainError.Internal("LICENSETYPE_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<IReadOnlyList<LicenseType>, DomainError>> GetAllAsync(CancellationToken cancellationToken)
    {
        try
        {
            var licenseTypes = await _licenseTypeRepository.GetAllAsync(cancellationToken);
            return Result<IReadOnlyList<LicenseType>, DomainError>.Success(licenseTypes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving license types");
            return Result<IReadOnlyList<LicenseType>, DomainError>.Failure(
                DomainError.Internal("LICENSETYPE_GETALL_ERROR", ex.Message));
        }
    }

    public async Task<Result<LicenseType, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        try
        {
            var licenseType = await _licenseTypeRepository.GetByIdAsync(id, cancellationToken);
            return licenseType == null
                ? Result<LicenseType, DomainError>.Failure(DomainError.NotFound("LICENSETYPE_NOT_FOUND",
                    "License type not found"))
                : Result<LicenseType, DomainError>.Success(licenseType);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving license type with ID {Id}", id);
            return Result<LicenseType, DomainError>.Failure(DomainError.Internal("LICENSETYPE_GETBYID_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<LicenseType, DomainError>> UpdateAsync(int id, LicenseTypeUpdate request,
        CancellationToken cancellationToken)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var licenseTypeFound = await _licenseTypeRepository.GetByIdAsync(id, cancellationToken);
            if (licenseTypeFound == null)
                return Result<LicenseType, DomainError>.Failure(DomainError.NotFound("LICENSETYPE_NOT_FOUND",
                    "License type not found"));

            var licenseType = _mapper.Map<LicenseTypeUpdate, LicenseType>(request);

            // Check if code is unique (excluding current record)
            var existingWithCode =
                await _licenseTypeRepository.GetFirstOrDefaultAsync(x => x.Code == licenseType.Code && x.Id != id,
                    cancellationToken);
            if (existingWithCode != null && existingWithCode.Id > 0)
                return Result<LicenseType, DomainError>.Failure(DomainError.Conflict("LICENSETYPE_CODE_EXISTS",
                    $"License type with code {licenseType.Code} already exists"));

            licenseTypeFound.Code = licenseType.Code;
            licenseTypeFound.Name = licenseType.Name;
            licenseTypeFound.Description = licenseType.Description;
            licenseTypeFound.IsActive = licenseType.IsActive;
            licenseTypeFound.UpdatedByUserId = licenseType.UpdatedByUserId;

            await _licenseTypeRepository.UpdateAsync(licenseTypeFound, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            return Result<LicenseType, DomainError>.Success(licenseTypeFound);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error updating license type with ID {Id}", id);
            return Result<LicenseType, DomainError>.Failure(
                DomainError.Internal("LICENSETYPE_UPDATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> ExistsByCodeAsync(string code, CancellationToken cancellationToken,
        int? excludeId = null)
    {
        try
        {
            var existingLicenseType = await _licenseTypeRepository.GetFirstOrDefaultAsync(
                x => x.Code == code && (excludeId == null || x.Id != excludeId), cancellationToken);
            return Result<bool, DomainError>.Success(existingLicenseType != null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if license type exists with code {Code}", code);
            return Result<bool, DomainError>.Failure(DomainError.Internal("LICENSETYPE_EXISTS_CHECK_ERROR",
                ex.Message));
        }
    }
}

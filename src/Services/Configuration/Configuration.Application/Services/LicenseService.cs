namespace Configuration.Application.Services;

public class LicenseService : ILicenseService
{
    private readonly IRepository<Licenses> _licenseRepository;
    private readonly IRepository<Applications> _applicationRepository;
    private readonly IRepository<LicenseDetails> _licenseDetailRepository;
    private readonly IRepository<LicenseType> _licenseTypeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<LicenseService> _logger;
    private readonly IMapper _mapper;

    public LicenseService(IUnitOfWork unitOfWork, ILogger<LicenseService> logger, IMapper mapper)
    {
        ArgumentNullException.ThrowIfNull(unitOfWork);
        _unitOfWork = unitOfWork;
        _licenseRepository = _unitOfWork.GetRepository<Licenses>();
        _licenseDetailRepository = _unitOfWork.GetRepository<LicenseDetails>();
        _applicationRepository = _unitOfWork.GetRepository<Applications>();
        _licenseTypeRepository = _unitOfWork.GetRepository<LicenseType>();
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Result<LicenseCreate, DomainError>> AddAsync(LicenseCreate request, int createdByUserId,
        CancellationToken cancellationToken = default)
    {
        await using var tx = await _unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted, cancellationToken);
        try
        {
            var exists = await _licenseRepository.GetFirstOrDefaultAsync(x => x.Code == request.Code && x.LicenseTypeId == request.LicenseTypeId, cancellationToken);
            if (exists != null)
                return Result<LicenseCreate, DomainError>.Failure(DomainError.Conflict("LICENSE_EXISTS", "This license is already registered"));

            if (request.Details == null || request.Details.Count == 0)
                return Result<LicenseCreate, DomainError>.Failure(DomainError.Validation("LICENSE_DETAIL_REQUIRED", "Must add at least one detail"));

            var licenseType = await _licenseTypeRepository.GetByIdAsync(request.LicenseTypeId, cancellationToken);
            if (licenseType == null)
                return Result<LicenseCreate, DomainError>.Failure(DomainError.Validation("LICENSETYPE_NOT_FOUND", "License type does not exist"));

            var license = new Licenses
            {
                Id = 0,
                Code = request.Code,
                LicenseType = licenseType,
                LicenseTypeId = request.LicenseTypeId,
                Cost = request.Cost,
                Tax = request.Tax,
                Discount = request.Discount,
                Total = request.Total,
                CreatedByUserId = createdByUserId,
                IsActive = true
            };

            foreach (var d in request.Details)
            {
                var app = await _applicationRepository.GetByIdAsync(d.ApplicationId, cancellationToken);
                if (app == null)
                    return Result<LicenseCreate, DomainError>.Failure(DomainError.Validation("APPLICATION_NOT_FOUND", $"Application {d.ApplicationId} does not exist"));
                license.LicenseDetails.Add(new LicenseDetails
                {
                    Id = 0,
                    License = license,
                    Application = app,
                    AplicacionId = d.ApplicationId,
                    Cost = d.Cost,
                    Tax = d.Tax,
                    Discount = d.Discount,
                    Total = d.Total,
                    IsActive = true
                });
            }

            await _licenseRepository.AddAsync(license, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await tx.CommitAsync(cancellationToken);

            return Result<LicenseCreate, DomainError>.Success(_mapper.Map<LicenseCreate>(license));
        }
        catch (Exception ex)
        {
            if (!tx.IsCompleted) await tx.RollbackAsync(cancellationToken);
            _logger.LogError(ex, "Error creating license");
            return Result<LicenseCreate, DomainError>.Failure(DomainError.Internal("LICENSE_CREATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        await using var tx = await _unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted, cancellationToken);
        try
        {
            var license = await _licenseRepository.GetByIdAsync(id, cancellationToken);
            if (license == null)
                return Result<bool, DomainError>.Failure(DomainError.Validation("LICENSE_NOT_FOUND", "License not found"));

            await _licenseRepository.DeleteAsync(license, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await tx.CommitAsync(cancellationToken);
            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            if (!tx.IsCompleted) await tx.RollbackAsync(cancellationToken);
            _logger.LogError(ex, "Error deleting license {Id}", id);
            return Result<bool, DomainError>.Failure(DomainError.Internal("LICENSE_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<IReadOnlyList<LicenseItem>, DomainError>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var items = await _licenseRepository.GetAllAsync(cancellationToken);
            var responses = items.Select(license => _mapper.Map<LicenseItem>(license)).ToList();
            return Result<IReadOnlyList<LicenseItem>, DomainError>.Success(responses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting licenses");
            return Result<IReadOnlyList<LicenseItem>, DomainError>.Failure(DomainError.Internal("LICENSE_GETALL_ERROR", ex.Message));
        }
    }

    public async Task<Result<LicenseItem, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var license = await _licenseRepository.GetByIdAsync(id, cancellationToken);
            return license == null
                ? Result<LicenseItem, DomainError>.Failure(DomainError.NotFound("LICENSE_NOT_FOUND", "License not found"))
                : Result<LicenseItem, DomainError>.Success(_mapper.Map<LicenseItem>(license));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting license {Id}", id);
            return Result<LicenseItem, DomainError>.Failure(DomainError.Internal("LICENSE_GETBYID_ERROR", ex.Message));
        }
    }

    public async Task<Result<LicenseUpdate, DomainError>> UpdateAsync(int id, LicenseUpdate request, int updatedByUserId,
        CancellationToken cancellationToken = default)
    {
        await using var tx = await _unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted, cancellationToken);
        try
        {
            var license = await _licenseRepository.GetByIdAsync(id, cancellationToken);
            if (license == null)
                return Result<LicenseUpdate, DomainError>.Failure(DomainError.NotFound("LICENSE_NOT_FOUND", "License not found"));

            if (request.Details == null || request.Details.Count == 0)
                return Result<LicenseUpdate, DomainError>.Failure(DomainError.Validation("LICENSE_DETAIL_REQUIRED", "Must add at least one detail"));

            var licenseType = await _licenseTypeRepository.GetByIdAsync(request.LicenseTypeId, cancellationToken);
            if (licenseType == null)
                return Result<LicenseUpdate, DomainError>.Failure(DomainError.Validation("LICENSETYPE_NOT_FOUND", "License type does not exist"));

            license.Code = request.Code;
            license.LicenseTypeId = request.LicenseTypeId;
            license.Cost = request.Cost;
            license.Tax = request.Tax;
            license.Discount = request.Discount;
            license.Total = request.Total;
            license.UpdatedByUserId = updatedByUserId;

            // Replace details: simple approach
            var existing = license.LicenseDetails.ToList();
            foreach (var e in existing)
            {
                await _licenseDetailRepository.DeleteAsync(e, cancellationToken);
            }

            license.LicenseDetails.Clear();
            foreach (var d in request.Details)
            {
                var app = await _applicationRepository.GetByIdAsync(d.ApplicationId, cancellationToken);
                if (app == null)
                    return Result<LicenseUpdate, DomainError>.Failure(DomainError.Validation("APPLICATION_NOT_FOUND", $"Application {d.ApplicationId} does not exist"));
                license.LicenseDetails.Add(new LicenseDetails
                {
                    Id = 0,
                    License = license,
                    Application = app,
                    AplicacionId = d.ApplicationId,
                    Cost = d.Cost,
                    Tax = d.Tax,
                    Discount = d.Discount,
                    Total = d.Total,
                    IsActive = true
                });
            }

            await _licenseRepository.UpdateAsync(license, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await tx.CommitAsync(cancellationToken);
            return Result<LicenseUpdate, DomainError>.Success(_mapper.Map<LicenseUpdate>(license));
        }
        catch (Exception ex)
        {
            if (!tx.IsCompleted) await tx.RollbackAsync(cancellationToken);
            _logger.LogError(ex, "Error updating license {Id}", id);
            return Result<LicenseUpdate, DomainError>.Failure(DomainError.Internal("LICENSE_UPDATE_ERROR", ex.Message));
        }
    }
}

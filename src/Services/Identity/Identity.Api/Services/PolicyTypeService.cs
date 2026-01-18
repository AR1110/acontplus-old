namespace Identity.Api.Services;

public class PolicyTypeService : IPolicyTypeService
{
    private readonly ILogger<PolicyTypeService> _logger;
    private readonly IRepository<PolicyType> _policyTypeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly MapsterMapper.IMapper _mapper;

    public PolicyTypeService(IUnitOfWork unitOfWork, ILogger<PolicyTypeService> logger, MapsterMapper.IMapper mapper)
    {
        ArgumentNullException.ThrowIfNull(unitOfWork);
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _policyTypeRepository = unitOfWork.GetRepository<PolicyType>();
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Result<PolicyType, DomainError>> AddAsync(PolicyTypeCreate request,
        CancellationToken cancellationToken)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var policyType = _mapper.Map<PolicyTypeCreate, PolicyType>(request);
            var existingPolicyType =
                await _policyTypeRepository.GetFirstOrDefaultAsync(x => x.Code == policyType.Code, cancellationToken);
            if (existingPolicyType != null && existingPolicyType.Id > 0)
                return Result<PolicyType, DomainError>.Failure(DomainError.Conflict("POLICYTYPE_EXISTS",
                    $"Policy type with code {policyType.Code} already exists"));

            await _policyTypeRepository.AddAsync(policyType, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            return Result<PolicyType, DomainError>.Success(policyType);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error creating policy type");
            return Result<PolicyType, DomainError>.Failure(DomainError.Internal("POLICYTYPE_CREATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var policyType = await _policyTypeRepository.GetByIdAsync(id, cancellationToken);
            if (policyType == null)
                return Result<bool, DomainError>.Failure(DomainError.Validation("POLICYTYPE_NOT_FOUND",
                    "Policy type not found"));

            await _policyTypeRepository.DeleteAsync(policyType, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error deleting policy type with ID {Id}", id);
            return Result<bool, DomainError>.Failure(DomainError.Internal("POLICYTYPE_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<IReadOnlyList<PolicyType>, DomainError>> GetAllAsync(CancellationToken cancellationToken)
    {
        try
        {
            var policyTypes = await _policyTypeRepository.GetAllAsync(cancellationToken);
            return Result<IReadOnlyList<PolicyType>, DomainError>.Success(policyTypes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving policy types");
            return Result<IReadOnlyList<PolicyType>, DomainError>.Failure(
                DomainError.Internal("POLICYTYPE_GETALL_ERROR", ex.Message));
        }
    }

    public async Task<Result<PolicyType, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        try
        {
            var policyType = await _policyTypeRepository.GetByIdAsync(id, cancellationToken);
            return policyType == null
                ? Result<PolicyType, DomainError>.Failure(DomainError.NotFound("POLICYTYPE_NOT_FOUND",
                    "Policy type not found"))
                : Result<PolicyType, DomainError>.Success(policyType);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving policy type with ID {Id}", id);
            return Result<PolicyType, DomainError>.Failure(DomainError.Internal("POLICYTYPE_GETBYID_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<PolicyType, DomainError>> UpdateAsync(int id, PolicyTypeUpdate request,
        CancellationToken cancellationToken)
    {
        try
        {
            var policyTypeFound = await _policyTypeRepository.GetByIdAsync(id, cancellationToken);
            if (policyTypeFound == null)
                return Result<PolicyType, DomainError>.Failure(DomainError.NotFound("POLICYTYPE_NOT_FOUND",
                    "Policy type not found"));

            var policyType = _mapper.Map<PolicyTypeUpdate, PolicyType>(request);

            // Check if code is unique (excluding current record)
            var existingWithCode =
                await _policyTypeRepository.GetFirstOrDefaultAsync(x => x.Code == policyType.Code && x.Id != id,
                    cancellationToken);
            if (existingWithCode != null && existingWithCode.Id > 0)
                return Result<PolicyType, DomainError>.Failure(DomainError.Conflict("POLICYTYPE_CODE_EXISTS",
                    $"Policy type with code {policyType.Code} already exists"));

            policyTypeFound.Code = policyType.Code;
            policyTypeFound.Name = policyType.Name;
            policyTypeFound.Description = policyType.Description;
            policyTypeFound.DataType = policyType.DataType;
            policyTypeFound.DefaultValue = policyType.DefaultValue;
            policyTypeFound.IsActive = policyType.IsActive;
            policyTypeFound.UpdatedByUserId = policyType.UpdatedByUserId;

            await _policyTypeRepository.UpdateAsync(policyTypeFound, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result<PolicyType, DomainError>.Success(policyTypeFound);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating policy type with ID {Id}", id);
            return Result<PolicyType, DomainError>.Failure(DomainError.Internal("POLICYTYPE_UPDATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> ExistsByCodeAsync(string code, CancellationToken cancellationToken,
        int? excludeId = null)
    {
        try
        {
            var query = excludeId.HasValue
                ? await _policyTypeRepository.GetFirstOrDefaultAsync(x => x.Code == code && x.Id != excludeId.Value,
                    cancellationToken)
                : await _policyTypeRepository.GetFirstOrDefaultAsync(x => x.Code == code, cancellationToken);

            return Result<bool, DomainError>.Success(query != null && query.Id > 0);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if policy type exists by code {Code}", code);
            return Result<bool, DomainError>.Failure(DomainError.Internal("POLICYTYPE_EXISTS_ERROR", ex.Message));
        }
    }
}

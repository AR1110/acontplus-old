namespace Configuration.Application.Services;

public class SubscriptionTypeService : ISubscriptionTypeService
{
    private readonly ILogger<SubscriptionTypeService> _logger;
    private readonly IRepository<SubscriptionType> _subscriptionTypeRepository;
    private readonly IUnitOfWork _unitOfWork;

    public SubscriptionTypeService(IUnitOfWork unitOfWork, ILogger<SubscriptionTypeService> logger)
    {
        ArgumentNullException.ThrowIfNull(unitOfWork);
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _subscriptionTypeRepository = unitOfWork.GetRepository<SubscriptionType>();
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<Result<SubscriptionType, DomainError>> AddAsync(SubscriptionType subscriptionType,
        CancellationToken cancellationToken)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var existingSubscriptionType =
                await _subscriptionTypeRepository.GetFirstOrDefaultAsync(x => x.Code == subscriptionType.Code,
                    cancellationToken);
            if (existingSubscriptionType != null && existingSubscriptionType.Id > 0)
                return Result<SubscriptionType, DomainError>.Failure(DomainError.Conflict("SUBSCRIPTIONTYPE_EXISTS",
                    $"Subscription type with code {subscriptionType.Code} already exists"));

            await _subscriptionTypeRepository.AddAsync(subscriptionType, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            return Result<SubscriptionType, DomainError>.Success(subscriptionType);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error creating subscription type");
            return Result<SubscriptionType, DomainError>.Failure(DomainError.Internal("SUBSCRIPTIONTYPE_CREATE_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var subscriptionType = await _subscriptionTypeRepository.GetByIdAsync(id, cancellationToken);
            if (subscriptionType == null)
                return Result<bool, DomainError>.Failure(DomainError.Validation("SUBSCRIPTIONTYPE_NOT_FOUND",
                    "Subscription type not found"));

            await _subscriptionTypeRepository.DeleteAsync(subscriptionType, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error deleting subscription type with ID {Id}", id);
            return Result<bool, DomainError>.Failure(DomainError.Internal("SUBSCRIPTIONTYPE_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<IReadOnlyList<SubscriptionType>, DomainError>> GetAllAsync(
        CancellationToken cancellationToken)
    {
        try
        {
            var subscriptionTypes = await _subscriptionTypeRepository.GetAllAsync(cancellationToken);
            return Result<IReadOnlyList<SubscriptionType>, DomainError>.Success(subscriptionTypes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving subscription types");
            return Result<IReadOnlyList<SubscriptionType>, DomainError>.Failure(
                DomainError.Internal("SUBSCRIPTIONTYPE_GETALL_ERROR", ex.Message));
        }
    }

    public async Task<Result<SubscriptionType, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        try
        {
            var subscriptionType = await _subscriptionTypeRepository.GetByIdAsync(id, cancellationToken);
            return subscriptionType == null
                ? Result<SubscriptionType, DomainError>.Failure(DomainError.NotFound("SUBSCRIPTIONTYPE_NOT_FOUND",
                    "Subscription type not found"))
                : Result<SubscriptionType, DomainError>.Success(subscriptionType);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving subscription type with ID {Id}", id);
            return Result<SubscriptionType, DomainError>.Failure(DomainError.Internal("SUBSCRIPTIONTYPE_GETBYID_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<SubscriptionType, DomainError>> UpdateAsync(int id, SubscriptionType subscriptionType,
        CancellationToken cancellationToken)
    {
        try
        {
            var subscriptionTypeFound = await _subscriptionTypeRepository.GetByIdAsync(id, cancellationToken);
            if (subscriptionTypeFound == null)
                return Result<SubscriptionType, DomainError>.Failure(DomainError.NotFound("SUBSCRIPTIONTYPE_NOT_FOUND",
                    "Subscription type not found"));

            // Check if code is unique (excluding current record)
            var existingWithCode =
                await _subscriptionTypeRepository.GetFirstOrDefaultAsync(
                    x => x.Code == subscriptionType.Code && x.Id != id, cancellationToken);
            if (existingWithCode != null && existingWithCode.Id > 0)
                return Result<SubscriptionType, DomainError>.Failure(DomainError.Conflict(
                    "SUBSCRIPTIONTYPE_CODE_EXISTS",
                    $"Subscription type with code {subscriptionType.Code} already exists"));

            subscriptionTypeFound.Code = subscriptionType.Code;
            subscriptionTypeFound.Name = subscriptionType.Name;
            subscriptionTypeFound.Quantity = subscriptionType.Quantity;
            subscriptionTypeFound.Duration = subscriptionType.Duration;
            subscriptionTypeFound.IsActive = subscriptionType.IsActive;
            subscriptionTypeFound.UpdatedByUserId = subscriptionType.UpdatedByUserId;

            await _subscriptionTypeRepository.UpdateAsync(subscriptionTypeFound, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result<SubscriptionType, DomainError>.Success(subscriptionTypeFound);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating subscription type with ID {Id}", id);
            return Result<SubscriptionType, DomainError>.Failure(DomainError.Internal("SUBSCRIPTIONTYPE_UPDATE_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> ExistsByCodeAsync(string code, CancellationToken cancellationToken,
        int? excludeId = null)
    {
        try
        {
            if (excludeId.HasValue)
            {
                var existingWithCode =
                    await _subscriptionTypeRepository.GetFirstOrDefaultAsync(
                        x => x.Code == code && x.Id != excludeId.Value, cancellationToken);
                return Result<bool, DomainError>.Success(existingWithCode != null && existingWithCode.Id > 0);
            }
            else
            {
                var existingWithCode =
                    await _subscriptionTypeRepository.GetFirstOrDefaultAsync(x => x.Code == code, cancellationToken);
                return Result<bool, DomainError>.Success(existingWithCode != null && existingWithCode.Id > 0);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if subscription type exists with code {Code}", code);
            return Result<bool, DomainError>.Failure(DomainError.Internal("SUBSCRIPTIONTYPE_EXISTS_CHECK_ERROR",
                ex.Message));
        }
    }
}
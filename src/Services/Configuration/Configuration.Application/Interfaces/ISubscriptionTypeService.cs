namespace Configuration.Application.Interfaces;

public interface ISubscriptionTypeService
{
    Task<Result<SubscriptionType, DomainError>> AddAsync(SubscriptionType subscriptionType,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<SubscriptionType>, DomainError>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<Result<SubscriptionType, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<SubscriptionType, DomainError>> UpdateAsync(int id, SubscriptionType subscriptionType,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> ExistsByCodeAsync(string code, CancellationToken cancellationToken = default,
        int? excludeId = null);
}
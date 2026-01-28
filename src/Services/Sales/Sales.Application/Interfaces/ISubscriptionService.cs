namespace Sales.Application.Interfaces;

/// <summary>
/// Service interface for managing subscriptions (modern API)
/// </summary>
public interface ISubscriptionService
{
    /// <summary>
    /// Get subscriptions with filtering
    /// </summary>
    Task<Result<SubscriptionListResponse, DomainError>> GetAsync(
        int? companyId = null,
        int? pricingPlanId = null,
        bool? isActive = null,
        int pageNumber = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Get subscription by ID with all related data
    /// </summary>
    Task<Result<SubscriptionResponse, DomainError>> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Get subscriptions for a specific company
    /// </summary>
    Task<Result<SubscriptionListResponse, DomainError>> GetByCompanyAsync(
        int companyId,
        int pageNumber = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Create a new subscription
    /// </summary>
    Task<Result<SubscriptionResponse, DomainError>> CreateAsync(
        CreateSubscriptionRequest request,
        int userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Update an existing subscription
    /// </summary>
    Task<Result<SubscriptionResponse, DomainError>> UpdateAsync(
        int id,
        UpdateSubscriptionRequest request,
        int userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Delete a subscription (soft delete)
    /// </summary>
    Task<Result<bool, DomainError>> DeleteAsync(
        int id,
        int userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Mark subscription as paid
    /// </summary>
    Task<Result<SubscriptionResponse, DomainError>> MarkAsPaidAsync(
        int id,
        int userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Mark subscription as unpaid
    /// </summary>
    Task<Result<SubscriptionResponse, DomainError>> MarkAsUnpaidAsync(
        int id,
        int userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Activate subscription
    /// </summary>
    Task<Result<SubscriptionResponse, DomainError>> ActivateAsync(
        int id,
        int userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Deactivate subscription
    /// </summary>
    Task<Result<SubscriptionResponse, DomainError>> DeactivateAsync(
        int id,
        int userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Renew a subscription
    /// </summary>
    Task<Result<SubscriptionResponse, DomainError>> RenewAsync(
        int id,
        DateTime newEndDate,
        string reason = "auto",
        int userId = 0,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Change subscription plan
    /// </summary>
    Task<Result<SubscriptionResponse, DomainError>> ChangePlanAsync(
        int id,
        int newPricingPlanId,
        string reason = "manual",
        int userId = 0,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Check if subscription has a specific feature
    /// </summary>
    Task<Result<bool, DomainError>> HasFeatureAsync(
        int subscriptionId,
        int applicationId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Check if subscription is expired
    /// </summary>
    Task<Result<bool, DomainError>> IsExpiredAsync(
        int id,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Get subscriptions expiring soon (within X days)
    /// </summary>
    Task<Result<SubscriptionListResponse, DomainError>> GetExpiringAsync(
        int daysUntilExpiration = 30,
        int pageNumber = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Service interface for managing subscription features
/// </summary>
public interface ISubscriptionFeatureService
{
    /// <summary>
    /// Get features for a subscription
    /// </summary>
    Task<Result<ICollection<SubscriptionFeatureResponse>, DomainError>> GetBySubscriptionAsync(
        int subscriptionId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Get feature by ID
    /// </summary>
    Task<Result<SubscriptionFeatureResponse, DomainError>> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Add feature to subscription
    /// </summary>
    Task<Result<SubscriptionFeatureResponse, DomainError>> AddAsync(
        int subscriptionId,
        CreateSubscriptionFeatureRequest request,
        int userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Remove feature from subscription
    /// </summary>
    Task<Result<bool, DomainError>> RemoveAsync(
        int id,
        int userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Track feature usage
    /// </summary>
    Task<Result<FeatureUsageResponse, DomainError>> TrackUsageAsync(
        int subscriptionFeatureId,
        int usageCount,
        string? context = null,
        string? metadata = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Get feature usage history
    /// </summary>
    Task<Result<ICollection<FeatureUsageResponse>, DomainError>> GetUsageHistoryAsync(
        int subscriptionFeatureId,
        DateTime? startDate = null,
        DateTime? endDate = null,
        CancellationToken cancellationToken = default);
}

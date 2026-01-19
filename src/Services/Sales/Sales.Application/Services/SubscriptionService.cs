namespace Sales.Application.Services;

public class SubscriptionService(IUnitOfWork unitOfWork, ILogger<SubscriptionService> logger, IMapper mapper) : ISubscriptionService
{
    private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;
    private readonly IRepository<Subscription> _repository = unitOfWork.GetRepository<Subscription>();
    private readonly IRepository<SubscriptionFeature> _featureRepository = unitOfWork.GetRepository<SubscriptionFeature>();
    private readonly IRepository<FeatureUsage> _usageRepository = unitOfWork.GetRepository<FeatureUsage>();

    public async Task<Result<SubscriptionListResponse, DomainError>> GetAsync(
        int? companyId = null,
        int? pricingPlanId = null,
        bool? isActive = null,
        int pageNumber = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var allSubscriptions = await _repository.GetAllAsync();
            var query = allSubscriptions.AsQueryable()
                .Where(s => !s.IsDeleted);

            if (companyId.HasValue)
                query = query.Where(s => s.CompanyId == companyId.Value);

            if (pricingPlanId.HasValue)
                query = query.Where(s => s.PricingPlanId == pricingPlanId.Value);

            if (isActive.HasValue)
                query = query.Where(s => s.IsActive == isActive.Value);

            var totalCount = query.Count();
            var skip = (pageNumber - 1) * pageSize;

            var subscriptions = query
                .OrderByDescending(s => s.CreatedAt)
                .Skip(skip)
                .Take(pageSize)
                .ToList();

            var responses = subscriptions.Select(s => MapToResponse(s)).ToList();

            return Result<SubscriptionListResponse, DomainError>.Success(new SubscriptionListResponse
            {
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Items = responses
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting subscriptions");
            return Result<SubscriptionListResponse, DomainError>.Failure(
                DomainError.Internal("SUBSCRIPTION_GET_ERROR", ex.Message));
        }
    }

    public async Task<Result<SubscriptionResponse, DomainError>> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var subscription = await _repository.GetFirstOrDefaultAsync(
                s => s.Id == id && !s.IsDeleted,
                cancellationToken,
                s => s.SubscriptionFeatures);

            if (subscription == null)
                return Result<SubscriptionResponse, DomainError>.Failure(
                    DomainError.NotFound("SUBSCRIPTION_NOT_FOUND", "Subscription not found"));

            var response = MapToResponse(subscription);
            return Result<SubscriptionResponse, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting subscription {Id}", id);
            return Result<SubscriptionResponse, DomainError>.Failure(
                DomainError.Internal("SUBSCRIPTION_GET_BY_ID_ERROR", ex.Message));
        }
    }

    public async Task<Result<SubscriptionListResponse, DomainError>> GetByCompanyAsync(
        int companyId,
        int pageNumber = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        return await GetAsync(companyId: companyId, pageNumber: pageNumber, pageSize: pageSize, cancellationToken: cancellationToken);
    }

    public async Task<Result<SubscriptionResponse, DomainError>> CreateAsync(
        CreateSubscriptionRequest request,
        int userId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var pricingPlan = await unitOfWork.GetRepository<PricingPlan>().GetByIdAsync(request.PricingPlanId);
            if (pricingPlan == null)
                return Result<SubscriptionResponse, DomainError>.Failure(DomainError.NotFound("PRICING_PLAN_NOT_FOUND", "Pricing plan not found"));

            var subscription = new Subscription
            {
                Id = 0,
                PricingPlan = pricingPlan,
                PricingPlanId = request.PricingPlanId,
                CompanyId = request.CompanyId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                MaxPaymentDate = request.MaxPaymentDate ?? request.EndDate.AddDays(7),
                Cost = request.Cost,
                Tax = request.Tax,
                Discount = request.Discount,
                Total = request.Total,
                Paid = request.Paid ?? false,
                WarningMessage = request.WarningMessage,
                IsTrial = request.IsTrial,
                TrialExpiresAt = request.TrialExpiresAt,
                AutoRenew = request.AutoRenew,
                IsConsumptionBased = request.IsConsumptionBased,
                AllowOverage = request.AllowOverage,
                OverageBudget = request.OverageBudget,
                CreatedByUserId = userId,
                IsActive = true,
                IsDeleted = false
            };

            // Add features if provided
            if (request.Features.Any())
            {
                foreach (var featureRequest in request.Features)
                {
                    var feature = new SubscriptionFeature
                    {
                        Id = 0,
                        PricingPlanFeatureId = featureRequest.PricingPlanFeatureId,
                        Quantity = featureRequest.Quantity,
                        ActivatedAt = featureRequest.ActivatedAt ?? DateTime.UtcNow,
                        DeactivatedAt = featureRequest.DeactivatedAt,
                        OverrideCost = featureRequest.OverrideCost,
                        OverrideTax = featureRequest.OverrideTax,
                        OverrideDiscount = featureRequest.OverrideDiscount,
                        OverrideTotal = featureRequest.OverrideTotal,
                        Notes = featureRequest.Notes,
                        IsActive = true,
                        IsDeleted = false
                    };
                    subscription.SubscriptionFeatures.Add(feature);
                }
            }

            await _repository.AddAsync(subscription, cancellationToken);
            await unitOfWork.SaveChangesAsync();

            var response = MapToResponse(subscription);
            return Result<SubscriptionResponse, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error creating subscription");
            return Result<SubscriptionResponse, DomainError>.Failure(
                DomainError.Internal("SUBSCRIPTION_CREATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<SubscriptionResponse, DomainError>> UpdateAsync(
        int id,
        UpdateSubscriptionRequest request,
        int userId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var subscription = await _repository.GetFirstOrDefaultAsync(
                s => s.Id == id && !s.IsDeleted,
                cancellationToken,
                s => s.SubscriptionFeatures);

            if (subscription == null)
                return Result<SubscriptionResponse, DomainError>.Failure(
                    DomainError.NotFound("SUBSCRIPTION_NOT_FOUND", "Subscription not found"));

            // Update properties only if provided
            if (request.StartDate.HasValue)
                subscription.StartDate = request.StartDate.Value;
            if (request.EndDate.HasValue)
                subscription.EndDate = request.EndDate.Value;
            if (request.MaxPaymentDate.HasValue)
                subscription.MaxPaymentDate = request.MaxPaymentDate.Value;
            if (request.Cost.HasValue)
                subscription.Cost = request.Cost.Value;
            if (request.Tax.HasValue)
                subscription.Tax = request.Tax.Value;
            if (request.Discount.HasValue)
                subscription.Discount = request.Discount.Value;
            if (request.Total.HasValue)
                subscription.Total = request.Total.Value;
            if (request.Paid.HasValue)
                subscription.Paid = request.Paid.Value;
            if (request.WarningMessage != null)
                subscription.WarningMessage = request.WarningMessage;
            if (request.IsTrial.HasValue)
                subscription.IsTrial = request.IsTrial.Value;
            if (request.TrialExpiresAt.HasValue)
                subscription.TrialExpiresAt = request.TrialExpiresAt;
            if (request.AutoRenew.HasValue)
                subscription.AutoRenew = request.AutoRenew.Value;
            if (request.IsConsumptionBased.HasValue)
                subscription.IsConsumptionBased = request.IsConsumptionBased.Value;
            if (request.AllowOverage.HasValue)
                subscription.AllowOverage = request.AllowOverage.Value;
            if (request.OverageBudget.HasValue)
                subscription.OverageBudget = request.OverageBudget;

            subscription.UpdatedAt = DateTime.UtcNow;
            await _repository.UpdateAsync(subscription, cancellationToken);
            await unitOfWork.SaveChangesAsync();

            var response = MapToResponse(subscription);
            return Result<SubscriptionResponse, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating subscription {Id}", id);
            return Result<SubscriptionResponse, DomainError>.Failure(
                DomainError.Internal("SUBSCRIPTION_UPDATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, int userId, CancellationToken cancellationToken = default)
    {
        try
        {
            var subscription = await _repository.GetByIdAsync(id, cancellationToken);
            if (subscription == null)
                return Result<bool, DomainError>.Failure(
                    DomainError.NotFound("SUBSCRIPTION_NOT_FOUND", "Subscription not found"));

            subscription.IsDeleted = true;
            subscription.UpdatedAt = DateTime.UtcNow;
            await _repository.UpdateAsync(subscription, cancellationToken);
            await unitOfWork.SaveChangesAsync();

            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting subscription {Id}", id);
            return Result<bool, DomainError>.Failure(
                DomainError.Internal("SUBSCRIPTION_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<SubscriptionResponse, DomainError>> MarkAsPaidAsync(int id, int userId, CancellationToken cancellationToken = default)
    {
        try
        {
            var subscription = await _repository.GetByIdAsync(id, cancellationToken);
            if (subscription == null)
                return Result<SubscriptionResponse, DomainError>.Failure(
                    DomainError.NotFound("SUBSCRIPTION_NOT_FOUND", "Subscription not found"));

            subscription.Paid = true;
            subscription.UpdatedAt = DateTime.UtcNow;
            await _repository.UpdateAsync(subscription, cancellationToken);
            await unitOfWork.SaveChangesAsync();

            var response = MapToResponse(subscription);
            return Result<SubscriptionResponse, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error marking subscription as paid {Id}", id);
            return Result<SubscriptionResponse, DomainError>.Failure(
                DomainError.Internal("SUBSCRIPTION_MARK_PAID_ERROR", ex.Message));
        }
    }

    public async Task<Result<SubscriptionResponse, DomainError>> MarkAsUnpaidAsync(int id, int userId, CancellationToken cancellationToken = default)
    {
        try
        {
            var subscription = await _repository.GetByIdAsync(id, cancellationToken);
            if (subscription == null)
                return Result<SubscriptionResponse, DomainError>.Failure(
                    DomainError.NotFound("SUBSCRIPTION_NOT_FOUND", "Subscription not found"));

            subscription.Paid = false;
            subscription.UpdatedAt = DateTime.UtcNow;
            await _repository.UpdateAsync(subscription, cancellationToken);
            await unitOfWork.SaveChangesAsync();

            var response = MapToResponse(subscription);
            return Result<SubscriptionResponse, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error marking subscription as unpaid {Id}", id);
            return Result<SubscriptionResponse, DomainError>.Failure(
                DomainError.Internal("SUBSCRIPTION_MARK_UNPAID_ERROR", ex.Message));
        }
    }

    public async Task<Result<SubscriptionResponse, DomainError>> ActivateAsync(int id, int userId, CancellationToken cancellationToken = default)
    {
        try
        {
            var subscription = await _repository.GetByIdAsync(id, cancellationToken);
            if (subscription == null)
                return Result<SubscriptionResponse, DomainError>.Failure(
                    DomainError.NotFound("SUBSCRIPTION_NOT_FOUND", "Subscription not found"));

            subscription.IsActive = true;
            subscription.UpdatedAt = DateTime.UtcNow;
            await _repository.UpdateAsync(subscription, cancellationToken);
            await unitOfWork.SaveChangesAsync();

            var response = MapToResponse(subscription);
            return Result<SubscriptionResponse, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error activating subscription {Id}", id);
            return Result<SubscriptionResponse, DomainError>.Failure(
                DomainError.Internal("SUBSCRIPTION_ACTIVATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<SubscriptionResponse, DomainError>> DeactivateAsync(int id, int userId, CancellationToken cancellationToken = default)
    {
        try
        {
            var subscription = await _repository.GetByIdAsync(id, cancellationToken);
            if (subscription == null)
                return Result<SubscriptionResponse, DomainError>.Failure(
                    DomainError.NotFound("SUBSCRIPTION_NOT_FOUND", "Subscription not found"));

            subscription.IsActive = false;
            subscription.UpdatedAt = DateTime.UtcNow;
            await _repository.UpdateAsync(subscription, cancellationToken);
            await unitOfWork.SaveChangesAsync();

            var response = MapToResponse(subscription);
            return Result<SubscriptionResponse, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deactivating subscription {Id}", id);
            return Result<SubscriptionResponse, DomainError>.Failure(
                DomainError.Internal("SUBSCRIPTION_DEACTIVATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<SubscriptionResponse, DomainError>> RenewAsync(
        int id,
        DateTime newEndDate,
        string reason = "auto",
        int userId = 0,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var subscription = await _repository.GetByIdAsync(id, cancellationToken);
            if (subscription == null)
                return Result<SubscriptionResponse, DomainError>.Failure(
                    DomainError.NotFound("SUBSCRIPTION_NOT_FOUND", "Subscription not found"));

            subscription.Renew(newEndDate, reason);
            subscription.UpdatedAt = DateTime.UtcNow;
            await _repository.UpdateAsync(subscription, cancellationToken);
            await unitOfWork.SaveChangesAsync();

            var response = MapToResponse(subscription);
            return Result<SubscriptionResponse, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error renewing subscription {Id}", id);
            return Result<SubscriptionResponse, DomainError>.Failure(
                DomainError.Internal("SUBSCRIPTION_RENEW_ERROR", ex.Message));
        }
    }

    public async Task<Result<SubscriptionResponse, DomainError>> ChangePlanAsync(
        int id,
        int newPricingPlanId,
        string reason = "manual",
        int userId = 0,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var subscription = await _repository.GetByIdAsync(id, cancellationToken);
            if (subscription == null)
                return Result<SubscriptionResponse, DomainError>.Failure(
                    DomainError.NotFound("SUBSCRIPTION_NOT_FOUND", "Subscription not found"));

            subscription.ChangePlan(newPricingPlanId, reason);
            subscription.UpdatedAt = DateTime.UtcNow;
            await _repository.UpdateAsync(subscription, cancellationToken);
            await unitOfWork.SaveChangesAsync();

            var response = MapToResponse(subscription);
            return Result<SubscriptionResponse, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error changing subscription plan {Id}", id);
            return Result<SubscriptionResponse, DomainError>.Failure(
                DomainError.Internal("SUBSCRIPTION_CHANGE_PLAN_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> HasFeatureAsync(int subscriptionId, int applicationId, CancellationToken cancellationToken = default)
    {
        try
        {
            var subscription = await _repository.GetFirstOrDefaultAsync(
                s => s.Id == subscriptionId && !s.IsDeleted,
                cancellationToken,
                s => s.SubscriptionFeatures);

            if (subscription == null)
                return Result<bool, DomainError>.Failure(
                    DomainError.NotFound("SUBSCRIPTION_NOT_FOUND", "Subscription not found"));

            var hasFeature = subscription.HasFeature(applicationId);
            return Result<bool, DomainError>.Success(hasFeature);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error checking feature {ApplicationId} for subscription {SubscriptionId}", applicationId, subscriptionId);
            return Result<bool, DomainError>.Failure(
                DomainError.Internal("SUBSCRIPTION_HAS_FEATURE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> IsExpiredAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var subscription = await _repository.GetByIdAsync(id, cancellationToken);
            if (subscription == null)
                return Result<bool, DomainError>.Failure(
                    DomainError.NotFound("SUBSCRIPTION_NOT_FOUND", "Subscription not found"));

            var isExpired = subscription.IsExpired;
            return Result<bool, DomainError>.Success(isExpired);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error checking expiration for subscription {Id}", id);
            return Result<bool, DomainError>.Failure(
                DomainError.Internal("SUBSCRIPTION_IS_EXPIRED_ERROR", ex.Message));
        }
    }

    public async Task<Result<SubscriptionListResponse, DomainError>> GetExpiringAsync(
        int daysUntilExpiration = 30,
        int pageNumber = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var expirationDate = DateTime.UtcNow.AddDays(daysUntilExpiration);

            var allItems = await _repository.GetAllAsync(); var query = allItems.AsQueryable()
                .Where(s => !s.IsDeleted && s.IsActive)
                .Where(s => s.EndDate >= DateTime.UtcNow && s.EndDate <= expirationDate)
                .OrderBy(s => s.EndDate);

            var totalCount = query.Count();
            var skip = (pageNumber - 1) * pageSize;

            var subscriptions = query
                .Skip(skip)
                .Take(pageSize)
                .ToList();

            var responses = subscriptions.Select(s => MapToResponse(s)).ToList();

            return Result<SubscriptionListResponse, DomainError>.Success(new SubscriptionListResponse
            {
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Items = responses
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting expiring subscriptions");
            return Result<SubscriptionListResponse, DomainError>.Failure(
                DomainError.Internal("SUBSCRIPTION_GET_EXPIRING_ERROR", ex.Message));
        }
    }

    private SubscriptionResponse MapToResponse(Subscription subscription)
    {
        return new SubscriptionResponse
        {
            Id = subscription.Id,
            PricingPlanId = subscription.PricingPlanId,
            CompanyId = subscription.CompanyId,
            StartDate = subscription.StartDate.ToString("O"),
            EndDate = subscription.EndDate.ToString("O"),
            MaxPaymentDate = subscription.MaxPaymentDate.ToString("O"),
            Cost = subscription.Cost,
            Tax = subscription.Tax,
            Discount = subscription.Discount,
            Total = subscription.Total,
            Paid = subscription.Paid,
            WarningMessage = subscription.WarningMessage,
            IsTrial = subscription.IsTrial,
            TrialExpiresAt = subscription.TrialExpiresAt,
            AutoRenew = subscription.AutoRenew,
            TrialExtensionsUsed = subscription.TrialExtensionsUsed,
            IsConsumptionBased = subscription.IsConsumptionBased,
            AllowOverage = subscription.AllowOverage,
            OverageBudget = subscription.OverageBudget,
            TotalOverageCost = subscription.TotalOverageCost,
            RenewalCount = subscription.RenewalCount,
            LastRenewalDate = subscription.LastRenewalDate,
            NextRenewalDate = subscription.NextRenewalDate,
            RenewalReason = subscription.RenewalReason,
            PreviousPricingPlanId = subscription.PreviousPricingPlanId,
            PlanChangeDate = subscription.PlanChangeDate,
            PlanChangeReason = subscription.PlanChangeReason,
            IsActive = subscription.IsActive,
            IsDeleted = subscription.IsDeleted,
            CreatedByUserId = subscription.CreatedByUserId,
            CreatedAt = subscription.CreatedAt.ToString("O"),
            UpdatedAt = subscription.UpdatedAt?.ToString("O"),
            Features = subscription.SubscriptionFeatures
                .Where(sf => !sf.IsDeleted)
                .Select(sf => MapFeatureToResponse(sf))
                .ToList()
        };
    }

    private SubscriptionFeatureResponse MapFeatureToResponse(SubscriptionFeature feature)
    {
        return new SubscriptionFeatureResponse
        {
            Id = feature.Id,
            SubscriptionId = feature.SubscriptionId,
            PricingPlanFeatureId = feature.PricingPlanFeatureId,
            Quantity = feature.Quantity,
            ActivatedAt = feature.ActivatedAt,
            DeactivatedAt = feature.DeactivatedAt,
            OverrideCost = feature.OverrideCost,
            OverrideTax = feature.OverrideTax,
            OverrideDiscount = feature.OverrideDiscount,
            OverrideTotal = feature.OverrideTotal,
            ConsumptionLimit = feature.ConsumptionLimit,
            CurrentConsumption = feature.CurrentConsumption,
            ConsumptionResetDate = feature.ConsumptionResetDate,
            OverageQuantity = feature.OverageQuantity,
            OverageCost = feature.OverageCost,
            Notes = feature.Notes,
            IsActive = feature.IsActive,
            CreatedAt = feature.CreatedAt.ToString("O"),
            ApplicationId = feature.PricingPlanFeature?.ApplicationId
        };
    }
}

public class SubscriptionFeatureService(IUnitOfWork unitOfWork, ILogger<SubscriptionFeatureService> logger) : ISubscriptionFeatureService
{
    private readonly IRepository<SubscriptionFeature> _repository = unitOfWork.GetRepository<SubscriptionFeature>();
    private readonly IRepository<FeatureUsage> _usageRepository = unitOfWork.GetRepository<FeatureUsage>();

    public async Task<Result<ICollection<SubscriptionFeatureResponse>, DomainError>> GetBySubscriptionAsync(
        int subscriptionId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var allFeatures = await _repository.GetAllAsync();
            var features = allFeatures
                .Where(sf => sf.SubscriptionId == subscriptionId && !sf.IsDeleted)
                .ToList();


            var responses = features.Select(MapFeatureToResponse).ToList();
            return Result<ICollection<SubscriptionFeatureResponse>, DomainError>.Success(responses);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting features for subscription {SubscriptionId}", subscriptionId);
            return Result<ICollection<SubscriptionFeatureResponse>, DomainError>.Failure(
                DomainError.Internal("SUBSCRIPTION_FEATURE_GET_ERROR", ex.Message));
        }
    }

    public async Task<Result<SubscriptionFeatureResponse, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var feature = await _repository.GetFirstOrDefaultAsync(
                sf => sf.Id == id && !sf.IsDeleted,
                cancellationToken,
                sf => sf.FeatureUsages);

            if (feature == null)
                return Result<SubscriptionFeatureResponse, DomainError>.Failure(
                    DomainError.NotFound("SUBSCRIPTION_FEATURE_NOT_FOUND", "Feature not found"));

            var response = MapFeatureToResponse(feature);
            return Result<SubscriptionFeatureResponse, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting subscription feature {Id}", id);
            return Result<SubscriptionFeatureResponse, DomainError>.Failure(
                DomainError.Internal("SUBSCRIPTION_FEATURE_GET_BY_ID_ERROR", ex.Message));
        }
    }

    public async Task<Result<SubscriptionFeatureResponse, DomainError>> AddAsync(
        int subscriptionId,
        CreateSubscriptionFeatureRequest request,
        int userId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var feature = new SubscriptionFeature
            {
                Id = 0,
                SubscriptionId = subscriptionId,
                PricingPlanFeatureId = request.PricingPlanFeatureId,
                Quantity = request.Quantity,
                ActivatedAt = request.ActivatedAt ?? DateTime.UtcNow,
                DeactivatedAt = request.DeactivatedAt,
                OverrideCost = request.OverrideCost,
                OverrideTax = request.OverrideTax,
                OverrideDiscount = request.OverrideDiscount,
                OverrideTotal = request.OverrideTotal,
                Notes = request.Notes,
                IsActive = true,
                IsDeleted = false
            };

            await _repository.AddAsync(feature, cancellationToken);
            await unitOfWork.SaveChangesAsync();

            var response = MapFeatureToResponse(feature);
            return Result<SubscriptionFeatureResponse, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error adding feature to subscription {SubscriptionId}", subscriptionId);
            return Result<SubscriptionFeatureResponse, DomainError>.Failure(
                DomainError.Internal("SUBSCRIPTION_FEATURE_ADD_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> RemoveAsync(int id, int userId, CancellationToken cancellationToken = default)
    {
        try
        {
            var feature = await _repository.GetByIdAsync(id, cancellationToken);
            if (feature == null)
                return Result<bool, DomainError>.Failure(
                    DomainError.NotFound("SUBSCRIPTION_FEATURE_NOT_FOUND", "Feature not found"));

            feature.IsDeleted = true;
            await _repository.UpdateAsync(feature, cancellationToken);
            await unitOfWork.SaveChangesAsync();

            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error removing subscription feature {Id}", id);
            return Result<bool, DomainError>.Failure(
                DomainError.Internal("SUBSCRIPTION_FEATURE_REMOVE_ERROR", ex.Message));
        }
    }

    public async Task<Result<FeatureUsageResponse, DomainError>> TrackUsageAsync(
        int subscriptionFeatureId,
        int usageCount,
        string? context = null,
        string? metadata = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var usage = new FeatureUsage
            {
                Id = 0,
                SubscriptionFeatureId = subscriptionFeatureId,
                UserId = 0, // TODO: Get from context
                UsageType = "api_call",
                EntityType = context ?? "general",
                Quantity = usageCount,
                Notes = metadata
            };

            await _usageRepository.AddAsync(usage, cancellationToken);
            await unitOfWork.SaveChangesAsync();

            var response = new FeatureUsageResponse
            {
                Id = usage.Id,
                SubscriptionFeatureId = usage.SubscriptionFeatureId,
                UsageCount = usage.Quantity,
                UsageDate = usage.CreatedAt,
                Context = usage.EntityType,
                Metadata = usage.Notes,
                CreatedAt = usage.CreatedAt.ToString("O")
            };

            return Result<FeatureUsageResponse, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error tracking usage for feature {FeatureId}", subscriptionFeatureId);
            return Result<FeatureUsageResponse, DomainError>.Failure(
                DomainError.Internal("SUBSCRIPTION_FEATURE_TRACK_USAGE_ERROR", ex.Message));
        }
    }

    public async Task<Result<ICollection<FeatureUsageResponse>, DomainError>> GetUsageHistoryAsync(
        int subscriptionFeatureId,
        DateTime? startDate = null,
        DateTime? endDate = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var allUsages = await _usageRepository.GetAllAsync();
            var query = allUsages.AsQueryable()
                .Where(fu => fu.SubscriptionFeatureId == subscriptionFeatureId && !fu.IsDeleted);

            if (startDate.HasValue)
                query = query.Where(fu => fu.CreatedAt >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(fu => fu.CreatedAt <= endDate.Value);

            var usages = query
                .OrderByDescending(fu => fu.CreatedAt)
                .ToList();

            var responses = usages.Select(u => new FeatureUsageResponse
            {
                Id = u.Id,
                SubscriptionFeatureId = u.SubscriptionFeatureId,
                UsageCount = u.Quantity,
                UsageDate = u.CreatedAt,
                Context = u.EntityType,
                Metadata = u.Notes,
                CreatedAt = u.CreatedAt.ToString("O")
            }).ToList();

            return Result<ICollection<FeatureUsageResponse>, DomainError>.Success(responses);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting usage history for feature {FeatureId}", subscriptionFeatureId);
            return Result<ICollection<FeatureUsageResponse>, DomainError>.Failure(
                DomainError.Internal("SUBSCRIPTION_FEATURE_GET_HISTORY_ERROR", ex.Message));
        }
    }

    private SubscriptionFeatureResponse MapFeatureToResponse(SubscriptionFeature feature)
    {
        return new SubscriptionFeatureResponse
        {
            Id = feature.Id,
            SubscriptionId = feature.SubscriptionId,
            PricingPlanFeatureId = feature.PricingPlanFeatureId,
            Quantity = feature.Quantity,
            ActivatedAt = feature.ActivatedAt,
            DeactivatedAt = feature.DeactivatedAt,
            OverrideCost = feature.OverrideCost,
            OverrideTax = feature.OverrideTax,
            OverrideDiscount = feature.OverrideDiscount,
            OverrideTotal = feature.OverrideTotal,
            ConsumptionLimit = feature.ConsumptionLimit,
            CurrentConsumption = feature.CurrentConsumption,
            ConsumptionResetDate = feature.ConsumptionResetDate,
            OverageQuantity = feature.OverageQuantity,
            OverageCost = feature.OverageCost,
            Notes = feature.Notes,
            IsActive = feature.IsActive,
            CreatedAt = feature.CreatedAt.ToString("O"),
            FeatureUsages = feature.FeatureUsages
                ?.Where(fu => !fu.IsDeleted)
                .Select(fu => new FeatureUsageResponse
                {
                    Id = fu.Id,
                    SubscriptionFeatureId = fu.SubscriptionFeatureId,
                    UsageCount = fu.Quantity,
                    UsageDate = fu.CreatedAt,
                    Context = fu.EntityType,
                    Metadata = fu.Notes,
                    CreatedAt = fu.CreatedAt.ToString("O")
                }).ToList() ?? []
        };
    }
}

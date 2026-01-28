namespace Sales.Api.Endpoints.SubscriptionEndpoints;

public static class SubscriptionEndpoints
{
    public static void MapSubscriptionEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/subscriptions")
            .WithName("Subscriptions")
            .WithTags("Subscriptions")
            .RequireAuthorization();

        // GET endpoints
        group.MapGet("/", GetSubscriptions)
            .WithName("GetSubscriptions")
            .WithSummary("Get all subscriptions with filters")
            .WithOpenApi();

        group.MapGet("/{id}", GetSubscriptionById)
            .WithName("GetSubscriptionById")
            .WithSummary("Get subscription by ID")
            .WithOpenApi();

        group.MapGet("/company/{companyId}", GetSubscriptionsByCompany)
            .WithName("GetSubscriptionsByCompany")
            .WithSummary("Get subscriptions by company")
            .WithOpenApi();

        group.MapGet("/expiring", GetExpiringSubscriptions)
            .WithName("GetExpiringSubscriptions")
            .WithSummary("Get subscriptions expiring soon")
            .WithOpenApi();

        group.MapGet("/{id}/features", GetSubscriptionFeatures)
            .WithName("GetSubscriptionFeatures")
            .WithSummary("Get features for a subscription")
            .WithOpenApi();

        group.MapGet("/{id}/expired", IsSubscriptionExpired)
            .WithName("IsSubscriptionExpired")
            .WithSummary("Check if subscription is expired")
            .WithOpenApi();

        group.MapGet("/{id}/has-feature/{applicationId}", HasFeature)
            .WithName("HasFeature")
            .WithSummary("Check if subscription has a feature")
            .WithOpenApi();

        // POST endpoints
        group.MapPost("/", CreateSubscription)
            .WithName("CreateSubscription")
            .WithSummary("Create a new subscription")
            .WithOpenApi();

        group.MapPost("/{id}/mark-paid", MarkAsPaid)
            .WithName("MarkAsPaid")
            .WithSummary("Mark subscription as paid")
            .WithOpenApi();

        group.MapPost("/{id}/mark-unpaid", MarkAsUnpaid)
            .WithName("MarkAsUnpaid")
            .WithSummary("Mark subscription as unpaid")
            .WithOpenApi();

        group.MapPost("/{id}/activate", Activate)
            .WithName("ActivateSubscription")
            .WithSummary("Activate subscription")
            .WithOpenApi();

        group.MapPost("/{id}/deactivate", Deactivate)
            .WithName("DeactivateSubscription")
            .WithSummary("Deactivate subscription")
            .WithOpenApi();

        group.MapPost("/{id}/renew", RenewSubscription)
            .WithName("RenewSubscription")
            .WithSummary("Renew subscription")
            .WithOpenApi();

        group.MapPost("/{id}/change-plan", ChangePlan)
            .WithName("ChangePlan")
            .WithSummary("Change subscription plan")
            .WithOpenApi();

        group.MapPost("/{id}/features", AddFeature)
            .WithName("AddFeature")
            .WithSummary("Add feature to subscription")
            .WithOpenApi();

        // PUT endpoints
        group.MapPut("/{id}", UpdateSubscription)
            .WithName("UpdateSubscription")
            .WithSummary("Update subscription")
            .WithOpenApi();

        // DELETE endpoints
        group.MapDelete("/{id}", DeleteSubscription)
            .WithName("DeleteSubscription")
            .WithSummary("Delete subscription")
            .WithOpenApi();

        group.MapDelete("/{id}/features/{featureId}", RemoveFeature)
            .WithName("RemoveFeature")
            .WithSummary("Remove feature from subscription")
            .WithOpenApi();
    }

    private static async Task<IResult> GetSubscriptions(
        [FromQuery] int? companyId,
        [FromQuery] int? pricingPlanId,
        [FromQuery] bool? isActive,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        ISubscriptionService subscriptionService = null!,
        CancellationToken cancellationToken = default)
    {
        var result = await subscriptionService.GetAsync(companyId, pricingPlanId, isActive, pageNumber, pageSize, cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
    }

    private static async Task<IResult> GetSubscriptionById(
        int id,
        ISubscriptionService subscriptionService = null!,
        CancellationToken cancellationToken = default)
    {
        var result = await subscriptionService.GetByIdAsync(id, cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : Results.NotFound(result.Error);
    }

    private static async Task<IResult> GetSubscriptionsByCompany(
        int companyId,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        ISubscriptionService subscriptionService = null!,
        CancellationToken cancellationToken = default)
    {
        var result = await subscriptionService.GetByCompanyAsync(companyId, pageNumber, pageSize, cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
    }

    private static async Task<IResult> GetExpiringSubscriptions(
        [FromQuery] int daysUntilExpiration = 30,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        ISubscriptionService subscriptionService = null!,
        CancellationToken cancellationToken = default)
    {
        var result = await subscriptionService.GetExpiringAsync(daysUntilExpiration, pageNumber, pageSize, cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
    }

    private static async Task<IResult> GetSubscriptionFeatures(
        int id,
        ISubscriptionFeatureService featureService = null!,
        CancellationToken cancellationToken = default)
    {
        var result = await featureService.GetBySubscriptionAsync(id, cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : Results.NotFound(result.Error);
    }

    private static async Task<IResult> IsSubscriptionExpired(
        int id,
        ISubscriptionService subscriptionService = null!,
        CancellationToken cancellationToken = default)
    {
        var result = await subscriptionService.IsExpiredAsync(id, cancellationToken);
        return result.IsSuccess ? Results.Ok(new { isExpired = result.Value }) : Results.NotFound(result.Error);
    }

    private static async Task<IResult> HasFeature(
        int id,
        int applicationId,
        ISubscriptionService subscriptionService = null!,
        CancellationToken cancellationToken = default)
    {
        var result = await subscriptionService.HasFeatureAsync(id, applicationId, cancellationToken);
        return result.IsSuccess ? Results.Ok(new { hasFeature = result.Value }) : Results.NotFound(result.Error);
    }

    private static async Task<IResult> CreateSubscription(
        CreateSubscriptionRequest request,
        ISubscriptionService subscriptionService = null!,
        IUserContext userContext = null!,
        CancellationToken cancellationToken = default)
    {
        var result = await subscriptionService.CreateAsync(request, userContext.GetUserId(), cancellationToken);
        return result.IsSuccess ? Results.Created($"/api/subscriptions/{result.Value.Id}", result.Value) : Results.BadRequest(result.Error);
    }

    private static async Task<IResult> UpdateSubscription(
        int id,
        UpdateSubscriptionRequest request,
        ISubscriptionService subscriptionService = null!,
        IUserContext userContext = null!,
        CancellationToken cancellationToken = default)
    {
        var result = await subscriptionService.UpdateAsync(id, request, userContext.GetUserId(), cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
    }

    private static async Task<IResult> DeleteSubscription(
        int id,
        ISubscriptionService subscriptionService = null!,
        IUserContext userContext = null!,
        CancellationToken cancellationToken = default)
    {
        var result = await subscriptionService.DeleteAsync(id, userContext.GetUserId(), cancellationToken);
        return result.IsSuccess ? Results.NoContent() : Results.BadRequest(result.Error);
    }

    private static async Task<IResult> MarkAsPaid(
        int id,
        ISubscriptionService subscriptionService = null!,
        IUserContext userContext = null!,
        CancellationToken cancellationToken = default)
    {
        var result = await subscriptionService.MarkAsPaidAsync(id, userContext.GetUserId(), cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
    }

    private static async Task<IResult> MarkAsUnpaid(
        int id,
        ISubscriptionService subscriptionService = null!,
        IUserContext userContext = null!,
        CancellationToken cancellationToken = default)
    {
        var result = await subscriptionService.MarkAsUnpaidAsync(id, userContext.GetUserId(), cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
    }

    private static async Task<IResult> Activate(
        int id,
        ISubscriptionService subscriptionService = null!,
        IUserContext userContext = null!,
        CancellationToken cancellationToken = default)
    {
        var result = await subscriptionService.ActivateAsync(id, userContext.GetUserId(), cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
    }

    private static async Task<IResult> Deactivate(
        int id,
        ISubscriptionService subscriptionService = null!,
        IUserContext userContext = null!,
        CancellationToken cancellationToken = default)
    {
        var result = await subscriptionService.DeactivateAsync(id, userContext.GetUserId(), cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
    }

    private static async Task<IResult> RenewSubscription(
        int id,
        RenewSubscriptionRequest request,
        ISubscriptionService subscriptionService = null!,
        IUserContext userContext = null!,
        CancellationToken cancellationToken = default)
    {
        var result = await subscriptionService.RenewAsync(id, request.NewEndDate, request.Reason ?? "auto", userContext.GetUserId(), cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
    }

    private static async Task<IResult> ChangePlan(
        int id,
        ChangePlanRequest request,
        ISubscriptionService subscriptionService = null!,
        IUserContext userContext = null!,
        CancellationToken cancellationToken = default)
    {
        var result = await subscriptionService.ChangePlanAsync(id, request.NewPricingPlanId, request.Reason ?? "manual", userContext.GetUserId(), cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : Results.BadRequest(result.Error);
    }

    private static async Task<IResult> AddFeature(
        int id,
        CreateSubscriptionFeatureRequest request,
        ISubscriptionFeatureService featureService = null!,
        IUserContext userContext = null!,
        CancellationToken cancellationToken = default)
    {
        var result = await featureService.AddAsync(id, request, userContext.GetUserId(), cancellationToken);
        return result.IsSuccess ? Results.Created($"/api/subscriptions/{id}/features/{result.Value.Id}", result.Value) : Results.BadRequest(result.Error);
    }

    private static async Task<IResult> RemoveFeature(
        int id,
        int featureId,
        ISubscriptionFeatureService featureService = null!,
        IUserContext userContext = null!,
        CancellationToken cancellationToken = default)
    {
        var result = await featureService.RemoveAsync(featureId, userContext.GetUserId(), cancellationToken);
        return result.IsSuccess ? Results.NoContent() : Results.BadRequest(result.Error);
    }

    private class RenewSubscriptionRequest
    {
        public DateTime NewEndDate { get; set; }
        public string? Reason { get; set; }
    }

    private class ChangePlanRequest
    {
        public int NewPricingPlanId { get; set; }
        public string? Reason { get; set; }
    }
}

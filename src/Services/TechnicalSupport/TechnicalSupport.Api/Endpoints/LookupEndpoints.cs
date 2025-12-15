namespace TechnicalSupport.Api.Endpoints;

public static class LookupEndpoints
{
    public static void MapLookupEndpoints(this IEndpointRouteBuilder app)
    {
        var storedProcedureName = "TechnicalSupport.GetLookups";
        var group = app.MapGroup("/api/lookups")
            .RequireAuthorization()

            .WithDescription("Endpoints for managing technical support lookups.")
            .WithTags("Lookups");

        group.MapGet("/", async (
                FilterQuery filterQuery,
                ILookupService lookupService,
                IUserContext userContext,
                CancellationToken cancellationToken) =>
            {
                var userRoleId = userContext.GetClaimValue<int>("userRoleId");

                var filterRequest = filterQuery.Adapt<FilterRequest>();

                if (userRoleId != 0)
                {
                    filterRequest = filterRequest.WithFilter("userRoleId", userRoleId);
                }

                return await lookupService.GetLookupsAsync(storedProcedureName, filterRequest, cancellationToken)
                    .ToGetMinimalApiResultAsync();
            })
            .WithName("GetLookups")
            .WithSummary("Get technical support lookups")
            .WithDescription("Retrieve technical support lookups based on filters.")
            .Produces<IDictionary<string, IEnumerable<LookupItem>>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPost("/refresh", async (
                FilterQuery filterQuery,
                ILookupService lookupService,
                IUserContext userContext,
                CancellationToken cancellationToken) =>
            {
                var userRoleId = userContext.GetClaimValue<int>("userRoleId");

                var filterRequest = filterQuery.Adapt<FilterRequest>();

                if (userRoleId != 0)
                {
                    filterRequest = filterRequest.WithFilter("userRoleId", userRoleId);
                }

                return await lookupService.RefreshLookupsAsync(storedProcedureName, filterRequest, cancellationToken)
                    .ToGetMinimalApiResultAsync();
            })
            .WithName("RefreshLookups")
            .WithSummary("Refresh technical support lookups cache")
            .WithDescription("Forces a cache refresh for technical support lookups based on filters.")
            .Produces<IDictionary<string, IEnumerable<LookupItem>>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}

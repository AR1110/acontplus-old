using Restaurant.Application.Dtos.Statistics;

namespace Restaurant.Api.Endpoints;

/// <summary>
/// Minimal API endpoints for restaurant statistics using modern Result pattern
/// </summary>
public static class StatisticsEndpoints
{
    public static void MapStatisticsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/statistics")
            .RequireAuthorization()
            .WithDescription("Endpoints for restaurant statistics and analytics.")
            .WithTags("Statistics");

        // Dashboard Statistics
        group.MapGet("/dashboard", GetDashboardStats)
            .WithName("GetDashboardStats")
            .WithSummary("Get dashboard statistics")
            .WithDescription("Retrieve comprehensive dashboard statistics for the specified date range. Use 'startDate' and 'endDate' query parameters.")
            .Produces<DashboardStatsDto>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        // Real-time Statistics
        group.MapGet("/real-time", GetRealTimeStats)
            .WithName("GetRealTimeStats")
            .WithSummary("Get real-time statistics")
            .WithDescription("Retrieve current real-time statistics including active tables, pending orders, and current revenue.")
            .Produces<RealTimeStatsDto>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        // Aggregated Statistics
        group.MapGet("/aggregated", GetAggregatedStats)
            .WithName("GetAggregatedStats")
            .WithSummary("Get aggregated statistics")
            .WithDescription("Retrieve aggregated statistics grouped by specified interval (day/week/month).")
            .Produces<List<AggregatedStatsDto>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        // Trends
        group.MapGet("/trends", GetTrends)
            .WithName("GetTrends")
            .WithSummary("Get metric trends")
            .WithDescription("Retrieve trend data for a specific metric (specified in Filters.Metric) over the specified date range.")
            .Produces<List<TrendDto>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    /// <summary>
    /// Get dashboard statistics
    /// </summary>
    private static async Task<IResult> GetDashboardStats(
        FilterQuery filterQuery,
        IStatisticsService service,
        IUserContext userContext,
        CancellationToken cancellationToken)
    {
        var filterRequest = filterQuery.Adapt<FilterRequest>();

        var userRoleId = userContext.GetClaimValue<int>("userRoleId");
        if (userRoleId != 0)
        {
            filterRequest = filterRequest.WithFilter("userRoleId", userRoleId);
        }

        return await service.GetDashboardStatsAsync(filterRequest, cancellationToken)
            .ToGetMinimalApiResultAsync();
    }

    /// <summary>
    /// Get real-time statistics
    /// </summary>
    private static async Task<IResult> GetRealTimeStats(
        FilterQuery? filterQuery,
        IStatisticsService service,
        IUserContext userContext,
        CancellationToken cancellationToken)
    {
        var filterRequest = filterQuery?.Adapt<FilterRequest>();

        var userRoleId = userContext.GetClaimValue<int>("userRoleId");
        if (userRoleId != 0 && filterRequest != null)
        {
            filterRequest = filterRequest.WithFilter("userRoleId", userRoleId);
        }

        return await service.GetRealTimeStatsAsync(filterRequest, cancellationToken)
            .ToGetMinimalApiResultAsync();
    }

    /// <summary>
    /// Get aggregated statistics
    /// </summary>
    private static async Task<IResult> GetAggregatedStats(
        FilterQuery filterQuery,
        IStatisticsService service,
        IUserContext userContext,
        CancellationToken cancellationToken)
    {
        var filterRequest = filterQuery.Adapt<FilterRequest>();

        var userRoleId = userContext.GetClaimValue<int>("userRoleId");
        if (userRoleId != 0)
        {
            filterRequest = filterRequest.WithFilter("userRoleId", userRoleId);
        }

        return await service.GetAggregatedStatsAsync(filterRequest, cancellationToken)
            .ToGetMinimalApiResultAsync();
    }

    /// <summary>
    /// Get metric trends
    /// </summary>
    private static async Task<IResult> GetTrends(
        FilterQuery filterQuery,
        IStatisticsService service,
        IUserContext userContext,
        CancellationToken cancellationToken)
    {
        var filterRequest = filterQuery.Adapt<FilterRequest>();

        var userRoleId = userContext.GetClaimValue<int>("userRoleId");
        if (userRoleId != 0)
        {
            filterRequest = filterRequest.WithFilter("userRoleId", userRoleId);
        }

        return await service.GetTrendsAsync(filterRequest, cancellationToken)
            .ToGetMinimalApiResultAsync();
    }
}

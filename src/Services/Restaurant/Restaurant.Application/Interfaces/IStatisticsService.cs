using Restaurant.Application.Dtos.Statistics;

namespace Restaurant.Application.Interfaces;

/// <summary>
/// Service interface for restaurant statistics using modern Result pattern
/// </summary>
public interface IStatisticsService
{
    /// <summary>
    /// Get dashboard statistics for a date range
    /// </summary>
    Task<Result<DashboardStatsDto, DomainError>> GetDashboardStatsAsync(FilterRequest filterRequest, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get real-time statistics
    /// </summary>
    Task<Result<RealTimeStatsDto, DomainError>> GetRealTimeStatsAsync(FilterRequest? filterRequest = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get aggregated statistics with grouping
    /// </summary>
    Task<Result<List<AggregatedStatsDto>, DomainError>> GetAggregatedStatsAsync(FilterRequest filterRequest, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get trends for metrics (metric specified in Filters.Metric)
    /// </summary>
    Task<Result<List<TrendDto>, DomainError>> GetTrendsAsync(FilterRequest filterRequest, CancellationToken cancellationToken = default);
}

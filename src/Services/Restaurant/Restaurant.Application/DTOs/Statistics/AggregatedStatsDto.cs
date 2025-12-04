using Acontplus.Analytics.Dtos;

namespace Restaurant.Application.Dtos.Statistics;

/// <summary>
/// Restaurant-specific aggregated statistics extending universal analytics base
/// Uses all base properties without additional restaurant-specific fields
/// </summary>
public class AggregatedStatsDto : BaseAggregatedStatsDto
{
    // Restaurant domain uses base class as-is
    // All aggregation needs are covered by BaseAggregatedStatsDto
}

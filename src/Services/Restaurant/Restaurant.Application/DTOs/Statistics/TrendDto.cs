using Acontplus.Analytics.Dtos;

namespace Restaurant.Application.Dtos.Statistics;

/// <summary>
/// Restaurant-specific trend analysis extending universal analytics base
/// Uses all base properties without additional restaurant-specific fields
/// </summary>
public class TrendDto : BaseTrendDto
{
    // Restaurant domain uses base class as-is
    // All trend analysis needs are covered by BaseTrendDto
}

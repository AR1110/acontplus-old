using Acontplus.Core.Extensions;
using Restaurant.Application.Dtos.Statistics;
using Restaurant.Application.Helpers;

namespace Restaurant.Application.Services;

public class StatisticsService(IAdoRepository adoRepository) : IStatisticsService
{
    private const string ModuleName = "Restaurant.Statistics";
    private const string DefaultLanguage = "es"; // Spanish by default

    public async Task<Result<DashboardStatsDto, DomainError>> GetDashboardStatsAsync(
      FilterRequest filterRequest,
      CancellationToken cancellationToken = default)
    {
        try
        {
            var commandOptions = new CommandOptionsDto { CommandTimeout = 30 };

            var results = await adoRepository.GetFilteredFromStoredProcedureAsync<DashboardStatsDto>(
                $"{ModuleName}GetDashboard",
                filterRequest,
                commandOptions,
                cancellationToken
            );

            var result = results.FirstOrDefault();

            if (result == null)
            {
                var error = DomainError.NotFound("DASHBOARD_STATS_NOT_FOUND",
                    "No dashboard statistics were found for the specified date range.");
                return Result<DashboardStatsDto, DomainError>.Failure(error);
            }

            // Populate localized labels
            var language = filterRequest.GetFilterValue<string>("Language") ?? DefaultLanguage;
            result.Labels = StatisticsLocalization.GetDashboardLabels(language);

            return Result<DashboardStatsDto, DomainError>.Success(result);
        }
        catch (Exception ex)
        {
            var error = DomainError.Internal("DASHBOARD_STATS_ERROR",
                $"An error occurred while retrieving dashboard statistics. {ex.Message}");
            return Result<DashboardStatsDto, DomainError>.Failure(error);
        }
    }

    public async Task<Result<RealTimeStatsDto, DomainError>> GetRealTimeStatsAsync(
        FilterRequest? filterRequest = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            filterRequest ??= new FilterRequest();
            var commandOptions = new CommandOptionsDto { CommandTimeout = 30 };

            var results = await adoRepository.GetFilteredFromStoredProcedureAsync<RealTimeStatsDto>(
                $"{ModuleName}GetRealTime",
                filterRequest,
                commandOptions,
                cancellationToken
            );

            var result = results.FirstOrDefault();

            if (result == null)
            {
                var error = DomainError.NotFound("REALTIME_STATS_NOT_FOUND",
                    "No real-time statistics were found.");
                return Result<RealTimeStatsDto, DomainError>.Failure(error);
            }

            // Populate localized labels
            var language = filterRequest.GetFilterValue<string>("Language") ?? DefaultLanguage;
            result.Labels = StatisticsLocalization.GetRealTimeLabels(language);

            return Result<RealTimeStatsDto, DomainError>.Success(result);
        }
        catch (Exception ex)
        {
            var error = DomainError.Internal("REALTIME_STATS_ERROR",
                $"An error occurred while retrieving real-time statistics. {ex.Message}");
            return Result<RealTimeStatsDto, DomainError>.Failure(error);
        }
    }

    public async Task<Result<List<AggregatedStatsDto>, DomainError>> GetAggregatedStatsAsync(
        FilterRequest filterRequest,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var commandOptions = new CommandOptionsDto { CommandTimeout = 30 };

            var result = await adoRepository.GetFilteredFromStoredProcedureAsync<AggregatedStatsDto>(
                $"{ModuleName}GetAggregated",
                filterRequest,
                commandOptions,
                cancellationToken
            );

            if (result == null || !result.Any())
            {
                var error = DomainError.NotFound("AGGREGATED_STATS_NOT_FOUND",
                    "No aggregated statistics were found for the specified parameters.");
                return Result<List<AggregatedStatsDto>, DomainError>.Failure(error);
            }

            // Populate localized labels for all items
            var language = filterRequest.GetFilterValue<string>("Language") ?? DefaultLanguage;
            var labels = StatisticsLocalization.GetDashboardLabels(language); // Aggregated uses dashboard labels
            foreach (var item in result)
            {
                item.Labels = labels;
            }

            return Result<List<AggregatedStatsDto>, DomainError>.Success(result);
        }
        catch (Exception ex)
        {
            var error = DomainError.Internal("AGGREGATED_STATS_ERROR",
                $"An error occurred while retrieving aggregated statistics. {ex.Message}");
            return Result<List<AggregatedStatsDto>, DomainError>.Failure(error);
        }
    }

    public async Task<Result<List<TrendDto>, DomainError>> GetTrendsAsync(
        FilterRequest filterRequest,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var commandOptions = new CommandOptionsDto { CommandTimeout = 30 };

            var result = await adoRepository.GetFilteredFromStoredProcedureAsync<TrendDto>(
                $"{ModuleName}GetTrends",
                filterRequest,
                commandOptions,
                cancellationToken
            );

            if (result == null || !result.Any())
            {
                var error = DomainError.NotFound("TRENDS_NOT_FOUND",
                    "No trend data found for the specified parameters.");
                return Result<List<TrendDto>, DomainError>.Failure(error);
            }

            // Populate localized labels for all items
            var language = filterRequest.GetFilterValue<string>("Language") ?? DefaultLanguage;
            var labels = StatisticsLocalization.GetDashboardLabels(language); // Trends uses dashboard labels
            foreach (var item in result)
            {
                item.Labels = labels;
            }

            return Result<List<TrendDto>, DomainError>.Success(result);
        }
        catch (Exception ex)
        {
            var error = DomainError.Internal("TRENDS_ERROR",
                $"An error occurred while retrieving trend data. {ex.Message}");
            return Result<List<TrendDto>, DomainError>.Failure(error);
        }
    }
}

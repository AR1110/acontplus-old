using System.Collections.Concurrent;
using System.Globalization;
using System.Text.Json;
using Humanizer;
using Restaurant.Application.Dtos;

namespace Restaurant.Application.Services;

public class LookupService(IAdoRepository adoRepository) : ILookupService
{
    private const string CacheKeyPrefix = "cache_key";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(30);

    private static readonly ConcurrentDictionary<string, CacheEntry>
        LookupCache = new(StringComparer.OrdinalIgnoreCase);

    public async Task<Result<IDictionary<string, IEnumerable<LookupItem>>, DomainError>> GetLookupsAsync(
        FilterRequest filterRequest, CancellationToken cancellationToken = default)
    {
        try
        {
            var cacheKey = BuildCacheKey(filterRequest);

            if (TryGetCachedResult(cacheKey, out var cachedResult))
            {
                return Result<IDictionary<string, IEnumerable<LookupItem>>, DomainError>.Success(cachedResult);
            }

            return await FetchAndCacheLookupsAsync(filterRequest, cacheKey, cancellationToken);
        }
        catch (Exception ex)
        {
            var error = DomainError.Internal("LOOKUPS_GET_ERROR",
                $"An error occurred while retrieving lookups. {ex.Message}");
            return Result<IDictionary<string, IEnumerable<LookupItem>>, DomainError>.Failure(error);
        }
    }

    public async Task<Result<IDictionary<string, IEnumerable<LookupItem>>, DomainError>> RefreshLookupsAsync(
        FilterRequest filterRequest, CancellationToken cancellationToken = default)
    {
        try
        {
            var cacheKey = BuildCacheKey(filterRequest);

            LookupCache.TryRemove(cacheKey, out _);

            return await FetchAndCacheLookupsAsync(filterRequest, cacheKey, cancellationToken);
        }
        catch (Exception ex)
        {
            var error = DomainError.Internal("LOOKUPS_REFRESH_ERROR",
                $"An error occurred while refreshing lookups. {ex.Message}");
            return Result<IDictionary<string, IEnumerable<LookupItem>>, DomainError>.Failure(error);
        }
    }

    private static bool TryGetCachedResult(string cacheKey, out IDictionary<string, IEnumerable<LookupItem>> result)
    {
        result = default!;

        if (!LookupCache.TryGetValue(cacheKey, out var cacheEntry))
        {
            return false;
        }

        if (cacheEntry.ExpirationUtc <= DateTimeOffset.UtcNow)
        {
            LookupCache.TryRemove(cacheKey, out _);
            return false;
        }

        result = cacheEntry.Data;
        return true;
    }

    private static void StoreInCache(string cacheKey, IDictionary<string, IEnumerable<LookupItem>> payload)
    {
        var entry = new CacheEntry(payload, DateTimeOffset.UtcNow.Add(CacheDuration));
        LookupCache[cacheKey] = entry;
    }

    private async Task<Result<IDictionary<string, IEnumerable<LookupItem>>, DomainError>> FetchAndCacheLookupsAsync(
        FilterRequest filterRequest,
        string cacheKey,
        CancellationToken cancellationToken)
    {
        var dataSet = await adoRepository.GetFilteredDataSetAsync(
            "Restaurant.GetLookups",
            filterRequest,
            options: new CommandOptionsDto { WithTableNames = false });

        if (DataValidation.DataSetIsNull(dataSet, removeEmptyDt: true))
        {
            return Result<IDictionary<string, IEnumerable<LookupItem>>, DomainError>.Failure(
                DomainError.NotFound("LOOKUPS_EMPTY", "The lookup query returned no data sets."));
        }

        var resultPayload = dataSet.Tables
            .Cast<DataTable>()
            .Where(dt => dt.Rows.Count > 0)
            .SelectMany(dt => dt.AsEnumerable())
            .GroupBy(row => row.Field<string>("TableName")) // Group by the TableName column
            .ToDictionary(
                group => (string.IsNullOrWhiteSpace(group.Key) ? "default" : group.Key).Camelize(),
                group => (IEnumerable<LookupItem>)group
                    .Select(row => new LookupItem(
                        row.Field<int?>("Id"),
                        row.Field<string?>("Code"),
                        row.Field<string?>("Value"),
                        row.Field<int?>("DisplayOrder"),
                        row.Field<int?>("ParentId"),
                        row.Field<bool?>("IsDefault"),
                        row.Field<string?>("Metadata")))
                    .ToArray(),
                StringComparer.OrdinalIgnoreCase);

        StoreInCache(cacheKey, resultPayload);

        return Result<IDictionary<string, IEnumerable<LookupItem>>, DomainError>.Success(resultPayload);
    }

    private static string BuildCacheKey(FilterRequest filterRequest)
    {
        var module = NormalizeSegment(ExtractFilterValue(filterRequest, "module"));
        var context = NormalizeSegment(ExtractFilterValue(filterRequest, "context"));
        return $"{CacheKeyPrefix}_{module}_{context}";
    }

    private static string NormalizeSegment(string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? "default"
            : value.Trim().ToLowerInvariant();
    }

    private static string ExtractFilterValue(FilterRequest filterRequest, string propertyName)
    {
        if (filterRequest.Filters == null || filterRequest.Filters.Count == 0)
        {
            return string.Empty;
        }

        if (!filterRequest.Filters.TryGetValue(propertyName, out var rawValue) || rawValue is null)
        {
            return string.Empty;
        }

        return rawValue switch
        {
            string str => str,
            IFormattable formattable => formattable.ToString(null, CultureInfo.InvariantCulture),
            JsonElement jsonElement => jsonElement.ValueKind switch
            {
                JsonValueKind.String => jsonElement.GetString() ?? string.Empty,
                JsonValueKind.Number => jsonElement.GetRawText(),
                JsonValueKind.True => bool.TrueString,
                JsonValueKind.False => bool.FalseString,
                _ => jsonElement.ToString()
            },
            _ => rawValue.ToString() ?? string.Empty
        };
    }

    private sealed record CacheEntry(
        IDictionary<string, IEnumerable<LookupItem>> Data,
        DateTimeOffset ExpirationUtc);
}

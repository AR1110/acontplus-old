using Microsoft.Extensions.Caching.Memory;

namespace Billing.Api.Controllers;

public class DocumentoElectronicoController(IMemoryCache _cache, IDocumentoElectronicoService documentoElectronicoService)
    : BaseApiController
{
    private const string UserRoleId = "userRoleId";

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>(UserRoleId) }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await documentoElectronicoService.GetAsync(parameters));
    }

    [HttpGet("GetByStatus")]
    public async Task<IActionResult> GetByStatus(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>(UserRoleId) }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await documentoElectronicoService.GetByStatusAsync(parameters));
    }

    [HttpGet("GetDataForm")]
    public async Task<IActionResult> GetDataForm()
    {
        var parameters = new Dictionary<string, object>
        {
            {
                "userRoleId", User.GetClaimValue<int>(UserRoleId)
            }
        };
        return Ok(await documentoElectronicoService.GetDataFormAsync(parameters));
    }

    [HttpGet("GetFilters")]
    public async Task<IActionResult> GetFilters()
    {
        var cacheKey = $"doc_elect_filters_data_${User.GetClaimValue<int>(UserRoleId)}";

        if (_cache.TryGetValue(cacheKey, out SpResponse cachedData))
        {
            //_logger.LogInformation("Datos de filtros obtenidos desde caché");
            return Ok(cachedData);
        }
        var parameters = new Dictionary<string, object>
        {
            {
                "userRoleId", User.GetClaimValue<int>(UserRoleId)
            }
        };
        var filtersData = await documentoElectronicoService.GetFiltersAsync(parameters);

        // Cachear por 30 minutos
        var cacheOptions = new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30),
            SlidingExpiration = TimeSpan.FromMinutes(10),
            Priority = CacheItemPriority.Normal,
            Size = 1
        };

        _cache.Set(cacheKey, filtersData, cacheOptions);
        //_logger.LogInformation("Datos de filtros cacheados exitosamente");

        return Ok(filtersData);
    }

    [HttpPost("RefreshFilters")]
    public async Task<IActionResult> RefreshfiltersData()
    {
        var cacheKey = $"doc_elect_filters_data_${User.GetClaimValue<int>(UserRoleId)}";

        // Limpiar caché
        _cache.Remove(cacheKey);

        var parameters = new Dictionary<string, object>
        {
            {
                "userRoleId", User.GetClaimValue<int>(UserRoleId)
            }
        };
        // Obtener datos frescos
        var filtersData = await documentoElectronicoService.GetFiltersAsync(parameters);

        // Volver a cachear
        var cacheOptions = new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30),
            SlidingExpiration = TimeSpan.FromMinutes(10),
            Priority = CacheItemPriority.Normal
        };

        _cache.Set(cacheKey, filtersData, cacheOptions);
        //_logger.LogInformation("Caché de filtros refrescado manualmente");

        return Ok(filtersData);
    }

    [HttpGet("GetXmlSri/{id}")]
    public async Task<IActionResult> GetXmlSri(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>(UserRoleId) },
            { "id", id }
        };
        var response = await documentoElectronicoService.GetXmlSriAsync(parameters);
        return response == null ? BadRequest("No se encontro xml") : File(response.Content, "text/xml", response.FileName);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>(UserRoleId) },
            { "id", id }
        };
        return Ok(await documentoElectronicoService.UpdateAsync(parameters));
    }
}

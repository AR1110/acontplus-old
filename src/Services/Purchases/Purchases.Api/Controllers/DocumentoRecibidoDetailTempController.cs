namespace Purchases.Api.Controllers;

public class DocumentoRecibidoDetailTempController(IDocRecDetailTempRepository detailTempService) : BaseApiController
{
    private const string UserRoleClaimType = "userRoleId";

    [HttpGet("{idDocumento}")]
    public async Task<IActionResult> GetId(int idDocumento)
    {
        var parameters = new Dictionary<string, object>
    {
      { "userRoleId", User.GetClaimValue<int>(UserRoleClaimType) },
      { "idDocumento", idDocumento }, { "jsonData", "" }
    };
        return Ok(await detailTempService.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post(DocDetailleTemporalDto data)
    {
        var parameters = new Dictionary<string, object>
    {
      { "userRoleId", User.GetClaimValue<int>(UserRoleClaimType) },
      { "jsonData", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<DocDetailleTemporalDto>(data)) }
    };
        return Ok(await detailTempService.AddAsync(parameters));
    }

    [HttpPut]
    public async Task<IActionResult> Put(DocDetailleTemporalDto data)
    {
        var parameters = new Dictionary<string, object>
    {
      { "userRoleId", User.GetClaimValue<int>(UserRoleClaimType) },
      { "jsonData", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<DocDetailleTemporalDto>(data)) }
    };
        return Ok(await detailTempService.UpdateAsync(parameters));
    }
}

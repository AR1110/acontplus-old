namespace Purchases.Api.Controllers;

public class DatoAdicionalArticuloController(IDatoAdicionalArticuloRepository datoAdicionalArticuloService) : BaseApiController
{

    private const string UserRoleClaimType = "userRoleId";

    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>(UserRoleClaimType) },
        { "json", SqlStringParam.Sanitize(json) }
    };
        return Ok(await datoAdicionalArticuloService.GetAsync(parameters));
    }

    [HttpPost("Insert/{id}")]
    public async Task<IActionResult> Insert(int id, InfoAdicionalDto data)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>(UserRoleClaimType) },
        { "idDocumento", id },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<InfoAdicionalDto>(data)) }
    };
        return Ok(await datoAdicionalArticuloService.AddAsync(parameters));
    }

    [HttpDelete("Delete/{idInfoAdicional}")]
    public async Task<IActionResult> Delete(int idInfoAdicional)
    {
        var parameters = new Dictionary<string, object>
      {
          { "userRoleId", User.GetClaimValue<int>(UserRoleClaimType) },
          { "idInfoAdicional", idInfoAdicional }
      };
        return Ok(await datoAdicionalArticuloService.DeleteAsync(parameters));
    }
}

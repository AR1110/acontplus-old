namespace Compras.API.Controllers;

public class DocRecDetailTempController(IDocRecDetailTempService detailTempService) : BaseApiController
{
  private const string UserRoleClaimType = "userRoleId";

  [HttpGet("{idDocumento}")]
  public async Task<IActionResult> GetId(int idDocumento)
  {
    var parameters = new Dictionary<string, object>
    {
      { "idRol", User.GetClaimValue<int>(UserRoleClaimType) },
      { "idDocumento", idDocumento }, { "jsonData", "" }
    };
    return Ok(await detailTempService.GetAsync(parameters));
  }

  [HttpPost]
  public async Task<IActionResult> Post([FromBody] ApiRequest data)
  {
    var parameters = new Dictionary<string, object>
    {
      { "idRol", User.GetClaimValue<int>(UserRoleClaimType) },
      { "jsonData", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
    };
    return Ok(await detailTempService.AddAsync(parameters));
  }

  [HttpPut]
  public async Task<IActionResult> Put([FromBody] ApiRequest data)
  {
    var parameters = new Dictionary<string, object>
    {
      { "idRol", User.GetClaimValue<int>(UserRoleClaimType) },
      { "jsonData", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
    };
    return Ok(await detailTempService.UpdateAsync(parameters));
  }
}
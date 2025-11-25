namespace Purchases.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FacturaCompraController(IFacturaCompraRepository _svc) : ControllerBase
{
    private const string UserRoleClaimType = "userRoleId";

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        try
        {
            var response = await _svc.GetAsync(new Dictionary<string, object>
            {
                { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
            });
            if (response == null) return NoContent();

            ;
            return Ok(new { code = "1", payload = response });
        }
        catch (Exception ex)
        {
            return BadRequest("Error on get: " + ex.Message);
        }
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        try
        {
            var response =
                await _svc.GetByIdAsync(new Dictionary<string, object>
                {
                    { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id }
                });
            if (response == null) return NoContent();

            ;
            return Ok(new { code = "1", payload = response });
        }
        catch (Exception ex)
        {
            return BadRequest("Error on get by id: " + ex.Message);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Insert(FacturaCompraDto facturaCompraDto)
    {

        var parameters = new Dictionary<string, object>
    {
      { UserRoleClaimType, User.GetClaimValue<int>(UserRoleClaimType) },
      { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<FacturaCompraDto>(facturaCompraDto)) }
    };
        return Ok(await _svc.AddAsync(parameters));
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, FacturaCompraDto facturaCompraDto)
    {

        var parameters = new Dictionary<string, object>
    {
      { UserRoleClaimType, User.GetClaimValue<int>(UserRoleClaimType) },
      { "id", id },
      { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<FacturaCompraDto>(facturaCompraDto)) }
    };

        return Ok(await _svc.UpdateAsync(parameters));
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        return Ok(await _svc.DeleteAsync(parameters));
    }
}

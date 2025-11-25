namespace Inventory.Api.Controllers;

public class TransaccionController(ITransaccionService transaccionService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        try
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
            };
            var response = await transaccionService.GetAsync(parameters);
            if (response == null) return NoContent();

            ;
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest("Error en get Transferencias de bodegas" + ex.Message);
        }
    }

    [HttpPost]
    public IActionResult Post([FromBody] TransaccionDto data)
    {
        try
        {
            transaccionService.Process(new Dictionary<string, object>
            {
                { "codTran", data.CodTran },
                { "codDoc", data.CodDoc },
                { "documentoId", data.DocumentoId },
                { "tipo", data.Tipo }
            });
            return Ok("Successful");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
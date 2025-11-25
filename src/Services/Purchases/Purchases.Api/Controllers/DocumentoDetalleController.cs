namespace Purchases.Api.Controllers;

public class DocumentoDetalleController(IDocumentoDetalleRepository documentoDetalleService) : BaseApiController
{
    [HttpPost("{idDocumento}/{idArticulo}")]
    public async Task<IActionResult> Post(int idDocumento, int idArticulo)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "idDocumento", idDocumento },
            { "idArticulo", idArticulo }
        };
        return Ok(await documentoDetalleService.AddAsync(parameters));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id }
        };
        return Ok(await documentoDetalleService.DeleteAsync(parameters));
    }
}

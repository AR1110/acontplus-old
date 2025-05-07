namespace FactElect.API.Controllers.Customer;

public class ConsultasController(
    IRucService rucService,
    ICedulaService cedulaService,
    ICustomerService customerService)
    : BaseApiController
{
    [AllowAnonymous]
    [HttpGet("GetCedulaSri")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<CedulaModel> GetCedulaSri([FromQuery] RequestParams data)
    {
        if (data.SriOnly)
        {
            return await cedulaService.GetCedulaSriAsync(data.Ruc);
        }

        var parameters = new Dictionary<string, object> { { "id", data.Ruc }, { "IDType", "05" } };
        var dt = await customerService.GetByIdCardAsync(parameters);

        if (!DataValidation.DataTableIsNull(dt))
        {
            return DataTableMapper.MapDataRowToModel<CedulaModel>(dt.Rows[0]);
        }

        return await cedulaService.GetCedulaSriAsync(data.Ruc);
    }
}

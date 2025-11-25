using Acontplus.Utilities.Extensions;

namespace Billing.Api.Controllers.Customer;

public class ConsultasController(
    IRucService rucService,
    ICedulaService cedulaService,
    ICustomerService customerService)
    : BaseApiController
{
    [AllowAnonymous]
    [HttpGet("GetRucSRI")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetRucSri([FromQuery] RequestParams data)
    {
        if (data.SriOnly)
        {
            var response = await rucService.GetRucSriAsync(data.Ruc);
            if (response.IsSuccess)
            {
                return response.ToActionResult();
            }
        }

        var parameters = new Dictionary<string, object> { { "id", data.Ruc } };
        var dt = await customerService.GetByIdCardAsync(parameters);

        if (!DataValidation.DataTableIsNull(dt))
        {
            return Ok(ApiResponse<ContribuyenteRucDto>.Success(
                data: DataTableMapper.MapDataRowToModel<ContribuyenteRucDto>(dt.Rows[0])));
        }

        var sriResponse = await rucService.GetRucSriAsync(data.Ruc);
        return sriResponse.ToActionResult();
    }

    [AllowAnonymous]
    [HttpGet("GetCedulaSri")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetCedulaSri([FromQuery] RequestParams data)
    {
        if (data.SriOnly)
        {
            var response = await rucService.GetRucSriAsync(data.Ruc);
            if (response.IsSuccess)
            {
                return response.ToActionResult();
            }
        }

        var parameters = new Dictionary<string, object> { { "id", data.Ruc }, { "IDType", "05" } };
        var dt = await customerService.GetByIdCardAsync(parameters);

        if (!DataValidation.DataTableIsNull(dt))
        {
            return Ok(ApiResponse<ContribuyenteCedulaDto>.Success(
                data: DataTableMapper.MapDataRowToModel<ContribuyenteCedulaDto>(dt.Rows[0])));
        }

        var sriResponse = await rucService.GetRucSriAsync(data.Ruc);
        return sriResponse.ToActionResult();
    }
}

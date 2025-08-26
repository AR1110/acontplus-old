using Contabilidad.Application.DTOs;
using Contabilidad.Domain.Repositories;

namespace Contabilidad.API.Controllers;

public class ControlCajaController(IControlCajaRepository controlCajaRepository) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };

        var response = await controlCajaRepository.GetAsync(parameters);
        if (response == null) return NoContent();

        return Ok(response);
    }


    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreateControlCajaDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateControlCajaDto>(data)) }
        };
        var response = await controlCajaRepository.AddAsync(parameters);
        if (response == null) return NoContent();

        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] UpdateControlCajaDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateControlCajaDto>(data)) }
        };
        var response = await controlCajaRepository.UpdateAsync(parameters);
        if (response == null) return NoContent();

        return Ok(response);
    }
}

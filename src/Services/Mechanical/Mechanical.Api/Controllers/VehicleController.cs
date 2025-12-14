using Microsoft.AspNetCore.Mvc;

namespace Mechanical.Api.Controllers;

public class VehicleController(IVehicleRepository _vehicleService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", json }
        };
        return Ok(await _vehicleService.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreateVehicleDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateVehicleDto>(data)) }
        };
        return Ok(await _vehicleService.AddAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] UpdateVehicleDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateVehicleDto>(data)) }
        };
        return Ok(await _vehicleService.UpdateAsync(parameters));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return Ok(await _vehicleService.DeleteAsync(id));
    }

    [HttpPut("PutState/{id}/{state}")]
    public async Task<IActionResult> PutState(int id, bool state)
    {
        return Ok(await _vehicleService.UpdateStateAsync(id, state));
    }
}

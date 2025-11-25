//using Newtonsoft.Json.Serialization;
//using Newtonsoft.Json;

namespace Billing.Api.Controllers;

public class FacturaController(IFacturaService service) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var response = await service.GetAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        });
        return response == null ? NoContent() : Ok(new { code = "1", payload = response });
    }

    [HttpPost]
    public async Task<IActionResult> Post(FacturaDtos.CreateFacturaDto data)
    {
        var json = DataConverters.SerializeObjectCustom<FacturaDtos.CreateFacturaDto>(data);
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await service.AddAsync(parameters);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, FacturaDtos.UpdateFacturaDto data)
    {
        if (data.Id != id) return BadRequest("Invalid id");

        var json = DataConverters.SerializeObjectCustom<FacturaDtos.UpdateFacturaDto>(data);
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await service.UpdateAsync(parameters);
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var response = await service.GetByIdAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id }
        });
        return response == null ? NoContent() : Ok(new { code = "1", payload = response });
    }

    [HttpPut("Cancel/{id}")]
    public async Task<IActionResult> Cancel(int id, FacturaDtos.CancelFacturaDto data)
    {
        var json = DataConverters.SerializeObjectCustom<FacturaDtos.CancelFacturaDto>(data);
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await service.CancelAsync(parameters);
        return Ok(response);
    }
}

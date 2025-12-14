using Acontplus.Persistence.SqlServer.Utilities;
using Acontplus.Utilities.Data;
using Mechanical.Application.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Mechanical.Api.Controllers;

public class SupportController(ISupportRepository _supportService) : BaseApiController
{
  [HttpGet]
  public async Task<IActionResult> Get(string json)
  {
    var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", json }
        };
    return Ok(await _supportService.GetAsync(parameters));
  }

  [HttpPost]
  public async Task<IActionResult> Post([FromBody] CreateSupportDto data)
  {
    var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateSupportDto>(data)) }
        };
    return Ok(await _supportService.AddAsync(parameters));
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> Put(int id, [FromBody] UpdateSupportDto data)
  {
    var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateSupportDto>(data)) }
        };
    return Ok(await _supportService.UpdateAsync(parameters));
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(int id)
  {
    var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id }
        };
    return Ok(await _supportService.DeleteAsync(parameters));
  }

  [HttpPut("PutState/{id}/{SupportStatusId}")]
  public async Task<IActionResult> PutState(int id, int SupportStatusId)
  {
    return Ok(await _supportService.UpdateStateAsync(id, SupportStatusId));
  }
}

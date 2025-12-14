using Microsoft.AspNetCore.Mvc;

namespace Mechanical.Api.Controllers;

public class SupportDetailController(ISupportDetailService _supportDetailService) : BaseApiController
{
  [HttpGet]
  public async Task<IActionResult> Get(string json)
  {
    var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", json }
        };
    return Ok(await _supportDetailService.GetAsync(parameters));
  }

  [HttpPost]
  public async Task<IActionResult> Post([FromBody] CreateSupportDetailDto data)
  {
    var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateSupportDetailDto>(data)) }
        };
    return Ok(await _supportDetailService.AddAsync(parameters));
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> Put(int id, [FromBody] UpdateSupportDetailDto data)
  {
    var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateSupportDetailDto>(data)) }
        };
    return Ok(await _supportDetailService.UpdateAsync(parameters));
  }
}

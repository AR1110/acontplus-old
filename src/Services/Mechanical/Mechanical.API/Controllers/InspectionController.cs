using Mechanical.API.Interfaces;
using Microsoft.AspNetCore.Mvc;


namespace Mechanical.API.Controllers
{
    public class InspectionController(IInspectionService _inspectionService) : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var parameters = new Dictionary<string, object>{
                { "userRoleId", User.GetClaimValue<int>("userRoleId")},
                { "json", json}
            };
            return Ok(await _inspectionService.GetAsync(parameters));

        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ApiRequest data)
        {
            var parameters = new Dictionary<string, object> {
                { "userRoleId", User.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data))}
            };
            return Ok(await _inspectionService.AddAsync(parameters));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
        {

            var parameters = new Dictionary<string, object> {
                { "userRoleId", User.GetClaimValue<int>("userRoleId") },
                { "id", id },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data))}
            };
            return Ok(await _inspectionService.UpdateAsync(parameters));

        }
    }
}

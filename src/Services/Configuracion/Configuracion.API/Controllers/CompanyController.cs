namespace Configuracion.API.Controllers;

public class CompanyController(ICompanyService companyService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await companyService.GetAsync(parameters);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
        };
        var response = await companyService.UpdateAsync(parameters);
        return Ok(response);
    }
}

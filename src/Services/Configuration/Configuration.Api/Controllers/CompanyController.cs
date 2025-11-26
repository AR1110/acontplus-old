namespace Configuration.Api.Controllers;

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
    public async Task<IActionResult> Put(int id, UpdateCompanyDto data)
    {
        var parameters = new Dictionary<string, object>
    {
      { "userRoleId", User.GetClaimValue<int>("userRoleId") },
      { "id", id },
      { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateCompanyDto>(data)) }
    };
        var response = await companyService.UpdateAsync(parameters);
        return Ok(response);
    }
}
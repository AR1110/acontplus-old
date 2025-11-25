namespace Billing.Api.Controllers.Customer;

public class CompanyCustomerController(ICompanyCustomerService companyCustomer) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var response = await companyCustomer.GetAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        });
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post(CompanyCustomerDtos.CreateCompanyCustomerDto data)
    {
        var response = await companyCustomer.AddAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CompanyCustomerDtos.CreateCompanyCustomerDto>(data)) }
        });
        return response == null ? BadRequest("Cant Save") : Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, CompanyCustomerDtos.UpdateCompanyCustomerDto data)
    {
        var response = await companyCustomer.UpdateAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CompanyCustomerDtos.UpdateCompanyCustomerDto>(data)) }
        });
        return response == null ? BadRequest("Cant Save") : Ok(response);
    }


    [HttpGet("Search")]
    public async Task<IActionResult> Search(string json)
    {
        var response = await companyCustomer.SearchAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        });
        return Ok(response);
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var response = await companyCustomer.GetIdAsync(new Dictionary<string, object> { { "id", id } });
        return Ok(response);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        var response = await companyCustomer.DeleteAsync(parameters);
        return Ok(response);
    }
}

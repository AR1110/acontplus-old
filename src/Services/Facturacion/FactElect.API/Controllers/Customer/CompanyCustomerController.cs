namespace FactElect.API.Controllers.Customer;

public class CompanyCustomerController(ICompanyCustomerService companyCustomer) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var response = await companyCustomer.GetAsync(new Dictionary<string, object>
        {
            { "idRol", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        });
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post(ApiRequest request)
    {
        var response = await companyCustomer.AddAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", DataConverters.SerializeDictionary(request.Data) }
        });
        if (response == null) { return BadRequest("Cant Save"); }

        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, ApiRequest request)
    {
        var response = await companyCustomer.UpdateAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", DataConverters.SerializeDictionary(request.Data) }
        });
        if (response == null) { return BadRequest("Cant Save"); }

        return Ok(response);
    }


    [HttpGet("Search")]
    public async Task<IActionResult> Search(string json)
    {
        var response = await companyCustomer.SearchAsync(new Dictionary<string, object>
        {
            { "idRol", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
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
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        var response = await companyCustomer.DeleteAsync(parameters);
        return Ok(response);
    }
}

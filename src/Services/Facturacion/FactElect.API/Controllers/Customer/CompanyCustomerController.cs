namespace FactElect.API.Controllers.Customer;

public class CompanyCustomerController : BaseApiController
{
    private readonly ICompanyCustomerService _companyCustomer;


    public CompanyCustomerController(ICompanyCustomerService companyCustomer)
    {
        _companyCustomer = companyCustomer;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var response = await _companyCustomer.GetAsync(new Dictionary<string, object>
            {
                { "idRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            });
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post(ApiRequest request)
    {
        var response = await _companyCustomer.AddAsync(new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "json", DataConverters.SerializeDictionary(request.Data) }
            });
        if (response == null) { return BadRequest("Cant Save"); }

        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, ApiRequest request)
    {
        var response = await _companyCustomer.UpdateAsync(new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "id", id },
                { "json", DataConverters.SerializeDictionary(request.Data) }
            });
        if (response == null || string.IsNullOrEmpty(response)) { return BadRequest("Cant Save"); }

        return Ok(response);
    }


    [HttpGet("Search")]
    public async Task<IActionResult> Search(string json)
    {
        var response = await _companyCustomer.SearchAsync(new Dictionary<string, object>
            {
                { "idRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            });
        return Ok(response);
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var response = await _companyCustomer.GetIdAsync(new Dictionary<string, object> { { "id", id } });
        return Ok(response);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } };
        var response = await _companyCustomer.DeleteAsync(parameters);
        return Ok(response);
    }
}

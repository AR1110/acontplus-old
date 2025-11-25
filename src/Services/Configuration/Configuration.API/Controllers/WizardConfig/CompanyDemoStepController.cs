namespace Configuration.Api.Controllers.WizardConfig;

public class CompanyDemoStepController(ICompanyDemoStepService companyDemoStepService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetClaimValue<int>("userRoleId") } };
        return Ok(await companyDemoStepService.GetAsync(parameters));
    }

    [HttpPost("{demoStepId}")]
    public async Task<IActionResult> Post(int demoStepId)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "demoStepId", demoStepId },
            { "fromMobile", HttpContext.Items["FromMobile"] as bool? ?? false }
        };
        return Ok(await companyDemoStepService.AddAsync(parameters));
    }
}
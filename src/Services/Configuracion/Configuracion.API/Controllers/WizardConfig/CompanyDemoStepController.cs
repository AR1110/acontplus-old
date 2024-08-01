using Configuracion.API.Interfaces.WizardConfig;

namespace Configuracion.API.Controllers.WizardConfig;

public class CompanyDemoStepController(ICompanyDemoStepService companyDemoStepService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() } };
        return Ok(await companyDemoStepService.GetAsync(parameters));
    }
    [HttpPost("{demoStepId}")]
    public async Task<IActionResult> Post(int demoStepId)
    {
        var parameters = new Dictionary<string, object> {
            { "userRoleId", User.GetUserRoleId() },
            { "demoStepId", demoStepId },
            { "fromMobile", HttpContext.Items["FromMobile"] as bool? ?? false }
        };
        return Ok(await companyDemoStepService.AddAsync(parameters));
    }
}

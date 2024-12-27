using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebUI.Pages.Config.WizardConfig
{
    public class IndexModel(IConfiguration configuration) : PageModel
    {
        public void OnGet()
        {
            var url = configuration["UrlApps:AngularApp"];
            
        }
    }
}

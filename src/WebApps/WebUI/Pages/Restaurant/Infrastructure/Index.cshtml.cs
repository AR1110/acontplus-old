using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebUI.Pages.Restaurant.Infrastructure
{
    public class IndexModel(IConfiguration configuration) : PageModel
    {
        public void OnGet()
        {
            var url = configuration["UrlApps:AngularApp"];
            
        }
    }
}

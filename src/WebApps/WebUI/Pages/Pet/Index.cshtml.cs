using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebUI.Pages.Pet
{
    public class IndexModel : PageModel
    {
        private readonly IConfiguration _configuration;
        public IndexModel(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public void OnGet()
        {
            var url = _configuration["UrlApps:Vet"];
            ViewData["FrontEnd"] = url;
        }
    }
}

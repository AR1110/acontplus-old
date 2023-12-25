using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebUI.Pages.TechnicalSupport
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
            var url = _configuration["UrlApps:SveltekitApp"];
            ViewData["FrontEnd"] = url;
        }
    }
}

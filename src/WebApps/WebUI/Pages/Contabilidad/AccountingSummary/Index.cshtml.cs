using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using WebUI.Pages.Articulo;

namespace WebUI.Pages.Contabilidad.AccountingSummary
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
            var url = _configuration["UrlApps:AngularApp"];
            ViewData["FrontEnd"] = url;
        }
    }
}

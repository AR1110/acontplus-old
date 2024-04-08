using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebUI.Pages.Contabilidad.MovimientoCaja
{
    public class Index : PageModel
    {
        private readonly IConfiguration _configuration;
        public Index(IConfiguration configuration)
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

using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;

namespace FACT_UI.Areas.RetencionAts.Pages
{
    public class IndexModel : PageModel
    {
        private IConfiguration _configuration;
        private readonly string _apiGateway = string.Empty;
        public IndexModel(IConfiguration configuration)
        {
            _configuration = configuration;
            _apiGateway = _configuration.GetSection("UrlApis").GetSection("UrlGateway").Value;
        }
        public void OnGet(int? id)
        {
            ViewData["ID"] = id;
            ViewData["urlGateway"] = _apiGateway;
        }
    }
}

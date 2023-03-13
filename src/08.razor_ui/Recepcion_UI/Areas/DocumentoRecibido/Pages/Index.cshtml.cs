using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;

namespace Recepcion_UI.Areas.DocumentoRecibido.Pages
{
    public class IndexModel : PageModel
    {
        private IConfiguration _configuration;
        private readonly string _apiGateway = string.Empty;
        public IndexModel(IConfiguration configuration)
        {
            _configuration = configuration;
            _apiGateway = _configuration.GetSection("UrlApis").GetSection("ApiGateway").Value;
        }
        public void OnGet()
        {
            ViewData["urlGateway"] = _apiGateway;
        }
    }
}

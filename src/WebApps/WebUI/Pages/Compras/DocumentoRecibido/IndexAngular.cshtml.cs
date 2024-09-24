using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebUI.Pages.Compras.DocumentoRecibido;
public class IndexAngularModel(IConfiguration configuration) : PageModel
{
    public string AngularAppUrl { get; private set; }
    public void OnGet()
    {
        AngularAppUrl = configuration["UrlApps:AngularApp"];
    }
}

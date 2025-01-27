using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebUI.Pages.Contabilidad.Category;

public class Index(IConfiguration configuration) : PageModel
{
    public void OnGet()
    {
        var url = configuration["UrlApps:AngularApp"];

    }
}


using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebUI.Pages.FactElect.DocumentoElectronico
{
    public class IndexModel : PageModel
    {
        public void OnGet(int? tipo)
        {
            ViewData["tipo"] = tipo;
        }
    }
}

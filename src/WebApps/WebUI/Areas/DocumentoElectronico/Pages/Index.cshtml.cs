
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebUI.Areas.DocumentoElectronico.Pages
{
    public class IndexModel : PageModel
    {
        public void OnGet(int? tipo)
        {
            ViewData["tipo"] = tipo;
        }
    }
}

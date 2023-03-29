using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Compra_UI.CompraNoHabitual.Pages
{
    public class IndexModel : PageModel
    {
        public void OnGet()
        {
            Console.WriteLine("Init");
        }
    }
}
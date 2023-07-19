using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebUI.CompraNoHabitual.Pages
{
    public class IndexModel : PageModel
    {
        public void OnGet()
        {
            Console.WriteLine("Init");
        }
    }
}
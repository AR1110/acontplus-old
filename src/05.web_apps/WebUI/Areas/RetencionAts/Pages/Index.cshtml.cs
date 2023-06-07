using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebUI.Areas.RetencionAts.Pages
{
    public class IndexModel : PageModel
    {
        public void OnGet(int? id)
        {
            ViewData["ID"] = id;
        }
    }
}

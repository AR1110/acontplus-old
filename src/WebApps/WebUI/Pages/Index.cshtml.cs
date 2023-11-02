using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebUI.Pages
{
    public class IndexModel : PageModel
    {
        public PartialViewResult OnGet(string name)
        {
            return new PartialViewResult
            {
                ViewName = name,
            };
        }
    }
}

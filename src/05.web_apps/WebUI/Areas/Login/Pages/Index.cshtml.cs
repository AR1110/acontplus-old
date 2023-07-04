using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebUI.Areas.Login.Pages
{
    public class IndexModel : PageModel
    {
        public void OnGet(string returnUrl)
        {
            ViewData["ReturnUrl"] = returnUrl;
        }
        public IActionResult OnPost()
        {
            //put logout code here
            return Redirect("/Login/Index");
        }
    }
}

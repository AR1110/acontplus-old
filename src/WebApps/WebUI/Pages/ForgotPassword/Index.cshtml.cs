using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebUI.Pages.ForgotPassword
{
    public class IndexModel : PageModel
    {
        public void OnGet(string token)
        {
            ViewData["token"] = token;
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebUI.Areas.Login.Pages
{
    public class IndexModel : PageModel
    {
        private readonly IConfiguration _configuration;
        public IndexModel(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public void OnGet(string returnUrl)
        {
            ViewData["ReturnUrl"] = returnUrl;
            ViewData["UrlGateway"] = _configuration["ApiGateways:Acontplus"];
        }
        public IActionResult OnPost()
        {
            //put logout code here
            return Redirect("/Login/Index");
        }
    }
}

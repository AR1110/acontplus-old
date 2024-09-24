using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebUI.Pages.Login;

public class IndexModel(IConfiguration configuration) : PageModel
{
    public void OnGet(string returnUrl)
    {
        ViewData["ReturnUrl"] = returnUrl;
        ViewData["UrlGateway"] = configuration["ApiGateways:Acontplus"];
    }
    public IActionResult OnPost()
    {
        //put logout code here
        return Redirect("/Pages/Login/Index");
    }
}

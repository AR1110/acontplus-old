using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebUI.Pages;

public class ApiProxyModel(IConfiguration config, IHttpClientFactory factory) : PageModel
{
    public async Task<IActionResult> OnGetAsync(string path)
    {
        var backendBaseUrl = config["ApiBaseUrl"];
        if (string.IsNullOrWhiteSpace(path)) return BadRequest();

        var client = factory.CreateClient();
        var response = await client.GetAsync($"{backendBaseUrl}/{path}");
        var content = await response.Content.ReadAsStringAsync();

        return Content(content, "application/json");
    }
}

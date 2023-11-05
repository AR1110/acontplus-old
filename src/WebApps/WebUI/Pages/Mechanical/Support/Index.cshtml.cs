using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebUI.Pages.Mechanical.Support
{
    public class index : PageModel
    {
        private readonly ILogger<index> _logger;

        public index(ILogger<index> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
        }
    }
}
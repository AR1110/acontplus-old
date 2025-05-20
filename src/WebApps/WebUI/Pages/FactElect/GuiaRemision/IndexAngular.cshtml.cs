using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebUI.Pages.FactElect.GuiaRemision
{
    public class IndexAngular : PageModel
    {
        private readonly ILogger<IndexAngular> _logger;

        public IndexAngular(ILogger<IndexAngular> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
        }
    }
}
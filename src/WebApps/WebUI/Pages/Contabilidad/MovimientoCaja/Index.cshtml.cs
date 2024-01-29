using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace WebUI.Pages.Contabilidad.MovimientoCaja
{
    public class Index : PageModel
    {
        private readonly IConfiguration _configuration;
        public Index(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public void OnGet()
        {
            var url = _configuration["UrlApps:AngularApp"];
            ViewData["FrontEnd"] = url;
        }
    }
}

using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Api
{
    public class ConnectionApiAdminController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }


        public IActionResult GetUrl(int typeUrl)
        {
            //typeUrl = 1 --Cliente
            //typeUel = 2 --Admin

            string urlApi = string.Empty;
#if DEBUG
            urlApi = typeUrl == 1 ? "https://localhost:44354/" : "https://localhost:7224/";
#else
            urlApi = typeUrl==1? "http://206.72.196.229:81/": "http://206.72.196.229:83/";
            //urlApi = typeUrl==1? "http://3.21.205.190:8090/" : "http://206.72.196.229:83/";
#endif
            return Ok(urlApi);

        }
    }
}

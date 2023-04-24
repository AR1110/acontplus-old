using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Admin
{
    public class ReporteController : Controller
    {
        public IActionResult Index() => View();
        public IActionResult Recepcion() => View("~/Views/Reporte/Recepcion/Index.cshtml");

        //Reporte Venta

        public IActionResult ReporteVenta()
        {
            return View();
        }

        //Reporte Inventario 

        //public IActionResult ReporteInventario()
        //{
        //    return View();
        //}

        //Reporte Consumo Ciente

        public IActionResult ReporteConsumoCliente()
        {
            return View();
        }

        public IActionResult ReporteKardex()
        {
            return View();
        }
    }
}

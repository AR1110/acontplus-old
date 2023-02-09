using DataAccess;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.Compras
{
    public class CuotaXPagarController : Controller 
    {
        //GenericResponse _gr = new();
        //CuotaPorPagarDao _cxp = new();

        //[Route("CuotaPagar/{idDocumentoCompra}")]
        //public IActionResult Index(int idDocumentoCompra)
        //{
        //    ViewBag.idDocumentoCompra = idDocumentoCompra;
        //    //_ = ReadCuotaPorPagar(idDocumentoCompra);
        //    return View();
        //}

        //public async Task<IActionResult> ReadCuotaPorPagar(int idDocumentoCompra)
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        //    _gr = await _cxp.ReadCuotaPorPagarAsycn(idRol, idDocumentoCompra);
        //    return Ok(_gr);
        //}

        //[HttpPost]
        //public async Task<IActionResult> ListCuotaPorPagar([FromBody] List<DocumentoCompra> data)
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        //    _gr = await _cxp.ListCuotaPorPagarAsycn(idRol, data);
        //    return Ok(_gr);
        //}
    }
}

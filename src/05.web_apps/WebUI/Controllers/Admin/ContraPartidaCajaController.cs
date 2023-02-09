using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.Admin
{
    public class ContraPartidaCajaController : Controller
    {
        GenericResponse _gr = new();
        ContraPartidaCajaDao _cpc = new();

        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> ReadContraPartidaCaja(int idContraPartida)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _cpc.ReadContraPartidaCajaAsync(idRol, idContraPartida);
            return Ok(_gr);
        }
    }
}

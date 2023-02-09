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
    public class ContraPartidaEntidadFinancieraController : Controller
    {
        GenericResponse _gr = new();
        ContraPartidaEfDao _cpe = new();
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> ReadContraPartidaEntidadFinanciera(int idContraPartida)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _cpe.ReadContraPartidaEFAsync(idRol, idContraPartida);
            return Ok(_gr);
        }
    }
}

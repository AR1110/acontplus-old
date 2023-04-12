using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Admin
{
    public class ContraPartidaCajaController : Controller
    {
        private readonly IConfiguration _configuration;

        GenericResponse _gr = new();
        private ContraPartidaCajaDao _cpc;
        public ContraPartidaCajaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _cpc = new ContraPartidaCajaDao(_configuration);
        }
        
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> ReadContraPartidaCaja(int idContraPartida)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _cpc.ReadContraPartidaCajaAsync(idRol, idContraPartida);
            return Ok(_gr);
        }
    }
}

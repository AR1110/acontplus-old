using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Admin
{
    public class ContraPartidaEntidadFinancieraController : Controller
    {
        private readonly IConfiguration _configuration;
        GenericResponse _gr = new();
        private ContraPartidaEfDao _cpe;

        public ContraPartidaEntidadFinancieraController(IConfiguration configuration)
        {
            _configuration = configuration;
            _cpe = new ContraPartidaEfDao(_configuration);
        }

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

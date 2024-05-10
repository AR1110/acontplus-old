using Common.Core.Models;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Tributaria
{
    public class SubContribuyenteController : Controller
    {
        // GET: SubContribuyente
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        ApiResponse _gr = new();
        private SubContribuyenteDao _sc;

        public SubContribuyenteController(IConfiguration config)
        {
            _config = config;
            _sc = new SubContribuyenteDao(_config);
        }

 
        //Listar Sub Contribuyente para agregar  Agregar Configuración Contribuyente
        public async Task<IActionResult> OptionSubContribuyente()
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _sc.OptionSubContribuyenteAsync(idRol);
            return Ok(_gr);
        }

    }
}

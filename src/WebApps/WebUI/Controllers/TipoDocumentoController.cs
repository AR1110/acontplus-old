using Common.Core.Models;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    public class TipoDocumentoController : Controller
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private TipoDocumentoDao _td;

        public TipoDocumentoController(IConfiguration config)
        {
            _config = config;
            _td = new TipoDocumentoDao(_config);
        }


        public IActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> Get()
        {
            return Ok(await _td.GetAsync());
        }
        public async Task<IActionResult> ReadTipoDocumento([FromBody] HelpersResponse data)
        {
            _gr = await _td.ReadTipoDocumentoAsync(data);
            return Ok(_gr);
        }

        public async Task<IActionResult> GetConfiguration(int idPuntoEmision)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _td.GetConfigurationAsync(idRol, idPuntoEmision);
            return Ok(_gr);
        }
        public async Task<IActionResult> SaveConfig([FromBody] ConfiguracionDocumento data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _td.SaveConfigAsync(idRol, data);
            return Ok(_gr);
        }

        //Listar Documentos para venta o compra 
        public async Task<IActionResult> GetByTT(string codTransaccion)
        {
            _gr = await _td.GetByTTAsync(codTransaccion);
            return Ok(_gr);
        }

        //Listar Todos los Documentos 
        public async Task<IActionResult> GetAll()
        {
            var res = await _td.GetAllAsync();
            return Ok(res);
        }

    }
}

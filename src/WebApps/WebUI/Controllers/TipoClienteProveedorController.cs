using Common.Core.Models;
using DataAccess;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    public class TipoClienteProveedorController : Controller
    {
        // GET: TipoClienteProveedor
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private TipoClienteProveedorDao _tp;

        public TipoClienteProveedorController(IConfiguration config)
        {
            _config = config;
            _tp = new TipoClienteProveedorDao(_config);
        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] TipoClienteProveedor data)
        {
            _gr = await _tp.CreateTipoClienteProveedorAsync(data);
            return Ok(_gr);
        }

        [HttpPost]
        public async Task<IActionResult> Get(int pageIndex, int pageSize, [FromBody] HelpersResponse data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _tp.ReadTipoClienteProveedor(idRol, pageIndex, pageSize, data);
            return Ok(_gr);
        }

        [HttpPost]
        public async Task<IActionResult> Put([FromBody] TipoClienteProveedor data)
        {
            _gr = await _tp.UpdateTipoClienteProveedorAsync(data);
            return Ok(_gr);
        }


        public async Task<IActionResult> Delete(int idTipoCP)
        {
            _gr = await _tp.DeleteTipoClienteProveedorAsync(idTipoCP);
            return Ok(_gr);
        }

        //Operaciones Especiales
        //Tipo Validacion=CL=>listar Tipo Cliente ||  Tipo Validacion=P =>listar Tipo Proveedor
        public async Task<IActionResult> TipoClienteProveedorSelect(string tipoValidacion)
        {
            var res = await _tp.TipoClienteProveedorSelectAsync(tipoValidacion);
            return Ok(res);
        }
    }
}

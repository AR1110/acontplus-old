using DataAccess;
using DataAccess.GestionTributaria;
using Domain.Models;
using Domain.Models.GestionTributaria;
using Lib.Common;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.ImpuestoEstado
{
    public class ImpuestoRentaController : Controller
    {
        // GET: Impuesto
        private readonly IConfiguration _configuration;


        private DataAccessObject _dao;

        GenericResponse _gr = new();
        private RetencionRentaDao _i;

        public ImpuestoRentaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _i = new RetencionRentaDao(_configuration);



        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(int pageIndex, int pageSize)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _i.GetAsync(idRol, pageIndex, pageSize);
            return Ok(_gr);
        }




        //Gestion de Informacion 
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] RetencionRenta data)
        {
            Dictionary<string, object> parameters = new();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("idTipoImpuestoRenta", data.idTipoImpuestoRenta);
            parameters.Add("codigoAnexo", data.codigoAnexo);
            parameters.Add("descripcion", data.descripcion);
            parameters.Add("porcentaje", data.porcentaje);
            parameters.Add("campoFormulario103", data.campoFormulario103 ?? "");
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("ImpuestoEstado.RetencionRenta_Insert", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] RetencionRenta data)
        {
            Dictionary<string, object> parameters = new();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            parameters.Add("idTipoImpuestoRenta", data.idTipoImpuestoRenta);
            parameters.Add("codigoAnexo", data.codigoAnexo);
            parameters.Add("descripcion", data.descripcion);
            parameters.Add("porcentaje", data.porcentaje);
            parameters.Add("campoFormulario103", data.campoFormulario103 ?? "");
            parameters.Add("estado", data.estado);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("ImpuestoEstado.RetencionRenta_Update", parameters)));
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("ImpuestoEstado.RetencionRenta_Delete", parameters)));
        }

        //Gestiones especiales         
        public async Task<IActionResult> GetByIdTipoImpuesto(int idTipoImpuestoRenta)
        {
            _gr = await _i.GetIdAsync(idTipoImpuestoRenta);
            return Ok(_gr);
        }



        //------------------Crud Impuesto Renta Actualizado 
        [HttpGet]
        public async Task<IActionResult> GetAll(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Sri.CodigoRetencion_Get", parameters)));

        }

        [HttpPost]
        public async Task<IActionResult> Insert(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Sri.CodigoRetencion_Insert", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id, string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("id", id);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Sri.CodigoRetencion_Update", parameters)));
        }
    }
}
using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using DataAccess.GestionTributaria;
using Domain.Models.GestionTributaria;
using Microsoft.AspNetCore.Mvc;
using Services.Common;

namespace WebUI.Controllers.ImpuestoEstado
{
    public class ImpuestoRentaController : Controller
    {
        // GET: Impuesto
        private readonly IConfiguration _configuration;




        GenericResponse _gr = new();
        private RetencionRentaDao _i;

        public ImpuestoRentaController(IConfiguration configuration)
        {
            _configuration = configuration;

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
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("ImpuestoEstado.RetencionRenta_Insert");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("idTipoImpuestoRenta", data.idTipoImpuestoRenta);
                    _db.AddDynamicParam("codigoAnexo", data.codigoAnexo);
                    _db.AddDynamicParam("descripcion", data.descripcion);
                    _db.AddDynamicParam("porcentaje", data.porcentaje);
                    _db.AddDynamicParam("campoFormulario103", data.campoFormulario103 ?? "");
                    response = _db.GetDefault();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] RetencionRenta data)
        {
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("ImpuestoEstado.RetencionRenta_Update");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("id", id);
                    _db.AddDynamicParam("idTipoImpuestoRenta", data.idTipoImpuestoRenta);
                    _db.AddDynamicParam("codigoAnexo", data.codigoAnexo);
                    _db.AddDynamicParam("descripcion", data.descripcion);
                    _db.AddDynamicParam("porcentaje", data.porcentaje);
                    _db.AddDynamicParam("campoFormulario103", data.campoFormulario103 ?? "");
                    _db.AddDynamicParam("estado", data.estado);
                    response = _db.GetDefault();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("ImpuestoEstado.RetencionRenta_Delete");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("id", id);
                    response = _db.GetDefault();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
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
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Sri.CodigoRetencion_Get");
                    _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                    response = _db.GetDataTableAsync();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Insert(string json)
        {
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Sri.CodigoRetencion_Insert");
                    _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                    response = _db.GetDefault();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id, string json)
        {
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Sri.CodigoRetencion_Update");
                    _db.AddDynamicParam("id", id);
                    _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                    response = _db.GetDefault();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

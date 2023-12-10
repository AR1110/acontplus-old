using Common.Core.Models;
using Common.Core.Models.Config;
using Common.Core.Utils;
using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Services.Common;

namespace WebUI.Controllers.Config
{
    public class BodegAsigController : Controller
    {
        // GET: Establecimiento
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0



        public BodegAsigController(IConfiguration configuration)
        {
            _configuration = configuration;




        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Config.Bodeg_Asig_Get");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
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
        public async Task<IActionResult> Insert([FromBody] BodegAsig data)
        {
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Config.Bodeg_Asig_Insert");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("id", data.idBodeg_Asig);
                    _db.AddDynamicParam("codEstab_Asig", data.codEstab_Asig);
                    _db.AddDynamicParam("idBodega", data.idBodega);
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
        public async Task<IActionResult> Update(int id)
        {
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Config.Bodeg_Asig_Update");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("id", id);
                    _db.AddDynamicParam("predeterminado", true);
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

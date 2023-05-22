using Common.Logs;
using DataAccess;
using DataAccess.Ventas;
using Domain.ViewModels.Ventas;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Ventas
{
    public class ProformaController : Controller
    {
        private readonly IConfiguration _configuration;



        private ProformaDao _prof;

        public ProformaController(IConfiguration configuration)
        {
            _configuration = configuration;

            _prof = new ProformaDao(_configuration);
        }
        public IActionResult Index()
        {
            return View();
        }

        
        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            DbAccess _db = new DbAccess(_configuration);
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.Proforma_GetId");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogError("Error in GetId: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
       
    }
}

using Common.Logs;
using DataAccess;
using Domain.Models;
using Domain.Models.Inventario;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Inventario
{
    public class TransferenciaBodegaController : Controller
    {
        // GET: Articulo
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;


        public TransferenciaBodegaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);



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
                await _db.SPExecute("Inventario.TransferenciaBodega_Get_Id");
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

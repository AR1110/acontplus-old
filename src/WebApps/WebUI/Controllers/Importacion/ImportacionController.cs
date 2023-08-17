using DataAccess;
using Domain.Models;
using Lib.Common;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Importacion
{
    public class ImportacionController : Controller
    {
        // GET: Articulo
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;

        GenericResponse _gr = new();

        public ImportacionController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);



        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Importaciones.TipoImportacion_Get", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> GetValidation(string codImportacion, [FromBody] ImportacionParams data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("codImportacion", codImportacion);
            parameters.Add("json", data.jsonParams);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Importaciones.Valid_Datos_Get", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Post(string codImportacion, [FromBody] ImportacionParams data)
        {
            string storedProcedure = StoredProcedureDynamic(codImportacion);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", data.jsonParams);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync(storedProcedure + "_Insert", parameters)));
        }
        public static string StoredProcedureDynamic(object cod)
        {
            string storedProcedure = "";
            switch (cod)
            {
                case "AR":
                    storedProcedure = "Importaciones.Articulo";
                    break;
                case "AF":
                    storedProcedure = "Importaciones.Fraccionado";
                    break;
                case "SF":
                    storedProcedure = "Importaciones.SubFamilia";
                    break;
                case "ME":
                    storedProcedure = "Importaciones.Medida";
                    break;
                case "MA":
                    storedProcedure = "Importaciones.Marca";
                    break;
                case "MO":
                    storedProcedure = "Importaciones.Modelo";
                    break;
                case "CL":
                    storedProcedure = "Importaciones.Cliente";
                    break;
                case "PR":
                    storedProcedure = "Importaciones.Proveedor";
                    break;
            }
            return storedProcedure;
        }
    }
}

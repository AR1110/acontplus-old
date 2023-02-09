using DataAccess.Almacen;
using DataAccess;
using DataAccess.FE;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.FE
{
    public class DocumentoElectronicoErrorController : Controller
    {

        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        private readonly int _idRol;
        GenericResponse _gr = new();        

        public DocumentoElectronicoErrorController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);

        }

        public IActionResult Index()
        {
            return View();
        }
        public IActionResult GetByClaveAcceso(string claveAcceso)
        {
            string json = "";
            return Ok(new DocumentoElectronicoErrorDao(_configuration).GetByClaveAcceso(claveAcceso, ref json) == false ? "Error" : json);
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("FactElect.Doc_Elect_Error_Get_Id", parameters)));
        }

    }
}

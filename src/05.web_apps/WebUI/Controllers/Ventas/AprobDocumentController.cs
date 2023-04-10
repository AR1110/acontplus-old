using DataAccess;
using Domain.Models;
using Domain.Models.Ventas;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace WebUI.Controllers.Ventas
{
    public class AprobDocumentController : Controller
    {
        private readonly IConfiguration _configuration;
        
        private DataAccessObject _dao;
        

        public AprobDocumentController(IConfiguration configuration)
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
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Ventas.Aprob_Document_Get", parameters)));
        }

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("id", id);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Ventas.Aprob_Document_Get_Id", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] AprobDocument data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("jsonHeader", data.jsonHeader);
            parameters.Add("jsonDetail", data.jsonDetail);
            parameters.Add("jsonHistory", data.jsonHistory);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Ventas.Aprob_Document_Insert", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id,[FromBody] AprobDocument data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            parameters.Add("jsonHeader", data.jsonHeader);
            parameters.Add("jsonDetail", data.jsonDetail);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Ventas.Aprob_Document_Update", parameters)));
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Ventas.Aprob_Document_Delete", parameters)));
        }
    }
}

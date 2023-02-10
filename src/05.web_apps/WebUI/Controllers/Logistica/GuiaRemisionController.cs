using WebUI.ApiClient;
using DataAccess.Logistica;
using Domain.Dtos;
using Domain.Models;
using Domain.ViewModels.Logistica;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DataAccess;
using Helpers;

namespace WebUI.Controllers.Logistica
{
    public class GuiaRemisionController : Controller
    {
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        private readonly int _idRol;
        private GenericResponse _gr = new();
        private GuiaRemisionDao _guideR;
        public AuthorizationDto _auth;
        private IConfiguration _config;
        private readonly string _urlApi = "";

                
        public GuiaRemisionController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _auth = new AuthorizationDto();
            _config = configuration;
            _urlApi = _config.GetSection("UrlApis").GetSection("AcontPlusApi").Value;
            _dao = new DataAccessObject(_config);
            _guideR = new GuiaRemisionDao(_config);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);            
        }


        [Authorize]
        public IActionResult Index()
        {
            ViewData["idRol"] = _idRol;
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {            
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Logistica.GuiaRemision_Get", parameters)));
        }

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("id", id);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Logistica.GuiaRemision_Get_Id", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] GuiaRemisionViewModel data)
        {
            var res = await _guideR.InsertAsync(_idRol, data);
            return Ok(res);
        }
        
        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] GuiaRemisionViewModel data)
        {
            _gr = await _guideR.UpdateAsync(_idRol, id, data);
            return Ok(_gr);
        }
         
        [HttpDelete]
        public async Task<IActionResult> Delete(int id)  
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Logistica.GuiaRemision_Delete", parameters)));
        }

        //Generar Reporte
        public async Task<IActionResult> Download([FromBody] ApiReportParams parameters)
        {
            try
            {
                parameters.idRol = _idRol;
                var response = await new ApiServer(_urlApi).PostAsync<FileModel>("api/Reporte/Download/", parameters);
                if (response.Content.Length > 0)
                {
                    return File(response.Content, response.ContentType, response.FileName);
                }               
                else
                {
                    _gr.id = "0";
                    _gr.message = "Problemas en el servidor de documentos";
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message;
            }

            
            return Ok(_gr);
        }
    }
}

using WebUI.ApiClient;
using WebUI.Utils;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using DataAccess.GestionFinanciera;
using Microsoft.Extensions.Hosting;
using DataAccess;
using Helpers;

namespace WebUI.Controllers.Admin
{
    public class ControlCajaController : Controller
    {
        // GET: Articulo
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        private readonly int _idRol;
        private readonly string _urlApi = "";
        GenericResponse _gr = new();

        public ControlCajaController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _urlApi = _configuration.GetSection("UrlApis").GetSection("AcontPlusApi").Value;
        }

        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Administrador.ControlCaja_Get", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] ControlCaja data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("idCaja", data.idCaja);
            parameters.Add("idEntidadFinanciera", data.idEntidadFinanciera);
            parameters.Add("concepto", data.concepto ?? "");
            parameters.Add("entrada", data.entrada);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Administrador.ControlCaja_Insert", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id,[FromBody] ControlCaja data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("id", id);
            parameters.Add("spParams", data.spParams);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Administrador.ControlCaja_Update", parameters)));
        }


        [HttpGet]
        public async Task<IActionResult> GetArqueoCaja(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Administrador.DetalleArqueo_Get", parameters)));
        }

        public async Task<IActionResult> Download([FromBody] ApiReportParams parameters)
        {
            try
            {
                parameters.idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
                var response = await new ApiServer(_urlApi).PostAsync<FileModel>("api/ControlCaja/Get/", parameters);
                if (response.Content.Length > 0)
                {
                    return File(response.Content, response.ContentType, response.FileName);
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

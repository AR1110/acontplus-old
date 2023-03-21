using WebUI.ApiClient;
using DataAccess;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Helpers;
using HelpersNS20.Dtos;
using Common.Logs;
using Microsoft.Extensions.Primitives;

namespace WebUI.Controllers.Admin
{
    public class ReporteController : Controller
    {
        private readonly IWebHostEnvironment _hostingEnviroment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private IConfiguration _config;
        private readonly string _apiGateway = "";
        private DataAccessObject _dao;
        private readonly int _idRol;
        private ReporteDao _r;
        private LogWriter _logs;
        public ReporteController(IConfiguration config, IHttpContextAccessor httpContextAccessor, IWebHostEnvironment hostEnvironment)
        {
            _config = config;
            _dao = new DataAccessObject(_config);
            _logs = new LogWriter(_config);
            _hostingEnviroment = hostEnvironment;
            _r = new ReporteDao(_config);
            _apiGateway = _config.GetSection("UrlApis").GetSection("ApiGateway").Value;
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        }

        [Authorize]
        public IActionResult Index() => View();
        public IActionResult Recepcion() => View("~/Views/Reporte/Recepcion/Index.cshtml");

        //Reporte Compra
        [Authorize]
        public IActionResult ReporteCompra()
        {
            ViewData["idRol"] = _idRol;
            return View();

        }

        //Reporte Venta
        [Authorize]
        public IActionResult ReporteVenta()
        {
            ViewData["idRol"] = _idRol;
            return View();
        }

        //Reporte Inventario 
        [Authorize]
        public IActionResult ReporteInventario()
        {
            ViewData["idRol"] = _idRol;
            return View();
        }

        //Reporte Consumo Ciente
        [Authorize]
        public IActionResult ReporteConsumoCliente()
        {
            ViewData["idRol"] = _idRol;
            return View();
        }

        [Authorize]
        public IActionResult ReporteKardex()
        {
            ViewData["idRol"] = _idRol;
            return View();
        }


        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Reporte.R_Get", parameters)));
        }


        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Reporte data)
        {
            int idRol = _idRol;
            var res = await _r.InsertAsync(idRol, data);
            return Ok(res);
        }

        [HttpPut]
        public async Task<IActionResult> Put(int idReporte, [FromBody] Reporte data)
        {
            int idRol = _idRol;
            var res = await _r.UpdateAsync(idRol, idReporte, data);
            return Ok(res);
        }


        [HttpDelete]
        public async Task<IActionResult> Delete(int idReporte)
        {
            int idRol = _idRol;
            var res = await _r.DeleteAsync(idRol, idReporte);
            return Ok(res);
        }


        [HttpPost]
        public async Task<IActionResult> SaveDs(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Reporte.DataSource_Save", parameters)));
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteDs(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Reporte.DataSource_Delete", parameters)));
        }


        //REPORTS FROM API SERVER FILES BY URL AND FILE NAME
        public async Task<IActionResult> Download([FromBody] ApiReportParams parameters)
        {
            FileModel reportFile = new FileModel();
            try
            {
                // Request.Headers.TryGetValue("Authorization", out StringValues headerValues);
                // string jsonWebToken = headerValues.FirstOrDefault();
                // Request.Headers.TryGetValue("X-IdUsuarioRol", out StringValues headerUsuarioRol);
                // string idUsuarioRol = headerUsuarioRol.FirstOrDefault();
                // Console.WriteLine(jsonWebToken);
                // Console.WriteLine(idUsuarioRol);
                parameters.idRol = _idRol;
                reportFile = await new ApiServer(_apiGateway).PostAsync<FileModel>("api/Reporte/Download", parameters, Request);
                if (reportFile.Content == null || reportFile.Content.Length == 0)
                {
                    ErrorFile(reportFile);
                }
            }
            catch (Exception ex)
            {
                _logs.LogError("Error getting report (Download): " + ex.ToString());
                ErrorFile(reportFile);
            }
            return File(reportFile.Content, reportFile.ContentType, reportFile.FileName);
        }

        //Dynamic Report 
        [HttpPost]
        public async Task<IActionResult> DownloadDynamic([FromBody] ApiReportParamsDto data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("json", SqlValidation.ValidateSqlString(data.dataParams));
            var _dt = DbResponse.SPDataTable(await _dao.GetDataTableAsync("Reporte.Management_Get_To_Print", parameters));
            data.reportParams = _dt.payload;
            FileModel reportFile = new FileModel();
            try
            {
                reportFile = await new ApiServer(_apiGateway).PostAsync<FileModel>("api/Reporte/DynamicReport", data);
                if (reportFile.Content == null || reportFile.Content.Length == 0)
                {
                    ErrorFile(reportFile);
                }
            }
            catch (Exception ex)
            {
                _logs.LogError("Error getting report (DownloadDynamic): " + ex.ToString());
                ErrorFile(reportFile);
            }
            return File(reportFile.Content, reportFile.ContentType, reportFile.FileName);
        }






        public FileModel ErrorFile(FileModel file)
        {
            var filePath = Path.Combine(_hostingEnviroment.WebRootPath, "archivos", "NotFound.pdf");
            var providerI = new FileExtensionContentTypeProvider();
            if (!providerI.TryGetContentType(filePath, out var mimeType))
            {
                mimeType = "application/octet-stream";
            }
            var bytes = System.IO.File.ReadAllBytes(filePath);
            file.Create(bytes, "application/pdf", "NotFound.pdf");
            return file;
        }




    }
}

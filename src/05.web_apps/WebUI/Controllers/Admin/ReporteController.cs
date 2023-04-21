using WebUI.ApiClient;
using DataAccess;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Helpers;
using Common.Logs;
using Domain.Dtos;

namespace WebUI.Controllers.Admin
{
    public class ReporteController : Controller
    {
        private readonly IWebHostEnvironment _hostingEnviroment;
        
        private IConfiguration _config;
        private readonly string _apiGateway = "";
        private DataAccessObject _dao;
        
        private LogWriter _logs;
        public ReporteController(IConfiguration config, IWebHostEnvironment hostEnvironment)
        {
            _config = config;
            _dao = new DataAccessObject(_config);
            _logs = new LogWriter(_config);
            _hostingEnviroment = hostEnvironment;
            _apiGateway = _config.GetSection("UrlApis").GetSection("ApiGateway").Value;
            
            
        }

        
        public IActionResult Index() => View();
        public IActionResult Recepcion() => View("~/Views/Reporte/Recepcion/Index.cshtml");

        //Reporte Compra
        
        public IActionResult ReporteCompra()
        {            
            return View();
        }

        //Reporte Venta
        
        public IActionResult ReporteVenta()
        {            
            return View();
        }

        //Reporte Inventario 
        
        public IActionResult ReporteInventario()
        {            
            return View();
        }

        //Reporte Consumo Ciente
        
        public IActionResult ReporteConsumoCliente()
        {            
            return View();
        }

        
        public IActionResult ReporteKardex()
        {            
            return View();
        }

        //REPORTS FROM API SERVER FILES BY URL AND FILE NAME
        public async Task<IActionResult> Download([FromBody] ApiReportParamsDto parameters)
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
                //parameters.idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
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
                reportFile = await new ApiServer(_apiGateway).PostAsync<FileModel>("api/Reporte/DynamicReport", data, Request);
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

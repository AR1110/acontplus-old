using BL.Reports;
using Common.Logs;
using DataAccess;
using HelpersNS20;
using HelpersNS20.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Primitives;
using Microsoft.Reporting.NETCore;
using Newtonsoft.Json;
using System.Data;

namespace ApiReports.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReporteController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly Reports _report;
        public ReporteController(IConfiguration configuration, Reports report)
        {
            _configuration = configuration;
            _report = report;
        }
        //method for backend request to db
        [HttpPost("Download")]
        public async Task<IActionResult> Download(ApiReportParamsDto data)
        {
            LogWriter _log = new LogWriter(_configuration);
            Request.Headers.TryGetValue("Authorization", out StringValues headerValues);
            string jsonWebToken = headerValues.FirstOrDefault();
            FileModelDto _response = new FileModelDto();
            //ReporteDao _r = new ReporteDao();
            string mimeType = string.Empty;
            string fileName = string.Empty;
            try
            {
                DbAccess _db = new DbAccess(_configuration);
                await _db.SPExecute("Reporte.Report_Get");
                _db.AddDynamicParam("json", data.reportParams);
                DataSet dsParams = _db.GetDataSet();

                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                await _db.SPExecute(dsParams.Tables[0].Rows[0]["storedProcedure"].ToString());
                if (!data.hasService)
                {
                    _db.AddDynamicParam("idRol", idUsuarioRol);
                }
                _db.AddDynamicParam("json", data.dataParams);
                DataSet ds = _db.GetDataSet();


                byte[] bytes = _report.ByteReport(dsParams, ds);
                if (bytes == null || bytes.Length == 0)
                {
                    ReportError.ReportNotFound(_response);
                }
                else
                {
                    fileName = dsParams.Tables[0].Rows[0]["fileName"].ToString();

                    var provider = new FileExtensionContentTypeProvider();
                    if (!provider.TryGetContentType(fileName, out mimeType))
                    {
                        mimeType = "application/octet-stream";
                    }
                    _response.Create(bytes, mimeType, fileName);
                }
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _log.LogError("Error in Download: \n" + ex.ToString());
                ReportError.ReportNotFound(_response);
                return Ok(_response);
            }
        }


        //Dynamic Report --> From Client
        [HttpPost("DynamicReport")]
        public IActionResult DynamicReport([FromBody] ApiReportParamsDto data)
        {
            LogWriter _log = new LogWriter(_configuration);

            FileModelDto _response = new FileModelDto();
            string mimeType = string.Empty;
            string fileName = string.Empty;
            byte[] bytes = null;
            try
            {
                ApiReportParamsDto _dataReport = ConverToModelReportParams(data);
                bytes = _report.ByteReportDynamic(_dataReport, ref mimeType, ref fileName);
                if (bytes == null || bytes.Length == 0)
                {
                    ReportError.ReportNotFound(_response);
                }
                else
                {
                    _response.Create(bytes, mimeType, fileName);
                }
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _log.LogError("Error in DynamicReport: \n" + ex.ToString());
                ReportError.ReportNotFound(_response);
                return Ok(_response);
            }
        }

        public static ApiReportParamsDto ConverToModelReportParams(ApiReportParamsDto data)
        {
            ApiReportParamsDto _response = new ApiReportParamsDto();
            Dictionary<string, string> rdlcParams = new Dictionary<string, string>();
            var _arrayProps = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(data.reportParams);

            foreach (var item in _arrayProps.FirstOrDefault())
            {
                if (item.Key == "imagen" && !string.IsNullOrEmpty(item.Value))
                {
                    rdlcParams.Add(item.Key, item.Value);
                }
                if (item.Key == "mimeType" && !string.IsNullOrEmpty(item.Value))
                {
                    rdlcParams.Add(item.Key, item.Value);
                }

                if (item.Key == "claveAcceso" && !string.IsNullOrEmpty(item.Value))
                {
                    rdlcParams.Add(item.Key, item.Value);
                }

                if (item.Key == "rdlcParams" && !string.IsNullOrEmpty(item.Value.ToString()))
                {
                    var arrayParams = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(item.Value);
                    foreach (var paramRdlc in arrayParams.FirstOrDefault())
                    {
                        rdlcParams.Add(paramRdlc.Key, paramRdlc.Value);
                    }

                }

                if (item.Key == "dataSources" && !string.IsNullOrEmpty(item.Value.ToString()))
                {
                    var arrayDS = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(item.Value.ToString());
                    Dictionary<string, List<Dictionary<string, string>>> ldDataSources = new Dictionary<string, List<Dictionary<string, string>>>();

                    foreach (var dataSource in arrayDS.FirstOrDefault())
                    {
                        var dataDS = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(dataSource.Value);
                        List<Dictionary<string, string>> dataSources = new List<Dictionary<string, string>>();

                        foreach (var value in dataDS)
                        {
                            Dictionary<string, string> itemDs = new Dictionary<string, string>();
                            foreach (var de in value)
                            {
                                itemDs.Add(de.Key, de.Value);
                            }
                            dataSources.Add(itemDs);
                        }
                        ldDataSources.Add(dataSource.Key, dataSources);
                    }
                    _response.dataSources = ldDataSources;
                }
            }

            _response.rdlcParams = rdlcParams;

            return _response;
        }
    }
}

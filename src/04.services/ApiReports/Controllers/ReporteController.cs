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
        [HttpPost("GetReport")]
        public IActionResult GetReport([FromBody] ApiReportParamsDto parameters)
        {
            LogWriter _log = new LogWriter(_configuration);
            FileModelDto _response = new FileModelDto();
            try
            {
                byte[] report = null;
                using (LocalReport lr = new LocalReport())
                {
                    string format = string.Empty;
                    string deviceInfo = string.Empty;
                    string fileName = string.Empty;
                    foreach (var item in parameters.rdlcProps)
                    {
                        if (item.Key == "rdlcName")
                        {
                            lr.ReportPath = _configuration.GetSection("dirReports").Value + item.Value;
                        }
                        if (item.Key == "format")
                        {
                            format = item.Value;
                        }
                        if (item.Key == "fileName")
                        {
                            fileName = item.Value;
                        }
                    }

                    foreach (var item in parameters.dataSources)
                    {
                        lr.DataSources.Add(new ReportDataSource(item.Key, DataHelperNS.JsonToDataTable(JsonConvert.SerializeObject(item.Value))));
                    }
                    if (parameters.rdlcParams != null)
                    {
                        int index = 0;
                        ReportParameter[] rp = new ReportParameter[parameters.rdlcParams.Keys.Count];
                        foreach (var item in parameters.rdlcParams)
                        {
                            rp[index++] = new ReportParameter(item.Key, item.Value);
                        }
                        lr.SetParameters(rp);
                    }
                    report = lr.Render(format,
                                       deviceInfo,
                                       PageCountMode.Actual,
                                       out string mimeType,
                                       out string encoding,
                                       out string fileNameExtension,
                                       out string[] streams,
                                       out Warning[] warnings);
                    //_response.message = "Report Created";

                    _response.ContentType = mimeType;
                    _response.FileName = fileName + "." + fileNameExtension;
                    _response.Content = report;

                    //Uncomment to preview report in postman
                    if (report == null || report.Length == 0)
                    {
                        ReportError.ReportNotFound(_response);
                    }

                    //async Task<IActionResult> response = Request.CreateResponse(HttpStatusCode.OK);

                    //Set the Response Content.
                    //response.Content = new ByteArrayContent(_response.Content);

                    //Set the Response Content Length.
                    //response.Content.Headers.ContentLength = _response.Content.LongLength;

                    //Set the Content Disposition Header Value and FileName. 
                    //response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                    //response.Content.Headers.ContentDisposition.FileName = _response.FileName;

                    //Set the File Content Type. 
                    //response.Content.Headers.ContentType = new MediaTypeHeaderValue(mimeType);
                    return File(_response.Content, _response.ContentType, _response.FileName);

                    //End Preview


                    //return this.Request.CreateResponse(HttpStatusCode.OK, _response);
                }
            }
            catch (Exception ex)
            {
                _log.LogError("Error in GetReport: \n" + ex.ToString());
                return BadRequest();
            }
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

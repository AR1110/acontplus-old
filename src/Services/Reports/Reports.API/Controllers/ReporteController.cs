using System.Data;
using System.Text;
using System.Web;
using Common.Core.Interfaces;
using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Reports.API.Dtos;
using Reports.API.Interfaces;
using Services.Common;
using Services.Common.Logs;

namespace Reports.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReporteController : ControllerBase
    {
        private readonly IReportService _reportService;
        private readonly IRdlcReportService _rdlcreport;
        private readonly LogWriter _log;
        public ReporteController(IReportService reportService, IRdlcReportService report, LogWriter log)
        {
            _reportService = reportService;
            _rdlcreport = report;
            _log = log;
        }
        //method for backend request to db
        [HttpPost("Download")]
        public async Task<IActionResult> Download(ApiReportParamsDto data)
        {
            //Request.Headers.TryGetValue("Authorization", out StringValues headerValues);
            //string jsonWebToken = headerValues.FirstOrDefault();
            try
            {
                string storedProcedure = "", filename = "", mimeType = "";
                var userRoleId = User.GetUserRoleId();

                DataSet dsParams = await _reportService.GetParamsAsync(new Dictionary<string, object> { { "json", SqlStringParam.Sanitize(data.reportParams) } });

                if (dsParams.Tables[0].Rows.Count == 0)
                {
                    _log.LogActivity($"Can't get report params \nReportParams: {data.reportParams}");
                    return BadRequest("Can't get report params");
                }

                storedProcedure = dsParams.Tables[0].Rows[0].Field<string>("storedProcedure");
                filename = dsParams.Tables[0].Rows[0].Field<string>("fileName");

                var dataParams = new Dictionary<string, object>();
                if (!data.hasService)
                {
                    if (data.hasIdUsuarioRol)
                    {
                        dataParams["idUsuarioRol"] = userRoleId;
                    }
                    else
                    {
                        dataParams["idRol"] = userRoleId;
                    }
                }

                dataParams["json"] = SqlStringParam.Sanitize(data.dataParams);

                DataSet ds = await _reportService.GetDataAsync(storedProcedure, dataParams);

                if (ds.Tables[0].Rows.Count == 0)
                {
                    _log.LogActivity($"Can't get report data \nReportParams: {data.reportParams}");
                    return BadRequest("Can't get report data");
                }

                var bytes = _rdlcreport.GetCustomReport(dsParams, ds);
                if (bytes == null || bytes.Length == 0)
                {
                    _log.LogActivity($"Error in rdlc generation \nReportParams: {data.reportParams}");
                    return BadRequest($"Error in rdlc generation");
                }
                var provider = new FileExtensionContentTypeProvider();
                if (!provider.TryGetContentType(filename, out mimeType))
                {
                    mimeType = "application/octet-stream";
                }

                return File(bytes, mimeType, HttpUtility.UrlEncode(filename, Encoding.UTF8));
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error in Download: \n {ex} \nReportParams: {data.reportParams}");
                return BadRequest($"Error in Download: {ex.Message}");
            }
        }
        [HttpPost("Dynamic")]
        public async Task<IActionResult> GetReport(ApiReportParamsDto data)
        {
            try
            {
                string storedProcedure = "", filename = "";
                var userRoleId = User.GetUserRoleId();

                DataSet dsParams = await _reportService.GetParamsAsync(new Dictionary<string, object> { { "json", SqlStringParam.Sanitize(data.reportParams) } });

                if (dsParams.Tables[0].Rows.Count == 0)
                {
                    _log.LogActivity($"Can't get report params \nReportParams: {data.reportParams}");
                    return BadRequest("Can't get report params");
                }

                storedProcedure = dsParams.Tables[0].Rows[0].Field<string>("storedProcedure");
                filename = dsParams.Tables[0].Rows[0].Field<string>("fileName");

                var dataParams = new Dictionary<string, object>();
                if (!data.hasService)
                {
                    dataParams["userRoleId"] = userRoleId;
                }

                dataParams["json"] = SqlStringParam.Sanitize(data.dataParams);

                DataSet ds = await _reportService.GetDataAsync(storedProcedure, dataParams, false);

                if (ds.Tables[0].Rows.Count == 0)
                {
                    _log.LogActivity($"Can't get report data \nReportParams: {data.reportParams}");
                    return BadRequest("Can't get report data");
                }

                var response = _rdlcreport.GetDynamicReport(ds);
                return File(response.FileContents, response.ContentType, HttpUtility.UrlEncode(response.FileDownloadName, Encoding.UTF8));
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error in Download: \n {ex} \nReportParams: {data.reportParams}");
                return BadRequest($"Error in Download: {ex.Message}");
            }
        }
        //[HttpPost("ExportExcel")]
        //public async Task<IActionResult> ExportExcel(ApiReportParamsDto data)
        //{
        //    
        //    Request.Headers.TryGetValue("Authorization", out StringValues headerValues);
        //    string jsonWebToken = headerValues.FirstOrDefault();
        //    
        //    string mimeType = string.Empty;
        //    string fileName = string.Empty;
        //    try
        //    {
        //        DbAccess _db = new DbAccess(_configuration);
        //        await _db.SPExecute("Reporte.Report_Get");
        //        _db.AddDynamicParam("json", data.reportParams);
        //        DataSet dsParams = _db.GetDataSet();

        //        int idUsuarioRol = User.GetUserRoledId();

        //        await _db.SPExecute(dsParams.Tables[0].Rows[0]["storedProcedure"].ToString());
        //        _db.AddDynamicParam("json", data.dataParams);
        //        DataSet ds = _db.GetDataSet();
        //        fileName = dsParams.Tables[0].Rows[0].Field<string>("fileName");
        //        string trimmed = fileName.Split(".").First();
        //        var excelFile = ExcelReports.Export(ds, trimmed);
        //        if (excelFile == null || excelFile.Length == 0)
        //        {
        //            ReportError.ReportNotFound(_response);
        //        }
        //        else
        //        {
        //            _response.Create(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName + "x");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _log.LogError("Error in Download: \n" + ex.ToString());
        //        ReportError.ReportNotFound(_response);
        //    }
        //    return File(_response.Content, _response.ContentType, _response.FileName);
        //}
    }
}

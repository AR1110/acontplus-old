using Asp.Versioning;
using System.Data;
using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Reports.API.Dtos;
using Reports.API.Interfaces;
using Services.Common;
using Services.Common.Logs;

namespace Reports.API.Controllers.v1
{
    [Route("api/reporte/[action]")]
    [ApiController]
    [ApiVersion("1.0")]
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
        [HttpPost]
        public async Task<IActionResult> Download(ApiReportParamsDto data)
        {
            //Request.Headers.TryGetValue("Authorization", out StringValues headerValues);
            //string jsonWebToken = headerValues.FirstOrDefault();
            try
            {
                string storedProcedure = "";
                var userRoleId = User.GetUserRoleId();

                var dsParams = await _reportService.GetParamsAsync(new Dictionary<string, object> { { "json", SqlStringParam.Sanitize(data.reportParams) } });

                if (dsParams.Tables["ReportProps"].Rows.Count == 0)
                {
                    _log.LogActivity($"Can't get report params \n ReportProps: {data.reportParams}");
                    return BadRequest("Can't get report params");
                }

                storedProcedure = dsParams.Tables["ReportProps"].Rows[0].Field<string>("storedProcedure");

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

                var ds = await _reportService.GetDataAsync(storedProcedure, dataParams);

                if (ds.Tables[0].Rows.Count == 0)
                {
                    _log.LogActivity($"Can't get report data \n ReportProps: {data.reportParams}");
                    return BadRequest("Can't get report data");
                }
                var response = _rdlcreport.GetReport(dsParams, ds);
                if (response == null)
                {
                    _log.LogActivity($"Error in rdlc generation \n ReportProps: {data.reportParams}");
                    return BadRequest($"Error in rdlc generation");
                }
                return File(response.FileContents, response.ContentType, response.FileDownloadName);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error in Download: \n {ex} \n ReportProps: {data.reportParams}");
                return BadRequest($"Error in Download: {ex.Message}");
            }
        }
        //[HttpPost]
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

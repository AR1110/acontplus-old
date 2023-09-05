using System.Data;
using Common.Reports.Interfaces;
using DataAccess;
using Domain.Dtos;
using Lib.Common.DbUtils;
using Lib.Common.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Services.Common.Logs;

namespace ApiReports.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReporteController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IReportService _report;
        private readonly LogWriter _log;
        public ReporteController(IConfiguration configuration, IReportService report, LogWriter log)
        {
            _configuration = configuration;
            _report = report;
            _log = log;
        }
        //method for backend request to db
        [HttpPost("Download")]
        public async Task<IActionResult> Download(ApiReportParamsDto data)
        {
            //Request.Headers.TryGetValue("Authorization", out StringValues headerValues);
            //string jsonWebToken = headerValues.FirstOrDefault();
            var _response = new ReportResponseDto();
            string mimeType = string.Empty, fileName = string.Empty;
            try
            {
                DataSet dsParams = null;
                DataSet ds = null;
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Reporte.Report_Get");
                    _db.AddDynamicParam("json", data.reportParams);
                    dsParams = _db.GetDataSet();

                    int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                    await _db.SPExecute(dsParams.Tables[0].Rows[0]["storedProcedure"].ToString());
                    if (!data.hasService)
                    {
                        if (data.hasIdUsuarioRol)
                        {
                            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                        }
                        else
                        {
                            _db.AddDynamicParam("idRol", idUsuarioRol);
                        }
                    }
                    _db.AddDynamicParam("json", data.dataParams);
                    ds = _db.GetDataSet();
                }

                byte[] bytes = _report.GetReport(dsParams, ds);
                if (bytes == null || bytes.Length == 0)
                {
                    _response = await _report.GetErrorAsync();
                }
                else
                {
                    fileName = dsParams.Tables[0].Rows[0].Field<string>("fileName");
                    var provider = new FileExtensionContentTypeProvider();
                    if (!provider.TryGetContentType(fileName, out mimeType))
                    {
                        mimeType = "application/octet-stream";
                    }
                    _response.Create(bytes, mimeType, fileName);
                }
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in Download: \n" + ex.ToString());
                _response = await _report.GetErrorAsync();
            }
            return File(_response.FileContents, _response.ContentType, _response.FileDownloadName);
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

        //        int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

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

        //Dynamic Report --> From Client
        [HttpPost("DynamicReport")]
        public async Task<IActionResult> DynamicReport([FromBody] ApiReportParamsDto data)
        {

            DbAccess _db = new DbAccess(_configuration);
            var _response = new ReportResponseDto();
            string mimeType = string.Empty, fileName = string.Empty;
            try
            {
                await _db.SPExecute("Reporte.Management_Get_To_Print");
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(data.dataParams));
                var _dt = _db.GetDataTableAsync();
                if (_dt.code == "1")
                {
                    byte[] bytes = _report.GetDynamicReport(_dt.payload, ref mimeType, ref fileName);
                    if (bytes == null || bytes.Length == 0)
                    {
                        _response = await _report.GetErrorAsync();
                    }
                    else
                    {
                        _response.Create(bytes, mimeType, fileName);
                    }
                }
                else
                {
                    _response = await _report.GetErrorAsync();
                }
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in DynamicReport: \n" + ex.ToString());
                _response = await _report.GetErrorAsync();
            }
            finally
            {
                _db.Close();
            }
            return File(_response.FileContents, _response.ContentType, _response.FileDownloadName);
        }
    }
}

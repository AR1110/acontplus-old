using BL.Reports;
using Common.Logs;
using DataAccess;
using Domain.Dtos;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Primitives;
using Org.BouncyCastle.Pqc.Crypto.Lms;
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
                DataSet ds = _db.GetDataSet();


                byte[] bytes = _report.ByteReport(dsParams, ds);
                if (bytes == null || bytes.Length == 0)
                {
                    ReportError.ReportNotFound(_response);
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
                //return Ok(_response);
            }
            catch (Exception ex)
            {
                _log.LogError("Error in Download: \n" + ex.ToString());
                ReportError.ReportNotFound(_response);
            }
            return File(_response.Content, _response.ContentType, _response.FileName);
        }
        [HttpPost("ExportExcel")]
        public async Task<IActionResult> ExportExcel(ApiReportParamsDto data)
        {
            LogWriter _log = new LogWriter(_configuration);
            Request.Headers.TryGetValue("Authorization", out StringValues headerValues);
            string jsonWebToken = headerValues.FirstOrDefault();
            FileModelDto _response = new FileModelDto();
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
                _db.AddDynamicParam("json", data.dataParams);
                DataSet ds = _db.GetDataSet();
                fileName = dsParams.Tables[0].Rows[0].Field<string>("fileName");
                string trimmed = fileName.Split(".").First();
                var excelFile = ExcelReports.Export(ds, trimmed);
                if (excelFile == null || excelFile.Length == 0)
                {
                    ReportError.ReportNotFound(_response);
                }
                else
                {
                    _response.Create(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName + "x");
                }
            }
            catch (Exception ex)
            {
                _log.LogError("Error in Download: \n" + ex.ToString());
                ReportError.ReportNotFound(_response);
            }
            return File(_response.Content, _response.ContentType, _response.FileName);
        }

        //Dynamic Report --> From Client
        [HttpPost("DynamicReport")]
        public async Task<IActionResult> DynamicReport([FromBody] ApiReportParamsDto data)
        {
            LogWriter _log = new LogWriter(_configuration);
            DbAccess _db = new DbAccess(_configuration);
            FileModelDto _response = new FileModelDto();
            string mimeType = string.Empty, fileName = string.Empty;
            try
            {
                await _db.SPExecute("Reporte.Management_Get_To_Print");
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(data.dataParams));
                var _dt = _db.GetDataTableAsync();
                //data.reportParams = _dt.payload;
                //var _dataReport = ConverToModelReportParams(data);
                if (_dt.code == "1")
                {
                    byte[] bytes = _report.ByteReportDynamic(_dt.payload, ref mimeType, ref fileName);
                    if (bytes == null || bytes.Length == 0)
                    {
                        ReportError.ReportNotFound(_response);
                    }
                    else
                    {
                        _response.Create(bytes, mimeType, fileName);
                        if (data.sendToWhatsapp)
                        {
                            await new FileUpload().Upload(_configuration.GetSection("WhatsAppFiles").Value, _response.FileName, _response.Content);
                            return Ok(_response.FileName);
                        }
                    }
                }
                else
                {
                    ReportError.ReportNotFound(_response);
                }
            }
            catch (Exception ex)
            {
                _log.LogError("Error in DynamicReport: \n" + ex.ToString());
                ReportError.ReportNotFound(_response);
                if (data.sendToWhatsapp)
                {
                    return BadRequest(ex.Message);
                }
            }
            finally
            {
                _db.Close();
            }
            return File(_response.Content, _response.ContentType, _response.FileName);
        }
    }
}

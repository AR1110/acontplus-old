using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Reports.API.Dtos;
using Services.Common;
using Services.Common.Logs;
using System.Data;
using Asp.Versioning;
using Reports.Core.Interfaces;

namespace Reports.API.Controllers.v2
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("2.0")]
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
        [HttpPost("Download")]
        public async Task<IActionResult> Download(ApiReportParamsDto data)
        {
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
                    dataParams["userRoleId"] = userRoleId;
                }

                dataParams["json"] = SqlStringParam.Sanitize(data.dataParams);

                var ds = await _reportService.GetDataAsync(storedProcedure, dataParams, false);

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
    }
}

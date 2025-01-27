using Reports.API.Services;
using Reports.Application.Interfaces;

namespace Reports.API.Controllers.v2
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("2.0")]

    public class ReporteController(IReportService reportService, IRdlcReportService rdlcReportService)
        : ControllerBase
    {
        [HttpPost("Download")]
        public async Task<IActionResult> Download(ApiReportParamsDto data)
        {
            //string connectionString = HttpContext.Items["ConnectionString"].ToString();

            // Validate input parameters
            if (data == null || string.IsNullOrWhiteSpace(data.reportParams) || string.IsNullOrWhiteSpace(data.dataParams))
            {
                return BadRequest("Invalid input parameters.");
            }

            // Sanitize inputs to prevent SQL injection
            string sanitizedReportParams = SqlStringParam.Sanitize(data.reportParams);
            string sanitizedDataParams = SqlStringParam.Sanitize(data.dataParams);

            var dsParams = await reportService.GetParamsAsync(new Dictionary<string, object> { { "json", sanitizedReportParams } });

            if (dsParams.Tables["ReportProps"].Rows.Count == 0)
            {
                return BadRequest("Can't get report params.");
            }

            string storedProcedure = dsParams.Tables["ReportProps"].Rows[0].Field<string>("storedProcedure");

            var dataParams = new Dictionary<string, object>();

            // Determine user role ID
            var userRoleId = User.GetUserRoleId();

            if (!data.hasService)
            {
                dataParams["userRoleId"] = userRoleId;
            }

            dataParams["json"] = sanitizedDataParams;

            using var ds = await reportService.GetDataAsync(storedProcedure, dataParams, true);

            if (ds.Tables[0].Rows.Count == 0)
            {
                return BadRequest("Can't get report data.");
            }

            using var response = rdlcReportService.GetReport(dsParams, ds);

            return response switch
            {
                null => BadRequest("Error in RDLC generation."),
                _ => File(response.FileContents, response.ContentType, response.FileDownloadName)
            };
        }
    }
}

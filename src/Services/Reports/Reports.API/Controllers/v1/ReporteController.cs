namespace Reports.API.Controllers.v1
{
    [Route("api/reporte/[action]")]
    [ApiController]
    [ApiVersion("1.0")]
    public class ReporteController : ControllerBase
    {
        private readonly IReportService _reportService;
        private readonly IRdlcReportService _rdlcReportService;

        public ReporteController(IReportService reportService, IRdlcReportService rdlcReportService)
        {
            _reportService = reportService;
            _rdlcReportService = rdlcReportService;
        }

        [HttpPost]
        public async Task<IActionResult> Download(ApiReportParamsDto data)
        {
            // Validate input parameters
            if (data == null || string.IsNullOrWhiteSpace(data.reportParams) || string.IsNullOrWhiteSpace(data.dataParams))
            {
                return BadRequest("Invalid input parameters.");
            }

            // Sanitize inputs to prevent SQL injection
            string sanitizedReportParams = SqlStringParam.Sanitize(data.reportParams);
            string sanitizedDataParams = SqlStringParam.Sanitize(data.dataParams);

            var dsParams = await _reportService.GetParamsAsync(new Dictionary<string, object> { { "json", sanitizedReportParams } });

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
                dataParams[data.hasIdUsuarioRol ? "idUsuarioRol" : "idRol"] = userRoleId;
            }

            dataParams["json"] = sanitizedDataParams;

            var ds = await _reportService.GetDataAsync(storedProcedure, dataParams);

            if (ds.Tables[0].Rows.Count == 0)
            {
                return BadRequest("Can't get report data.");
            }

            var response = _rdlcReportService.GetReport(dsParams, ds);

            if (response == null)
            {
                return BadRequest("Error in RDLC generation.");
            }

            return File(response.FileContents, response.ContentType, response.FileDownloadName);
        }
    }
}

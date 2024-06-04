namespace FactElect.API.Controllers.Sri;

[ApiController]
[Route("api/[controller]")]
public class AtsController : ControllerBase
{
    private readonly IConfiguration _configuration;

    private readonly AtsXml _atsXml = new();

    public AtsController(IConfiguration configuration)
    {
        _configuration = configuration;

    }

    [HttpGet("Get")]
    public IActionResult GetPeriods()
    {
        object[] periods = null;
        try
        {
            var years = new List<Year>();
            var months = Enum.GetValues(typeof(Calendar.Months))
                .Cast<Calendar.Months>()
                .Select(t => new Month { month = (short)t, name = t.ToString() });

            var totalYears = 13;

            var actualYear = DateTime.Now.Year;

            for (var i = 0; i < totalYears; i++)
            {
                years.Add(new Year { year = actualYear - i });
            }

            periods = new object[] { years, months };
        }
        catch (Exception ex)
        {
            _ = ex.Message;
        }

        return Ok(periods);
    }

    [HttpGet("Download")]
    public async Task<IActionResult> Download(string json)
    {
        using var _db = new DbAccess(_configuration);
        var _response = new ApiResponse();
        await _db.SPExecute("ASPAtsGetData", true);
        _db.AddDynamicParam("idRol", User.GetUserRoleId());
        _db.AddDynamicParam("json", json);
        var ds = _db.GetDataSet();
        if (!ds.Tables[0].Columns.Contains("code"))
        {
            byte[] xmlAts = null;
            if (_atsXml.Create(ref ds, ref xmlAts))
            {
                var fileName = "ATS_" + ds.Tables[0].Rows[0]["IdInformante"]
                                      + "_" + ds.Tables[0].Rows[0]["numEstabRuc"]
                                      + "_" + ds.Tables[0].Rows[0]["anio"] + "_"
                                      + ds.Tables[0].Rows[0]["mes"];
                return File(xmlAts, "text/xml", fileName + ".xml");
            }
            return BadRequest("No se pudo generar el ats");
        }
        return BadRequest(ds.Tables[0].Rows[0].Field<string>("message"));
    }
}

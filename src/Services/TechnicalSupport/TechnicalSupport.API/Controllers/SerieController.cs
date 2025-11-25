namespace TechnicalSupport.Api.Controllers;

public class SerieController : BaseApiController
{
    private readonly ISerieRepository _serieService;

    public SerieController(ISerieRepository serieService)
    {
        _serieService = serieService;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var response = await _serieService.GetAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        });
        if (response == null) return BadRequest("Can't Get Data");

        ;
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Serie serie)
    {
        serie.CreatedByUserId = User.GetUserId();
        var response = await _serieService.AddAsync(serie);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Serie serie)
    {
        serie.UpdatedByUserId = User.GetUserId();
        var response = await _serieService.UpdateAsync(id, serie);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = await _serieService.DeleteAsync(User.GetUserId(), id);
        return Ok(response);
    }
}

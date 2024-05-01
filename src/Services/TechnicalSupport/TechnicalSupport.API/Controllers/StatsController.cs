namespace TechnicalSupport.API.Controllers
{
    public class StatsController : BaseApiController
    {
        private ICustomLogger _log;
        private readonly IStatsService _statsService;

        public StatsController(IStatsService statsService)
        {
            _statsService = statsService;
            
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } };
                var response = await _statsService.GetAsync(parameters);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on get: \n{json} \n {ex}");
                return BadRequest(ex.Message);
            }
        }
    }
}

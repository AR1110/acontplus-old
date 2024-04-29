namespace TechnicalSupport.API.Controllers
{
    public class ModeloController : BaseApiController
    {
        private readonly IModeloService _modeloService;
        private readonly ICustomLogger _log;
        public ModeloController(IModeloService modeloService, ICustomLogger log)
        {
            _modeloService = modeloService;
            _log = log;
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var response = await _modeloService.GetAsync(new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on Get:\n {ex}");
                return BadRequest("Error on get");
            }
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Modelo modelo)
        {
            try
            {
                modelo.UserId = User.GetUserId();
                var response = await _modeloService.AddAsync(modelo);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on post: \n {ex} \n {JsonConvert.SerializeObject(modelo)}");
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Modelo modelo)
        {
            try
            {
                modelo.UserId = User.GetUserId();
                var response = await _modeloService.UpdateAsync(id, modelo);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on put: {id} \n {ex} \n {JsonConvert.SerializeObject(modelo)}");
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var response = await _modeloService.DeleteAsync(User.GetUserId(), id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on delete: {id} \n {ex} \n");
                return BadRequest(ex.Message);
            }
        }
    }
}

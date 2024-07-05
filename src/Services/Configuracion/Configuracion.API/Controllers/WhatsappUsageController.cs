namespace Configuracion.API.Controllers
{
    public class WhatsappUsageController(IConfiguration configuration, IWhatsappUsageService whatsappUsageService) : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var parameters = new Dictionary<string, object>
            {
                {"idUsuarioRol" , User.GetUserRoleId()},
                {"json" , SqlStringParam.Sanitize(json)},
            };
            return Ok(await whatsappUsageService.GetAsync(parameters));
        }
        [HttpPost]
        public async Task<ActionResult<ApiResponseDeprecated>> Post([FromBody] ApiRequest parameters)
        {
            var _response = new ApiResponseDeprecated();
            var _db = new DbAccess(configuration);
            try
            {
                await _db.SPExecute("Config.WhatsappUsage_Insert");
                _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
                _response = _db.GetDefault();
            }
            finally
            {
                _db.Close();
            }
            return _response;
        }
        [HttpPut]
        public async Task<ActionResult<ApiResponseDeprecated>> Put(int id, [FromBody] ApiRequest parameters)
        {
            var _response = new ApiResponseDeprecated();
            var _db = new DbAccess(configuration);
            try
            {
                await _db.SPExecute("Config.WhatsappUsage_Update");
                _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
                _response = _db.GetDefault();
            }
            finally
            {
                _db.Close();
            }
            return _response;
        }
        [HttpDelete]
        public async Task<ActionResult<ApiResponseDeprecated>> Delete(int id)
        {
            var _response = new ApiResponseDeprecated();
            var _db = new DbAccess(configuration);
            try
            {
                await _db.SPExecute("Config.WhatsappUsage_Delete");
                _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            finally
            {
                _db.Close();
            }
            return _response;
        }
    }
}

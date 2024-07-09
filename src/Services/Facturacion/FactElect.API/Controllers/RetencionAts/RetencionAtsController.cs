using FactElect.API.Dtos;

namespace FactElect.API.Controllers.RetencionAts;

public class RetencionAtsController : BaseApiController
{
    private readonly IConfiguration _configuration;
    private readonly DbAccess _db;
    private readonly IRetencionAtsService _retencionAtsService;

    public RetencionAtsController(IConfiguration configuration, IRetencionAtsService retencionAtsService)
    {
        _configuration = configuration;
        _db = new DbAccess(_configuration);
        _retencionAtsService = retencionAtsService;
    }

    [HttpGet("{json}")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>{
            {"idRol", User.GetUserRoleId()},
            {"json", SqlStringParam.Sanitize(json)},
        };
        return Ok(await _retencionAtsService.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] RetencionAtsDto data)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SpExecuteAsync("FactElect.RetencionAts_Insert");
            _db.AddDynamicParam("idRol", User.GetUserRoleId());
            _db.AddDynamicParam("infoCompRet", SqlStringParam.Sanitize(data.infoCompRet));
            _db.AddDynamicParam("docsSust", SqlStringParam.Sanitize(data.docsSust));
            _db.AddDynamicParam("impuestos", SqlStringParam.Sanitize(data.impuestos));
            _db.AddDynamicParam("retenciones", SqlStringParam.Sanitize(data.retenciones));
            if (!string.IsNullOrEmpty(data.reembolsos))
            {
                _db.AddDynamicParam("reembolsos", SqlStringParam.Sanitize(data.reembolsos));
            }

            _db.AddDynamicParam("payments", SqlStringParam.Sanitize(data.payments));
            if (!string.IsNullOrEmpty(data.infoAdicional))
            {
                _db.AddDynamicParam("infoAdicional", SqlStringParam.Sanitize(data.infoAdicional));
            }

            _response = await _db.GetDefaultAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, RetencionAtsDto data)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SpExecuteAsync("FactElect.RetencionAts_Update");
            _db.AddDynamicParam("idRol", User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("infoCompRet", SqlStringParam.Sanitize(data.infoCompRet));
            _response = await _db.GetDefaultAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut("Cancel/{id}")]
    public async Task<IActionResult> Cancel(int id)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SpExecuteAsync("FactElect.RetencionAts_Cancel");
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("idRol", User.GetUserRoleId());
            _response = await _db.GetDefaultAsync();
            ;
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SpExecuteAsync("FactElect.RetencionAts_Delete");
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("idRol", User.GetUserRoleId());
            _response = await _db.GetDefaultAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}

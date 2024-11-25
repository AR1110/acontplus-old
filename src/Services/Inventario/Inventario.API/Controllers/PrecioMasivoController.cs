using Common.AppSettings;

namespace Inventario.API.Controllers;

public class PrecioMasivoController : BaseApiController
{

    private readonly IPrecioMasivoService _service;

    public PrecioMasivoController(IPrecioMasivoService service)
    {
        _service = service;

    }

    [HttpGet]
    public async Task<ActionResult<ApiResponseDeprecated>> Get(string json)
    {
        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            };
        var response = await _service.GetAsync(parameters);
        if (response == null) { return NoContent(); }

            ;
        return Ok(response);
    }

    //[HttpPost]
    //public async Task<ActionResult<ApiResponse>> Post(ApiRequest parameters)
    //{
    //    DbAccess _db = new DbAccess(_configuration);
    //    ApiResponse _response = new ApiResponse();
    //    try
    //    {
    //        await _db.SPExecute("Inventario.PrecioMasivo_Insert");
    //        _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
    //        _db.AddDynamicParam("json", DataConverters.SerializeDictionary(parameters.Data));
    //        _response = await _db.GetDefaultAsync();
    //    }
    //    catch (Exception ex)
    //    {

    //        _log.LogActivity("Error on Post: \n" + ex.ToString());
    //        _response.Create(code: "0", message: "Error al guardar");
    //    }
    //    finally
    //    {
    //        _db.Close();
    //    }
    //    return _response;
    //}
    [HttpPut]
    public async Task<ActionResult> Put(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
            };
        var response = await _service.UpdateAsync(parameters);
        if (response == null) { return NoContent(); }

            ;
        return Ok(response);
    }
}

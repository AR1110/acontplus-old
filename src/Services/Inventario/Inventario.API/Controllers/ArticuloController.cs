using Common.AppSettings.Extensions;

namespace Inventario.API.Controllers;

public class ArticuloController(
    S3ObjectCustom s3ObjectCustom,
    IS3StorageService storageService,
    IArticuloService articuloService)
    : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        if (!DataValidation.IsValidJson(json))
        {
            return BadRequest("Caracteres de busqueda invalidos");
        }

        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await articuloService.GetAsync(parameters));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var parameters = new Dictionary<string, object> { { "id", id } };
        return Ok(await articuloService.GetByIdAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post(string json, IFormFile file)
    {
        var data = JsonConvert.DeserializeObject<ApiRequest>(json);

        if (file != null)
        {
            await s3ObjectCustom.Add($"{User.GetIdCardCompany()}/articulos/", file);
        }

        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) },
            { "s3ObjectKey", s3ObjectCustom.S3ObjectKey ?? "" },
            { "s3ObjectUrl", s3ObjectCustom.S3ObjectUrl ?? "" }
        };
        var response = await articuloService.AddAsync(parameters);

        switch (response.Code)
        {
            case "1" when file != null:
            {
                var s3Response = await storageService.UploadAsync(s3ObjectCustom);
                s3ObjectCustom.Dispose();
                break;
            }
        }

        return Ok(response);
    }
    
    /**
     * Se agrega este metódo porque ocurre un montón de problemas
     * con métodos que aceptan argumentos de tipo archivo
     **/
    [HttpPost("PostByApp")]
    public async Task<IActionResult> PostByApp(string json)
    {
        var data = JsonConvert.DeserializeObject<ApiRequest>(json);

        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) },
            { "s3ObjectKey", "" },
            { "s3ObjectUrl", "" }
        };

        return Ok(await articuloService.AddAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, string json)
    {
        var data = JsonConvert.DeserializeObject<ApiRequest>(json);
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        return Ok(await articuloService.UpdateAsync(parameters));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } };
        return Ok(await articuloService.DeleteAsync(parameters));
    }

    [HttpGet("Search")]
    public async Task<IActionResult> Search(string json)
    {
        if (!DataValidation.IsValidJson(json))
        {
            return BadRequest("Caracteres de busqueda invalidos");
        }

        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };

        return Ok(await articuloService.SearchAsync(parameters));
    }
}

namespace Configuracion.API.Controllers;

public class FirmaElectronicaController(
    IFirmaElectronicaService firmaElectronicaService) : BaseApiController
{
    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await firmaElectronicaService.GetAsync(parameters));
    }

    [HttpPost("Post")]
    public async Task<IActionResult> Post(string json, IFormFile file)
    {
        if (file.ContentType != "application/x-pkcs12")
        {
            return Ok(new ApiResponse { Code = "0", Message = "Formato de archivo no soportado" });
        }

        var signFile = new FileModel
        {
            FileName = FileExtensions.SanitizeFileName(file.FileName),
            ContentType = file.ContentType,
            Content = FileData.GetFileByte(file)
        };
        var data = JsonConvert.DeserializeObject<FirmaElectronica>(json);

        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "contrasenia", data.contrasenia },
                { "fileName", signFile.FileName },
                { "firma", signFile.Content },
                { "contentType", signFile.ContentType },
                { "fechaCaducidad", data.fechaCaducidad },
                { "demoStepId", data.demoStepId },
                { "fromMobile", HttpContext.Items["FromMobile"] as bool? ?? false }
            };
        return Ok(await firmaElectronicaService.AddAsync(parameters));
    }

    [HttpPut("Put")]
    public async Task<IActionResult> Put(string json)
    {
        var data = JsonConvert.DeserializeObject<FirmaElectronica>(json);

        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "id", data.idFirmaElectronica },
                { "contrasenia", data.contrasenia },
                { "fechaCaducidad", data.fechaCaducidad },
                { "estado", data.estado }
            };
        return Ok(await firmaElectronicaService.UpdateAsync(parameters));
    }
    [HttpPost("UpdateSignature/{id}")]
    public async Task<IActionResult> UpdateSignature(int id, IFormFile file)
    {
        if (file.ContentType != "application/x-pkcs12")
        {
            return Ok(new ApiResponse { Code = "0", Message = "Formato de archivo no soportado" });
        }

        var signFile = new FileModel
        {
            FileName = FileExtensions.SanitizeFileName(file.FileName),
            ContentType = file.ContentType,
            Content = FileData.GetFileByte(file)
        };

        var parameters = new Dictionary<string, object>
        {
                { "userRoleId", User.GetUserRoleId() },
                { "id", id },
                { "fileName", signFile.FileName },
                { "firma", signFile.Content },
                { "contentType", signFile.ContentType },
        };
        return Ok(await firmaElectronicaService.UpdateFileAsync(parameters));
    }

}

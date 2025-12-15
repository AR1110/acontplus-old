using System.Security.Cryptography.X509Certificates;

namespace Configuration.Api.Controllers;

public class FirmaElectronicaController(
    IFirmaElectronicaService firmaElectronicaService) : BaseApiController
{
    private const string UserRoleId = "userRoleId";

    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>(UserRoleId) }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await firmaElectronicaService.GetAsync(parameters));
    }

    [HttpPost("Post")]
    public async Task<IActionResult> Post(string json, IFormFile file)
    {
        if (file.ContentType != "application/x-pkcs12")
            return Ok(new SpResponse { Code = "0", Message = "Formato de archivo no soportado" });

        var signFile = new FileModel
        {
            FileName = FileExtensions.SanitizeFileName(file.FileName),
            ContentType = file.ContentType,
            Content = FileData.GetFileByte(file)
        };
        var data = JsonExtensions.DeserializeOptimized<FirmaElectronica>(json);

        var cert = new X509Certificate2(signFile.Content, data.contrasenia,
                  X509KeyStorageFlags.Exportable | X509KeyStorageFlags.PersistKeySet);
        var expirationDate = DateTime.Parse(cert.GetExpirationDateString());

        var parameters = new Dictionary<string, object>
        {
            { UserRoleId, User.GetClaimValue<int>(UserRoleId) },
            { "contrasenia", data.contrasenia },
            { "fileName", signFile.FileName },
            { "firma", signFile.Content },
            { "contentType", signFile.ContentType },
            { "fechaCaducidad", expirationDate },
            { "demoStepId", data.demoStepId },
            { "fromMobile", HttpContext.Items["FromMobile"] as bool? ?? false }
        };
        return Ok(await firmaElectronicaService.AddAsync(parameters));
    }

    [HttpPut("Put")]
    public async Task<IActionResult> Put(string json)
    {
        var data = JsonExtensions.DeserializeOptimized<FirmaElectronica>(json);

        var parameters = new Dictionary<string, object>
        {
            { UserRoleId, User.GetClaimValue<int>(UserRoleId) },
            { "id", data.idFirmaElectronica },
            { "contrasenia", data.contrasenia },
            { "estado", data.estado }
        };
        return Ok(await firmaElectronicaService.UpdateAsync(parameters));
    }

    [HttpPost("UpdateSignature/{id}")]
    public async Task<IActionResult> UpdateSignature(int id, [FromForm] IFormFile file, [FromForm] string contrasenia)
    {
        if (file.ContentType != "application/x-pkcs12")
            return Ok(new SpResponse { Code = "0", Message = "Formato de archivo no soportado" });

        var signFile = new FileModel
        {
            FileName = FileExtensions.SanitizeFileName(file.FileName),
            ContentType = file.ContentType,
            Content = FileData.GetFileByte(file)
        };

        var cert = new X509Certificate2(signFile.Content, contrasenia,
          X509KeyStorageFlags.Exportable | X509KeyStorageFlags.PersistKeySet);
        var expirationDate = DateTime.Parse(cert.GetExpirationDateString());

        var parameters = new Dictionary<string, object>
        {
            { UserRoleId, User.GetClaimValue<int>(UserRoleId) },
            { "id", id },
            { "fileName", signFile.FileName },
            { "firma", signFile.Content },
            { "contentType", signFile.ContentType },
            { "contrasenia", contrasenia },
            { "fechaCaducidad", expirationDate },

        };
        return Ok(await firmaElectronicaService.UpdateFileAsync(parameters));
    }

    [HttpGet("Download/{id}")]
    public async Task<IActionResult> Download(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>(UserRoleId) },
            { "id", id }
        };
        var response = await firmaElectronicaService.DownloadAsync(parameters);
        return response == null
            ? BadRequest("No se encontro firma electrónica")
            : File(response.Content, "application/x-pkcs12", response.FileName);
    }
}

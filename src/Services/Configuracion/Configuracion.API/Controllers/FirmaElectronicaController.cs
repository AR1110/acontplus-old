namespace Configuracion.API.Controllers;

public class FirmaElectronicaController(
    IConfiguration configuration,
    ICustomLogger log,
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
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(configuration);
        try
        {
            var idRol = User.GetUserRoleId();
            if (file.ContentType != "application/x-pkcs12")
            {
                _response.Create("0", "Formato de archivo no soportado");
                return Ok(_response);
            }

            var signFile = new FileModel
            {
                FileName = FileExtensions.SanitizeFileName(file.FileName),
                ContentType = file.ContentType,
                Content = FileData.GetFileByte(file)
            };
            if (await new FileUpload().Upload(configuration.GetSection("FactElectCerts").Value, signFile.FileName,
                    signFile.Content))
            {
                var data = JsonConvert.DeserializeObject<FirmaElectronica>(json);
                await _db.SPExecute("Config.FirmaElectronica_Insert");
                _db.AddDynamicParam("idUsuarioRol",
                    User.GetUserRoleId());
                _db.AddDynamicParam("contrasenia", data.contrasenia);
                _db.AddDynamicParam("fileName", signFile.FileName);
                _db.AddDynamicParam("firma", signFile.Content);
                _db.AddDynamicParam("contentType", signFile.ContentType);
                _db.AddDynamicParam("fechaCaducidad", data.fechaCaducidad);
                _response = _db.GetDefault();
            }
            else
            {
                _response.Create("0", "Error al subir la firma");
            }
        }
        catch (Exception ex)
        {
            log.LogActivity("Error on Insert Firma Electronica: \n" + ex);
            _response.Create("0", "Error al registrar la firma electronica");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }


    [HttpPost("UpdateSignature/{id}")]
    public async Task<IActionResult> UpdateSignature(int id, IFormFile file)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(configuration);
        try
        {
            var idRol = User.GetUserRoleId();
            if (file.ContentType != "application/x-pkcs12")
            {
                _response.Create("0", "Formato de archivo no soportado");
                return Ok(_response);
            }

            var signFile = new FileModel
            {
                FileName = FileExtensions.SanitizeFileName(file.FileName),
                ContentType = file.ContentType,
                Content = FileData.GetFileByte(file)
            };
            if (await new FileUpload().Upload(configuration.GetSection("FactElectCerts").Value, signFile.FileName,
                    signFile.Content))
            {
                await _db.SPExecute("Config.FirmaElectronica_Update_Signature");
                _db.AddDynamicParam("idUsuarioRol",
                    User.GetUserRoleId());
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("fileName", signFile.FileName);
                _db.AddDynamicParam("firma", signFile.Content);
                _db.AddDynamicParam("contentType", signFile.ContentType);
                _response = _db.GetDefault();
            }
            else
            {
                _response.Create("0", "Error al actualizar la firma");
            }
        }
        catch (Exception ex)
        {
            log.LogActivity("Error on Update Firma Electronica: \n" + ex);
            _response.Create("0", "Error al Actualizar la firma electronica");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }


    [HttpPut("Put")]
    public async Task<IActionResult> Put(string json)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(configuration);
        try
        {
            var idRol = User.GetUserRoleId();

            var data = JsonConvert.DeserializeObject<FirmaElectronica>(json);
            await _db.SPExecute("Config.FirmaElectronica_Update");
            _db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("idFirmaElectronica", data.idFirmaElectronica);
            _db.AddDynamicParam("contrasenia", data.contrasenia);
            _db.AddDynamicParam("fechaCaducidad", data.fechaCaducidad);
            _db.AddDynamicParam("estado", data.estado);
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            log.LogActivity("Error on Update Firma Electronica: \n" + ex);
            _response.Create("0", "Error al Actualizar la firma electronica");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}

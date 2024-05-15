using Compras.API.Helpers;

namespace Compras.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DocumentoRecibidoController : ControllerBase
{
    private readonly DbAccess _db;
    private readonly FileTxt _txtComp;
    private readonly IConfiguration _configuration;
    private readonly IDocumentoRecibidoService _docRecibidoSvc;
    private readonly ICustomLogger _log;
    private readonly IDocumentoTempService _documentoTemp;

    public DocumentoRecibidoController(IConfiguration configuration, IDocumentoRecibidoService docRecibidoSvc,
        FileTxt txtComp, ICustomLogger log, IDocumentoTempService documentoTemp)
    {
        _configuration = configuration;
        _docRecibidoSvc = docRecibidoSvc;
        _txtComp = txtComp;
        _log = log;
        _documentoTemp = documentoTemp;
        _db = new DbAccess(_configuration);
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        return Ok(await _docRecibidoSvc.GetAsync(new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            }))
            ;
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var response = new ApiResponse();
        var ceXml = new ComprobanteElectronico();
        var sms = string.Empty;
        var getXmlSriData = new DataXmlComprobante();
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "id", id }
        };
        var xdoc = await _docRecibidoSvc.GetById(parameters);

        if (xdoc != null && getXmlSriData.GetData(xdoc, ref ceXml, ref sms))
        {
            if (ceXml.codDoc == "01" || ceXml.codDoc == "04")
            {
                var details = new Dictionary<string, object>
                {
                    { "userRoleId", User.GetUserRoleId() },
                    { "idDocumento", id },
                    { "jsonData", JsonConvert.SerializeObject(ceXml.detalles) },
                    { "impuestos", JsonConvert.SerializeObject(ceXml.impuestos) }
                };
                var rowsAffected = await _documentoTemp.AddAsync(details);
            }

            response.Create(code: "1", payload: ceXml);
        }

        return Ok(response);
    }


    [HttpPost("Read")]
    public async Task<IActionResult> Post(IFormFile file)
    {
        var _response = new ApiResponse();

        if (file.ContentType != "text/plain")
        {
            _response.Create("0", "Formato de archivo no soportado");
            return BadRequest(_response);
        }

        try
        {
            var path = _configuration.GetSection("ImportacionTxt").Value;
            FileData.SaveFile(path, file);
            var dt = new DataTable("Comprobantes");
            dt = await _txtComp.GetDocs(FileData.GetFileByte(file));
            if (!DataValidation.DataTableIsNull(dt))
            {
                await _db.SPExecute("Recepcion.Documento_Check_Existence");
                _db.AddDynamicParam("json", JsonConvert.SerializeObject(dt));
                var dtExistent = _db.GetDataTable();
                if (dtExistent.Columns.Contains("code") && dtExistent.Rows[0].Field<string>("code") == "-1")
                {
                    _response.Create("1", payload: DataConverters.DataTableToJSON(dt));
                }
                else
                {
                    if (dt.Rows.Count == dtExistent.Rows.Count)
                    {
                        _response.Create("0",
                            "Los registros que intenta importar ya se encuentran registrados, intente con otro archivo!");
                    }
                    else
                    {
                        var diff = (from row1 in dt.AsEnumerable()
                                    join row2 in dtExistent.AsEnumerable() on new { Column1 = row1["claveAcceso"] } equals new
                                    {
                                        Column1 = row2["claveAcceso"]
                                    } into gj
                                    from subRow2 in gj.DefaultIfEmpty()
                                    where subRow2 == null
                                    select row1).ToList();
                        var filteredDataTable = diff.CopyToDataTable();
                        _response.Create("1", payload: DataConverters.DataTableToJSON(filteredDataTable));
                    }
                }
            }
            else
            {
                _response.Create("0", "No se encontraron registros para importar");
            }
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al importar el archivo: " + ex);
            _response.Create("0", "Error al importar el archivo");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }


    [HttpPost("CheckExistenceXml")]
    public async Task<IActionResult> CheckExistenceXml(string claveAcceso)
    {
        var _sri = new WebServiceSri(_configuration);
        var response = await _sri.CheckExistence(claveAcceso,
            "https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl");
        return Ok(response);
    }


    [HttpPost("Post")]
    public async Task<IActionResult> Post(ApiRequest request)
    {
        request.UserRoleId = User.GetUserRoleId();
        return Ok(await _docRecibidoSvc.AddAsync(request));
    }

    [HttpPost("UploadXml")]
    public async Task<IActionResult> UploadXml(string json, IFormFile file)
    {
        if (file.ContentType != "text/xml")
        {
            return BadRequest("Formato de archivo no soportado");
        }

        var dataComprobante = new DataComprobante();
        await dataComprobante.Get(file);
        if (dataComprobante.XmlTosave == null)
        {
            return BadRequest("No se pudo obtener el xml");
        }

        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(json) },
            { "codDoc", dataComprobante.CodDoc },
            { "claveAcceso", dataComprobante.ClaveAcceso },
            { "versionComp", dataComprobante.VersionComp },
            { "fechaEmision", dataComprobante.FechaEmision },
            { "XmlDoc", dataComprobante.XmlTosave.OuterXml },
        };
        return Ok(await _docRecibidoSvc.UploadXmlAsync(parameters));
    }


    [HttpPut("Put/{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
    {
        data.UserRoleId = User.GetUserRoleId();
        return Ok(await _docRecibidoSvc.UpdateAsync(id, data));
    }


    [HttpGet("Preview/{id}")]
    public async Task<IActionResult> Preview(int id)
    {
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

            using (var _db = new DbAccess(_configuration))
            {
                var parameters = new Dictionary<string, object>();
                await _db.SPExecute("Recepcion.Documento_Get_Id");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("idDocumento", id);
                var dt = _db.GetDataTable();
                if (dt.Rows.Count > 0 && dt.Columns.Contains("xmlDoc"))
                {
                    _response.code = "1";
                    var xmlDoc = dt.Rows[0]["xmlDoc"].ToString();
                    var xdoc = new XmlDocument();
                    xdoc.LoadXml(xmlDoc);
                    var ceXml = new ComprobanteElectronico();
                    var sms = string.Empty;
                    var _getXmlSriData = new DataXmlComprobante();
                    if (!_getXmlSriData.GetData(xdoc, ref ceXml, ref sms))
                    {
                        _response.Create("0", sms);
                    }
                    else
                    {
                        _response.payload = DocumentoXmlToHtml.CreateHtml(ceXml);
                    }
                }
                else
                {
                    _response.Create("0", "No se encontro xml");
                }
            }
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error getting data of doc: " + ex);
            _response.Create("0", "Error al obtener los datos del comprobante");
        }

        return Ok(_response);
    }

    [HttpPut("Migrate")]
    public async Task<IActionResult> Migrate(ApiRequest parameters)
    {
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            await _db.SPExecute("Recepcion.Documento_Migrate");
            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
            _db.AddDynamicParam("json", DataConverters.SerializeDictionary(parameters.Data));
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al importar el archivo: " + ex);
            _response.Create("0", "Error al importar el archivo");
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
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "idDocumento", id }
        };
        return Ok(await _docRecibidoSvc.DeleteAsync(parameters));
    }
    [HttpGet("DownloadXml/{id}")]
    public async Task<IActionResult> Download(int id)
    {
        var parameters = new Dictionary<string, object> {
            {"userRoleId", User.GetUserRoleId()},
            {"id", id }
        };
        var response = await _docRecibidoSvc.DownloadAsync(parameters);
        if (response == null)
        {
            return BadRequest();
        }
        return File(response, "text/xml");
    }
    [HttpPut("PutSubcategory")]
    public async Task<IActionResult> PutSubcategory([FromBody] ApiRequest data)
    {
        data.UserRoleId = User.GetUserRoleId();
        return Ok(await _docRecibidoSvc.UpdateSubcategoryAsync(data));
    }
}

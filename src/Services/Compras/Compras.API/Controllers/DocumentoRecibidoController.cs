using Microsoft.AspNetCore.Authorization;

namespace Compras.API.Controllers;

public class DocumentoRecibidoController(
    IAdoRepository adoRepository,
    IConfiguration configuration,
    IDocumentoRecibidoRepository docRecibidoSvc,
    IDocumentConverter documentoXmlToHtml,
    IFileTextService fileTextService,
    IDocumentoTempRepository documentoTemp,
    IWebServiceSri webServiceSri,
    IXmlSriFileService xmlSriFileService)
    : BaseApiController
{

    private const string UserRoleClaimType = "userRoleId";

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await docRecibidoSvc.GetAsync(parameters));
    }

    [AllowAnonymous]
    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var response = new ApiResponse();
        var ceXml = new ComprobanteElectronico();
        var sms = string.Empty;
        var getXmlSriData = new DataXmlComprobante();
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        var xdoc = await docRecibidoSvc.GetById(parameters);

        if (xdoc == null || !getXmlSriData.GetData(xdoc, ref ceXml, ref sms)) return Ok(response);

        if (ceXml.codDoc is "01" or "04")
        {
            var details = new Dictionary<string, object>
            {
                { "userRoleId", User.GetClaimValue<int>("userRoleId") },
                { "idDocumento", id },
                { "jsonData", JsonConvert.SerializeObject(ceXml.detalles) },
                { "impuestos", JsonConvert.SerializeObject(ceXml.impuestos) }
            };
            await documentoTemp.AddAsync(details);
        }

        return Ok(ApiResponse.Success(payload: ceXml));
    }


    [HttpPost("Read")]
    public async Task<IActionResult> Post(IFormFile file)
    {
        var response = new ApiResponse();

        if (file.ContentType != "text/plain")
            return BadRequest(ApiResponse.Error("0", "Formato de archivo no soportado"));

        var dt = await fileTextService.GetDocsAsync(FileData.GetFileByte(file));
        if (!DataValidation.DataTableIsNull(dt))
        {
            var dsExistentDocument = await adoRepository.GetDataSetAsync("Recepcion.Documento_Check_Existence",
                new Dictionary<string, object> { { "json", JsonConvert.SerializeObject(dt) } }, withTableNames: false);

            var dtExistent = dsExistentDocument.Tables.Count > 0 ? dsExistentDocument.Tables[0] : new DataTable();
            if (DataValidation.DataTableIsNull(dt))
                return BadRequest(ApiResponse.Success(payload: DataConverters.DataTableToJson(dt)));

            if (dt.Rows.Count == dtExistent.Rows.Count)
            {
                response.Code = "0";
                response.Message =
                    "Los registros que intenta importar ya se encuentran registrados, intente con otro archivo!";
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
                response.Code = "1";
                response.Payload = DataConverters.DataTableToJson(filteredDataTable);
            }
        }
        else
        {
            response.Code = "0";
            response.Message = "No se encontraron registros para importar";
        }

        return Ok(response);
    }

    [HttpPost("CheckExistenceXml")]
    public async Task<IActionResult> CheckExistenceXml(string claveAcceso)
    {
        var response = await webServiceSri.CheckExistenceAsync(claveAcceso, configuration["UrlSriComprobantes"]);
        return Ok(response);
    }

    [HttpPost("UploadXml")]
    public async Task<IActionResult> UploadXml(string json, IFormFile file)
    {
        if (file.ContentType != "text/xml") return BadRequest("Formato de archivo no soportado");

        var dataComprobante = await xmlSriFileService.GetAsync(file);
        if (dataComprobante.XmlSri == null) return BadRequest("No se pudo obtener el xml");

        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(json) },
            { "codDoc", dataComprobante.CodDoc },
            { "claveAcceso", dataComprobante.ClaveAcceso },
            { "versionComp", dataComprobante.VersionComp },
            { "fechaEmision", dataComprobante.FechaEmision },
            { "XmlDoc", dataComprobante.XmlSri.OuterXml }
        };
        return Ok(await docRecibidoSvc.UploadXmlAsync(parameters));
    }

    // * Task: 735 - Migrate DocumentoRecibido from ApiRequest to DTO's
    [HttpPost("Post")]
    public async Task<IActionResult> Post(DocumentoRecibidoDto documentoRecibido)
    {
        var parameters = new Dictionary<string, object>
      {
        { UserRoleClaimType, User.GetClaimValue<int>(UserRoleClaimType) },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<DocumentoRecibidoDto>(documentoRecibido)) }
      };
        return Ok(await docRecibidoSvc.AddAsync(parameters));
    }

    // * Task: 735 - Migrate DocumentoRecibido from ApiRequest to DTO's
    [HttpPut("Put/{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] DocumentoRecibidoDto documentoRecibido)
    {
        var parameters = new Dictionary<string, object>
    {
      { UserRoleClaimType, User.GetClaimValue<int>(UserRoleClaimType) },
      { "idDocumento", id },
      { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<DocumentoRecibidoDto>(documentoRecibido)) }
    };
        return Ok(await docRecibidoSvc.UpdateAsync(parameters));
    }


    [HttpGet("Preview/{id}")]
    public async Task<IActionResult> Preview(int id)
    {
        var response = new ApiResponse();

        var ds = await adoRepository.GetDataSetAsync("Recepcion.Documento_Get_Id",
            new Dictionary<string, object> { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } },
            withTableNames: false);

        var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        if (dt.Rows.Count > 0 && dt.Columns.Contains("xmlDoc"))
        {
            response.Code = "1";
            var xmlDoc = dt.Rows[0]["xmlDoc"].ToString();
            var xdoc = new XmlDocument();
            if (xmlDoc != null) xdoc.LoadXml(xmlDoc);

            var ceXml = new ComprobanteElectronico();
            var sms = string.Empty;
            var getXmlSriData = new DataXmlComprobante();
            if (!getXmlSriData.GetData(xdoc, ref ceXml, ref sms))
            {
                response.Code = "0";
                response.Message = sms;
            }
            else
            {
                response.Payload = documentoXmlToHtml.CreateHtml(ceXml);
            }
        }
        else
        {
            response.Code = "0";
            response.Message = "No se encontro xml";
        }

        return Ok(response);
    }

    [HttpPut("Migrate")]
    public async Task<IActionResult> Migrate(DocumentoRecibidoMigrateDto data)
    {
        var parameters = new Dictionary<string, object>
    {
        { "idUsuarioRol", User.GetClaimValue<int>("userRoleId") },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<DocumentoRecibidoMigrateDto>(data)) }
    };
        return Ok(await docRecibidoSvc.MigrateAsync(parameters));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
    {
      { "userRoleId", User.GetClaimValue<int>("userRoleId") },
      { "idDocumento", id }
    };
        return Ok(await docRecibidoSvc.DeleteAsync(parameters));
    }

    [HttpGet("DownloadXml/{id}")]
    public async Task<IActionResult> Download(int id)
    {
        var parameters = new Dictionary<string, object>
    {
      { "userRoleId", User.GetClaimValue<int>("userRoleId") },
      { "id", id }
    };
        var response = await docRecibidoSvc.DownloadAsync(parameters);

        return File(response, "text/xml");
    }

    [HttpPut("PutSubcategory")]
    public async Task<IActionResult> PutSubcategory([FromBody] DocumentoRecibidoCategoria data)
    {
        var parameters = new Dictionary<string, object>
    {
      { UserRoleClaimType, User.GetClaimValue<int>(UserRoleClaimType) },
      { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<DocumentoRecibidoCategoria>(data)) }
    };
        return Ok(await docRecibidoSvc.UpdateSubcategoryAsync(parameters));
    }
}

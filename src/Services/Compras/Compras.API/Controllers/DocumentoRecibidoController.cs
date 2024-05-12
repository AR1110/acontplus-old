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

    public DocumentoRecibidoController(IConfiguration configuration, IDocumentoRecibidoService docRecibidoSvc,
        FileTxt txtComp, ICustomLogger log)
    {
        _configuration = configuration;
        _docRecibidoSvc = docRecibidoSvc;
        _txtComp = txtComp;
        _log = log;
        _db = new DbAccess(_configuration);
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        try
        {
            var response = await _docRecibidoSvc.GetAsync(new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            });
            if (response == null) { return NoContent(); }

            ;
            return Ok(new { code = "1", payload = response });
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al obtener los documentos recibidos: \n" + ex);
            return BadRequest("Error al obtener los documentos recibidos: " + ex.Message);
        }
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var ceXml = new ComprobanteElectronico();
            var sms = string.Empty;
            var _getXmlSriData = new DataXmlComprobante();
            var xdoc = new XmlDocument();

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

                    xdoc.LoadXml(xmlDoc);
                }
                else
                {
                    _response.Create("0", "No se encontro xml");
                }
            }

            using (var _db = new DbAccess(_configuration))
            {
                if (!_getXmlSriData.GetData(xdoc, ref ceXml, ref sms))
                {
                    _response.Create("0", sms);
                }
                else
                {
                    if (ceXml.codDoc == "01" || ceXml.codDoc == "04")
                    {
                        await _db.SPExecute("Recepcion.Doc_Detail_Temp_Insert_All");
                        _db.AddDynamicParam("idRol", idUsuarioRol);
                        _db.AddDynamicParam("idDocumento", id);
                        _db.AddDynamicParam("jsonData", JsonConvert.SerializeObject(ceXml.detalles));
                        _db.AddDynamicParam("impuestos", JsonConvert.SerializeObject(ceXml.impuestos));
                        var affectedRows = await _db.OnlyExecuteAsync(false);
                    }

                    _response.payload = ceXml;
                }
            }

            return Ok(_response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error getting data of doc: " + ex);
            return BadRequest(ex.Message);
        }
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
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

            var _sri = new WebServiceSri(_configuration);
            var response = await _sri.CheckExistence(claveAcceso,
                "https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl");
            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al verificar la clave acceso en el sri: " + ex);
            _response.Create("0", "Error al verificar la clave acceso en el sri");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }


    [HttpPost("Post")]
    public async Task<IActionResult> Post(ApiRequest request)
    {
        request.UserRoleId = User.GetUserRoleId();
        try
        {
            var response = await _docRecibidoSvc.AddAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al importar el archivo: " + ex);
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("UploadXml")]
    public async Task<IActionResult> UploadXml(string json, IFormFile file)
    {
        var _response = new ApiResponse();

        if (file.ContentType != "text/xml")
        {
            _response.Create("0", "Formato de archivo no soportado");
            return BadRequest(_response);
        }

        try
        {
            var xmlDocSri = new XDocument();

            using (var str = new MemoryStream())
            {
                await file.CopyToAsync(str);
                str.Position = 0;
                xmlDocSri = XDocument.Load(str);
            }

            //XmlDocument xmlDocSri = new XmlDocument();
            //using (MemoryStream ms = new MemoryStream())
            //{
            //    file.CopyTo(ms);
            //    xmlDocSri.LoadXml(Encoding.UTF8.GetString(ms.ToArray()));
            //}

            var docNew = new XmlDocument();

            using (var xmlReader = xmlDocSri.CreateReader())
            {
                docNew.Load(xmlReader);
            }

            var nodeAuth = docNew.GetElementsByTagName("autorizacion")[0];
            var nodeComp = nodeAuth.SelectSingleNode("comprobante");
            if (nodeComp != null)
            {
                var xmlComp = new XmlDocument();
                xmlComp.LoadXml(nodeComp.InnerText);

                var declarationsI = xmlComp.ChildNodes.OfType<XmlNode>()
                    .Where(x => x.NodeType == XmlNodeType.XmlDeclaration)
                    .ToList();
                declarationsI.ForEach(x => xmlComp.RemoveChild(x));


                var node = xmlComp.GetElementsByTagName("infoTributaria")[0];
                string versionComp = string.Empty,
                    codDoc = string.Empty,
                    claveAcceso = string.Empty,
                    fechaEmision = string.Empty;
                claveAcceso = node.SelectSingleNode("claveAcceso").InnerText;
                codDoc = node.SelectSingleNode("codDoc").InnerText;
                switch (codDoc)
                {
                    case "01":
                        versionComp = xmlComp.GetElementsByTagName("factura")[0].Attributes["version"].Value;
                        fechaEmision = xmlComp.GetElementsByTagName("infoFactura")[0].SelectSingleNode("fechaEmision")
                            .InnerText;
                        break;
                    case "03":
                        versionComp = xmlComp.GetElementsByTagName("liquidacionCompra")[0].Attributes["version"].Value;
                        fechaEmision = xmlComp.GetElementsByTagName("infoLiquidacionCompra")[0]
                            .SelectSingleNode("fechaEmision").InnerText;
                        break;
                    case "04":
                        versionComp = xmlComp.GetElementsByTagName("notaCredito")[0].Attributes["version"].Value;
                        fechaEmision = xmlComp.GetElementsByTagName("infoNotaCredito")[0]
                            .SelectSingleNode("fechaEmision").InnerText;
                        break;
                    case "05":
                        versionComp = xmlComp.GetElementsByTagName("notaDebito")[0].Attributes["version"].Value;
                        fechaEmision = xmlComp.GetElementsByTagName("infoNotaDebito")[0]
                            .SelectSingleNode("fechaEmision").InnerText;
                        break;
                    case "06":
                        versionComp = xmlComp.GetElementsByTagName("guiaRemision")[0].Attributes["version"].Value;
                        fechaEmision = xmlComp.GetElementsByTagName("infoGuiaRemision")[0]
                            .SelectSingleNode("fechaEmision").InnerText;
                        break;
                    case "07":
                        versionComp = xmlComp.GetElementsByTagName("comprobanteRetencion")[0].Attributes["version"]
                            .Value;
                        fechaEmision = xmlComp.GetElementsByTagName("infoCompRetencion")[0]
                            .SelectSingleNode("fechaEmision").InnerText;
                        break;
                }

                var xmlTosave = new XmlDocument();
                xmlTosave.LoadXml(nodeAuth.OuterXml);


                var declarations = xmlTosave.ChildNodes.OfType<XmlNode>()
                    .Where(x => x.NodeType == XmlNodeType.XmlDeclaration)
                    .ToList();

                declarations.ForEach(x => xmlTosave.RemoveChild(x));

                var root = xmlTosave.GetElementsByTagName("autorizacion")[0];

                root.SelectSingleNode("comprobante").InnerText = xmlComp.OuterXml;

                using (var db = new DbAccess(_configuration))
                {
                    await db.SPExecute("Recepcion.Documento_Upload_Xml");
                    db.AddDynamicParam("idUsuarioRol",
                        Convert.ToInt32(HttpContext.User.FindFirstValue("idUsuarioRol")));
                    db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                    db.AddDynamicParam("codDoc", codDoc);
                    db.AddDynamicParam("claveAcceso", claveAcceso);
                    db.AddDynamicParam("versionComp", versionComp);
                    db.AddDynamicParam("fechaEmision", fechaEmision);
                    db.AddDynamicParam("XmlDoc", xmlTosave.OuterXml);
                    _response = db.GetDefault();
                }

                return Ok(_response);
            }

            _response.Create("0", "Error al importar el archivo");
            return Ok(_response);
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al importar el archivo: " + ex);
            return BadRequest(ex.Message);
        }
    }


    [HttpPut("Put/{id}")]
    public async Task<IActionResult> Put(int id)
    {
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            await _db.SPExecute("Recepcion.Documento_Update");
            _db.AddDynamicParam("idRol", idUsuarioRol);
            _db.AddDynamicParam("idDocumento", id);
            _db.AddDynamicParam("tipo", 1);
            _db.AddDynamicParam("xmlDoc", "");
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al descargar el archivo xml: " + ex);
            _response.Create("0", "Error al descargar el archivo xml");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
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


    [HttpPut("{id}")]
    public async Task<IActionResult> Upload(int id, IFormFile file)
    {
        var _response = new ApiResponse();

        if (file.ContentType != "text/plain")
        {
            _response.Create("0", "Formato de archivo no soportado");
            return BadRequest(_response);
        }

        try
        {
            var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

            var xmlSri = Encoding.UTF8.GetString(FileData.GetFileByte(file));
            xmlSri = xmlSri.Replace("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>", "")
                .Replace("</xml>", ""); //DELETE UNNECESARY
            var xmlDocSri = new XmlDocument();
            xmlDocSri.LoadXml(xmlSri);
            var nodeAuth = xmlDocSri.GetElementsByTagName("autorizacion")[0];
            var nodeComp = nodeAuth.SelectSingleNode("comprobante");
            var xmlComp = new XmlDocument();
            xmlComp.LoadXml(nodeComp.InnerText);
            var node = xmlComp.GetElementsByTagName("infoTributaria")[0];
            var claveAccesoXml = node.SelectSingleNode("claveAcceso").InnerText;
            var codDoc = node.SelectSingleNode("codDoc").InnerText;
            await _db.SPExecute("Recepcion.Documento_Update");
            _db.AddDynamicParam("idRol", idUsuarioRol);
            _db.AddDynamicParam("idDocumento", id);
            _db.AddDynamicParam("tipo", 2);
            _db.AddDynamicParam("xmlDoc", xmlDocSri.OuterXml);
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
        var _response = new ApiResponse();

        try
        {
            var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            await _db.SPExecute("Recepcion.Documento_Delete");
            _db.AddDynamicParam("idRol", idUsuarioRol);
            _db.AddDynamicParam("idDocumento", id);
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al eliminar el archivo: " + ex);
            _response.Create("0", "Error al eliminar el archivo");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    //[HttpGet("Export/{id}")]
    //public async Task<IActionResult> Export(int id)
    //{
    //   
    //    ComprobanteElectronico ceXml = new ComprobanteElectronico();

    //    ApiResponse _response = new ApiResponse();
    //    try
    //    {
    //        int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
    //        DbAccess _db = new DbAccess(_configuration);
    //        Dictionary<string, object> parameters = new Dictionary<string, object>();
    //        await _db.SPExecute("Recepcion.Documento_Get_Id");
    //        _db.AddDynamicParam("idRol", idUsuarioRol);
    //        _db.AddDynamicParam("idDocumento", id);
    //        DataTable dt = _db.GetDataTable();

    //        if (dt.Rows.Count > 0 && dt.Columns.Contains("xmlDoc"))
    //        {
    //            _response.code = "1";
    //            string xmlDoc = dt.Rows[0]["xmlDoc"].ToString();
    //            XmlDocument xdoc = new XmlDocument();
    //            xdoc.LoadXml(xmlDoc);
    //            string sms = string.Empty;
    //            DataXmlComprobante _getXmlSriData = new DataXmlComprobante();
    //            if (!_getXmlSriData.GetData(xdoc, ref ceXml, ref sms))
    //            {
    //                _response.Create("0", sms);
    //            }
    //            else
    //            {
    //                //_response.payload = DocumentoXmlToHtml.CreateHtml(ceXml);
    //            }
    //        }
    //        else
    //        {
    //            _response.Create(code: "0", message: "No se encontro xml");
    //        }
    //        return File(new DocElectPdf().PdfData(ceXml), "application/pdf", "Factura_" + ceXml.infoTributaria.estab + "-" + ceXml.infoTributaria.ptoEmi + "-" + ceXml.infoTributaria.secuencial + ".pdf");
    //    }
    //    catch (Exception ex)
    //    {
    //        _logs.LogError("Error getting data of doc: " + ex.ToString());
    //        //return BadRequest(Response.StatusCode);
    //        return File(new DocElectPdf().PdfData(ceXml), "application/pdf", "report.pdf");

    //    }
    //}
}

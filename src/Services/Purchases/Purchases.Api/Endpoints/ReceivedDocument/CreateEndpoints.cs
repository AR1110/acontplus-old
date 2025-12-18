namespace Purchases.Api.Endpoints.ReceivedDocument;

public static class CreateEndpoints
{
  public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
  {
    var group = app.MapGroup("/api/received-documents")
        .RequireAuthorization()
        .WithDescription("Endpoints for creating received documents.")
        .WithTags("Received Documents");

    group.MapPost("/", async (
        DocumentoRecibidoDto documentoRecibido,
        IReceivedDocumentService receivedDocumentService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<DocumentoRecibidoDto>(documentoRecibido)) }
        };
      return Results.Ok(await receivedDocumentService.AddAsync(parameters));
    })
        .WithName("CreateReceivedDocument")
        .WithSummary("Create a new received document")
        .WithDescription("Create a new received document record.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

    group.MapPost("/read", async (
        HttpContext httpContext,
        IFileTextService fileTextService,
        IAdoRepository adoRepository,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var response = new SpResponse { Code = string.Empty };
      var form = await httpContext.Request.ReadFormAsync(cancellationToken);
      var file = form.Files.FirstOrDefault();

      if (file == null || file.ContentType != "text/plain")
        return Results.BadRequest(new SpResponse { Code = "0", Message = "Formato de archivo no soportado" });

      var dt = await fileTextService.GetDocsAsync(FileData.GetFileByte(file));
      if (!DataValidation.DataTableIsNull(dt))
      {
        var dsExistentDocument = await adoRepository.GetDataSetAsync("Recepcion.Documento_Check_Existence",
                new Dictionary<string, object> { { "json", JsonExtensions.SerializeOptimized(dt) } });

        var dtExistent = dsExistentDocument.Tables.Count > 0 ? dsExistentDocument.Tables[0] : new DataTable();
        if (DataValidation.DataTableIsNull(dt))
          return Results.BadRequest(new SpResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) });

        if (dt.Rows.Count == dtExistent.Rows.Count)
        {
          response.Code = "0";
          response.Message = "Los registros que intenta importar ya se encuentran registrados, intente con otro archivo!";
        }
        else
        {
          var diff = (from row1 in dt.AsEnumerable()
                      join row2 in dtExistent.AsEnumerable() on new { Column1 = row1["claveAcceso"] } equals new { Column1 = row2["claveAcceso"] } into gj
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

      return Results.Ok(response);
    })
        .DisableAntiforgery()
        .WithName("ReadReceivedDocumentsFile")
        .WithSummary("Read and import received documents from file")
        .WithDescription("Upload and process a text file containing received documents.")
        .Produces<SpResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

    group.MapPost("/check-existence-xml", async (
        string claveAcceso,
        IWebServiceSri webServiceSri,
        IConfiguration configuration,
        CancellationToken cancellationToken) =>
    {
      var response = await webServiceSri.CheckExistenceAsync(claveAcceso, configuration["UrlSriComprobantes"] ?? string.Empty);
      return Results.Ok(response);
    })
        .WithName("CheckReceivedDocumentXmlExistence")
        .WithSummary("Check if XML exists in SRI")
        .WithDescription("Verify if a document exists in the SRI web service.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

    group.MapPost("/upload-xml", async (
        HttpContext httpContext,
        IReceivedDocumentService receivedDocumentService,
        IXmlSriFileService xmlSriFileService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var form = await httpContext.Request.ReadFormAsync(cancellationToken);
      var file = form.Files.FirstOrDefault();
      var json = form["json"].ToString();

      if (file == null || file.ContentType != "text/xml")
        return Results.BadRequest("Formato de archivo no soportado");

      var dataComprobante = await xmlSriFileService.GetAsync(file);
      if (dataComprobante?.XmlSri == null)
        return Results.BadRequest("No se pudo obtener el xml");

      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(json) },
                { "codDoc", dataComprobante.CodDoc ?? string.Empty },
                { "claveAcceso", dataComprobante.ClaveAcceso ?? string.Empty },
                { "versionComp", dataComprobante.VersionComp ?? string.Empty },
                { "fechaEmision", dataComprobante.FechaEmision ?? string.Empty },
                { "XmlDoc", dataComprobante.XmlSri.OuterXml }
        };
      return Results.Ok(await receivedDocumentService.UploadXmlAsync(parameters));
    })
        .DisableAntiforgery()
        .WithName("UploadReceivedDocumentXml")
        .WithSummary("Upload XML document")
        .WithDescription("Upload an XML file for a received document.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status500InternalServerError);
  }
}

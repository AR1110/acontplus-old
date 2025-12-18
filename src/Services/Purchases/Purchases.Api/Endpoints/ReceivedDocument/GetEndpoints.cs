namespace Purchases.Api.Endpoints.ReceivedDocument;

public static class GetEndpoints
{
  public static void MapGetEndpoints(this IEndpointRouteBuilder app)
  {
    var group = app.MapGroup("/api/received-documents")
        .RequireAuthorization()
        .WithDescription("Endpoints for retrieving received documents.")
        .WithTags("Received Documents");

    group.MapGet("/", async (
        string json,
        IDocumentoRecibidoRepository docRecibidoRepository,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(json) }
        };
      return Results.Ok(await docRecibidoRepository.GetAsync(parameters));
    })
        .WithName("GetReceivedDocuments")
        .WithSummary("Get all received documents")
        .WithDescription("Retrieve a list of received documents.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

    group.MapGet("/{id:int}", async (
        int id,
        IDocumentoRecibidoRepository docRecibidoRepository,
        IDocumentoTempRepository documentoTemp,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var response = new SpResponse { Code = string.Empty };
      var ceXml = new ComprobanteElectronico();
      var sms = string.Empty;
      var getXmlSriData = new DataXmlComprobante();
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "id", id }
        };
      var xdoc = await docRecibidoRepository.GetById(parameters);

      if (xdoc == null || !getXmlSriData.GetData(xdoc, ref ceXml, ref sms))
        return Results.Ok(response);

      if (ceXml.CodDoc is "01" or "04")
      {
        var details = new Dictionary<string, object>
            {
                    { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                    { "idDocumento", id },
                    { "jsonData", JsonExtensions.SerializeOptimized(ceXml.Detalles) },
                    { "impuestos", JsonExtensions.SerializeOptimized(ceXml.Impuestos) }
            };
        await documentoTemp.AddAsync(details);
      }

      return Results.Ok(new SpResponse { Code = "1", Payload = ceXml });
    })
        .AllowAnonymous()
        .WithName("GetReceivedDocumentById")
        .WithSummary("Get a received document by ID")
        .WithDescription("Retrieve a received document record by its ID.")
        .Produces<SpResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

    group.MapGet("/preview/{id:int}", async (
        int id,
        IDocumentoRecibidoRepository docRecibidoRepository,
        IAdoRepository adoRepository,
        IDocumentConverter documentoXmlToHtml,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var response = new SpResponse { Code = string.Empty };

      var ds = await adoRepository.GetDataSetAsync("Recepcion.Documento_Get_Id",
          new Dictionary<string, object>
          {
                    { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                    { "id", id }
          });

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

      return Results.Ok(response);
    })
        .WithName("PreviewReceivedDocument")
        .WithSummary("Preview a received document")
        .WithDescription("Get HTML preview of a received document.")
        .Produces<SpResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

    group.MapGet("/download/{id:int}", async (
        int id,
        IDocumentoRecibidoRepository docRecibidoRepository,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "id", id }
        };
      var response = await docRecibidoRepository.DownloadAsync(parameters);
      return Results.File(response, "text/xml");
    })
        .WithName("DownloadReceivedDocumentXml")
        .WithSummary("Download received document XML")
        .WithDescription("Download the XML file of a received document.")
            .Produces(StatusCodes.Status200OK, contentType: "text/xml").ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
  }
}

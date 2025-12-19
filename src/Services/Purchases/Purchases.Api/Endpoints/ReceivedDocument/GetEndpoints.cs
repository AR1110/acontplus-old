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
            PaginationQuery paginationQuery,
            IReceivedDocumentService receivedDocumentService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            var paginationRequest = paginationQuery.Adapt<PaginationRequest>() with
            {
                SortDirection = paginationQuery.SortDirection ?? SortDirection.Desc
            };

            paginationRequest = paginationRequest.WithFilter("userRoleId", userRoleId);

            return await receivedDocumentService
                .GetAsync(paginationRequest, cancellationToken)
                .ToGetMinimalApiResultAsync();
        })
            .WithName("GetReceivedDocuments")
            .WithSummary("Get all received documents")
            .WithDescription("Retrieve a list of received documents.")
            .Produces<ReceivedDocumentItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:int}", async (
            int id,
            IReceivedDocumentService receivedDocumentService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            return await receivedDocumentService
                .GetByIdAsync(id, userRoleId, cancellationToken)
                .ToGetMinimalApiResultAsync();
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
            IReceivedDocumentService receivedDocumentService,
            IAdoRepository adoRepository,
            IDocumentConverter documentXmlToHtml,
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
                response.Code = "0";
                var xmlDoc = dt.Rows[0]["xmlDoc"].ToString();
                var xdoc = new XmlDocument();
                if (xmlDoc != null) xdoc.LoadXml(xmlDoc);

                var ceXml = new ComprobanteElectronico();
                var sms = string.Empty;
                var getXmlSriData = new DataXmlComprobante();
                if (!getXmlSriData.GetData(xdoc, ref ceXml, ref sms))
                {
                    response.Code = "XML_PARSE_ERROR";
                    response.Message = sms;
                }
                else
                {
                    response.Payload = documentXmlToHtml.CreateHtml(ceXml);
                }
            }
            else
            {
                response.Code = "XML_NOT_FOUND";
                response.Message = "No se encontró xml";
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
            IReceivedDocumentService receivedDocumentService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            return await receivedDocumentService
          .DownloadAsync(id, userRoleId, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("DownloadReceivedDocumentXml")
            .WithSummary("Download received document XML")
            .WithDescription("Download the XML file of a received document.")
                .Produces(StatusCodes.Status200OK, contentType: "text/xml").ProducesProblem(StatusCodes.Status404NotFound)
                .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}



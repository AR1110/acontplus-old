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
            ReceivedDocumentCreate request,
            IReceivedDocumentService receivedDocumentService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            var requestWithUserRole = request with { UserRoleId = userRoleId };

            return await receivedDocumentService
                .AddAsync(requestWithUserRole, cancellationToken)
                .ToMinimalApiResultAsync();
        })
            .WithName("CreateReceivedDocument")
            .WithSummary("Create a new received document")
            .WithDescription("Create a new received document record.")
            .Produces<bool>(StatusCodes.Status200OK)
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
                return Results.BadRequest(new SpResponse { Code = "UNSUPPORTED_FILE_FORMAT", Message = "Formato de archivo no soportado" });

            var dt = await fileTextService.GetDocsAsync(FileData.GetFileByte(file));
            if (!DataValidation.DataTableIsNull(dt))
            {
                var dsExistentDocument = await adoRepository.GetDataSetAsync("Recepcion.Documento_Check_Existence",
                    new Dictionary<string, object> { { "json", JsonExtensions.SerializeOptimized(dt) } });

                var dtExistent = dsExistentDocument.Tables.Count > 0 ? dsExistentDocument.Tables[0] : new DataTable();
                if (DataValidation.DataTableIsNull(dt))
                    return Results.BadRequest(new SpResponse { Code = "INVALID_DATA", Message = "Los datos proporcionados no son válidos", Payload = DataConverters.DataTableToJson(dt) });

                if (dt.Rows.Count == dtExistent.Rows.Count)
                {
                    response.Code = "DOCUMENTS_ALREADY_REGISTERED";
                    response.Message = "Los registros que intenta importar ya se encuentran registrados, intente con otro archivo!";
                }
                else
                {
                    var diff = (from row1 in dt.AsEnumerable()
                                join row2 in dtExistent.AsEnumerable() on new { Column1 = row1["accessKey"] } equals new { Column1 = row2["accessKey"] } into gj
                                from subRow2 in gj.DefaultIfEmpty()
                                where subRow2 == null
                                select row1).ToList();
                    var filteredDataTable = diff.CopyToDataTable();
                    response.Code = "0";
                    response.Payload = DataConverters.DataTableToJson(filteredDataTable);
                }
            }
            else
            {
                response.Code = "NO_RECORDS_TO_IMPORT";
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
            string accessKey,
            IWebServiceSri webServiceSri,
            IConfiguration configuration,
            CancellationToken cancellationToken) =>
        {
            var response = await webServiceSri.CheckExistenceAsync(accessKey, configuration["UrlSriComprobantes"] ?? string.Empty);
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
            int establishmentId,
            int subcategoryId,
            CancellationToken cancellationToken) =>
        {
            var form = await httpContext.Request.ReadFormAsync(cancellationToken);
            var file = form.Files.FirstOrDefault();

            if (file == null || file.ContentType != "text/xml")
                return Results.BadRequest(new SpResponse { Code = "UNSUPPORTED_FILE_FORMAT", Message = "Formato de archivo no soportado" });

            var dataComprobante = await xmlSriFileService.GetAsync(file);
            if (dataComprobante?.XmlSri == null)
                return Results.BadRequest(new SpResponse { Code = "XML_RETRIEVAL_ERROR", Message = "No se pudo obtener el xml" });

            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            var xmlContent = dataComprobante.XmlSri.OuterXml;
            var accessKey = dataComprobante.ClaveAcceso ?? string.Empty;

            if (string.IsNullOrEmpty(accessKey))
                return Results.BadRequest(new SpResponse { Code = "ACCESS_KEY_NOT_FOUND", Message = "No se pudo obtener la clave de acceso del XML" });

            return await receivedDocumentService
                .UploadXmlAsync(xmlContent, accessKey, establishmentId, subcategoryId, userRoleId, cancellationToken)
                .ToMinimalApiResultAsync();
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

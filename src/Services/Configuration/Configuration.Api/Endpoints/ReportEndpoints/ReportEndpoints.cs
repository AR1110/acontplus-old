namespace Configuration.Api.Endpoints.ReportEndpoints;

public static class ReportEndpoints
{
    public static void MapReportEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/reports")
            .RequireAuthorization()
            .WithTags("Reports");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (IReportService reportService, CancellationToken cancellationToken) =>
                {
                    return await reportService.GetAllAsync(cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetAllReports")
            .WithSummary("Get all reports")
            .WithDescription("Retrieves all reports")
            .Produces<dynamic>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (ReportCreate request, IReportService reportService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    request.CreatedByUserId = userContext.GetUserId();
                    return await reportService.AddAsync(request, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("CreateReport")
            .WithSummary("Create a new report")
            .WithDescription("Creates a new Report resource.")
            .Produces<dynamic>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, ReportUpdate request, IReportService reportService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    request.UpdatedByUserId = userContext.GetUserId();
                    return await reportService.UpdateAsync(id, request, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("UpdateReport")
            .WithSummary("Update a report")
            .WithDescription("Updates an existing Report resource.")
            .Produces<dynamic>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, IReportService reportService, CancellationToken cancellationToken) =>
                {
                    return await reportService.DeleteAsync(id, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeleteReport")
            .WithSummary("Delete a report")
            .WithDescription("Deletes a Report resource.")
            .Produces<bool>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }
}

namespace Configuration.Api.Endpoints.ScheduleCompanyEndpoints;

public static class ScheduleCompanyEndpoints
{
    public static void MapScheduleCompanyEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/schedule-companies")
            .RequireAuthorization()
            .WithTags("Schedule Companies");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/company/{companyId:int}",
                async (int companyId, IScheduleCompanyService scheduleCompanyService, CancellationToken cancellationToken) =>
                {
                    return await scheduleCompanyService.GetByCompanyIdAsync(companyId).ToGetMinimalApiResultAsync();
                })
            .WithName("GetScheduleCompaniesByCompanyId")
            .WithSummary("Get schedule companies by company ID")
            .WithDescription("Retrieves all schedule companies for a specific company")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (ScheduleCompanyItem scheduleCompanyItem, IScheduleCompanyService scheduleCompanyService) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "userId", 0 },
                        { "json", DataConverters.SerializeObjectCustom<ScheduleCompanyItem>(scheduleCompanyItem) }
                    };
                    return await scheduleCompanyService.AddAsync(parameters).ToMinimalApiResultAsync();
                })
            .WithName("CreateScheduleCompany")
            .WithSummary("Create schedule company")
            .WithDescription("Creates a new schedule company")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, ScheduleCompany data, IScheduleCompanyService scheduleCompanyService, IUserContext userContext) =>
                {
                    data.UpdatedByUserId = userContext.GetUserId();
                    return await scheduleCompanyService.UpdateAsync(id, data).ToMinimalApiResultAsync();
                })
            .WithName("UpdateScheduleCompany")
            .WithSummary("Update schedule company")
            .WithDescription("Updates an existing schedule company by id")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, IScheduleCompanyService scheduleCompanyService) =>
                {
                    return await scheduleCompanyService.DeleteAsync(id).ToMinimalApiResultAsync();
                })
            .WithName("DeleteScheduleCompany")
            .WithSummary("Delete schedule company")
            .WithDescription("Deletes a schedule company by id")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}

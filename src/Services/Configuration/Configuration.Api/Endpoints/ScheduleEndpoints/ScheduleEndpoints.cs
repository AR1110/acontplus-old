namespace Configuration.Api.Endpoints.ScheduleEndpoints;

public static class ScheduleEndpoints
{
    public static void MapScheduleEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/schedules")
            .RequireAuthorization()
            .WithTags("Schedules");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (IScheduleService scheduleService, CancellationToken cancellationToken) =>
                {
                    return await scheduleService.GetAllAsync(cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetSchedules")
            .WithSummary("Get schedules")
            .WithDescription("Retrieves all schedules")
            .Produces<IReadOnlyList<ScheduleItem>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (ScheduleCreate request, IScheduleService scheduleService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    return await scheduleService.AddAsync(request, userContext.GetUserId(), cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("CreateSchedule")
            .WithSummary("Create a schedule")
            .WithDescription("Creates a new schedule")
            .Produces<ScheduleItem>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status400BadRequest);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, ScheduleUpdate request, IScheduleService scheduleService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    return await scheduleService.UpdateAsync(id, request, userContext.GetUserId(), cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("UpdateSchedule")
            .WithSummary("Update a schedule")
            .WithDescription("Updates an existing schedule")
            .Produces<ScheduleItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, IScheduleService scheduleService) =>
                {
                    return await scheduleService.DeleteAsync(id).ToMinimalApiResultAsync();
                })
            .WithName("DeleteSchedule")
            .WithSummary("Delete a schedule")
            .WithDescription("Deletes a schedule by ID")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }
}

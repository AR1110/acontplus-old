namespace BarberShop.Api.Endpoints.WorkSessions;

public static class RegisterWorkSessionEndpoints
{
    public static void MapWorkSessionEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/work-sessions")
            .RequireAuthorization()

            .WithDescription("Endpoints for managing work sessions.")
            .WithTags("WorkSessions");

        group.MapGet("/", async (
                PaginationQuery paginationQuery,
                IWorkSessionService workSessionService,
                CancellationToken cancellationToken) =>
            {
                var paginationRequest = paginationQuery.Adapt<PaginationRequest>();

                var result = await workSessionService.GetWorkSessionAsync(paginationRequest);
                return Results.Ok(ApiResponse<PagedResult<WorkSessionDto>>.Success(result));
            })
            .WithName("GetWorkSessions")
            .WithSummary("Get work sessions")
            .WithDescription("Retrieve a paginated list of work sessions.")
            .Produces<ApiResponse<PagedResult<WorkSessionDto>>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:int}", async (
                int id,
                IWorkSessionService workSessionService,
                CancellationToken cancellationToken) =>
            {
                var response = await workSessionService.GetWorkSessionByIdAsync(id);
                return response.Code == "0"
                    ? Results.NotFound(response.Message)
                    : Results.Ok(response);
            })
            .WithName("GetWorkSessionById")
            .WithSummary("Get work session by id")
            .WithDescription("Retrieve a work session by its id.")
            .Produces<SpResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPost("/", async (
                WorkSessionDto workSessionDto,
                IWorkSessionService workSessionService,
                IUserContext userContext,
                CancellationToken cancellationToken) =>
            {
                workSessionDto.CreatedByUserId = userContext.GetUserId();
                return Results.Ok(await workSessionService.CreateWorkSessionAsync(workSessionDto));
            })
            .WithName("CreateWorkSession")
            .WithSummary("Create work session")
            .WithDescription("Create a new work session.")
            .Produces<SpResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPut("/{id:int}", async (
                int id,
                WorkSessionDto workSessionDto,
                IWorkSessionService workSessionService,
                IUserContext userContext,
                CancellationToken cancellationToken) =>
            {
                workSessionDto.UpdatedByUserId = userContext.GetUserId();
                return Results.Ok(await workSessionService.UpdateWorkSessionAsync(id, workSessionDto));
            })
            .WithName("UpdateWorkSession")
            .WithSummary("Update work session")
            .WithDescription("Update an existing work session.")
            .Produces<SpResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapDelete("/{id:int}", async (
                int id,
                IWorkSessionService workSessionService,
                CancellationToken cancellationToken) =>
            {
                var response = await workSessionService.DeleteWorkSessionAsync(id);
                return response.Code == "0"
                    ? Results.NotFound(response.Message)
                    : Results.Ok(response);
            })
            .WithName("DeleteWorkSession")
            .WithSummary("Delete work session")
            .WithDescription("Delete a work session by id.")
            .Produces<SpResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}

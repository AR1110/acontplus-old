namespace BarberShop.Api.Endpoints.Seats;

public static class RegisterSeatEndpoints
{
    public static void MapSeatEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/seats")
            .RequireAuthorization()

            .WithDescription("Endpoints for managing seats.")
            .WithTags("Seats");

        group.MapGet("/", async (
            PaginationQuery paginationQuery,
            ISeatService seatService,
            CancellationToken cancellationToken) =>
          {
              var paginationRequest = paginationQuery.Adapt<PaginationRequest>();

              var result = await seatService.GetSeatsAsync(paginationRequest);
              return Results.Ok(ApiResponse<PagedResult<SeatDto>>.Success(result));
          })
            .WithName("GetSeats")
            .WithSummary("Get seats")
            .WithDescription("Retrieve a paginated list of seats.")
            .Produces<ApiResponse<PagedResult<SeatDto>>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:int}", async (
                int id,
                ISeatService seatService,
                CancellationToken cancellationToken) =>
            {
                var response = await seatService.GetSeatByIdAsync(id);
                return response.Code == "0"
                    ? Results.NotFound(response.Message)
                    : Results.Ok(response);
            })
            .WithName("GetSeatById")
            .WithSummary("Get seat by id")
            .WithDescription("Retrieve a seat by its id.")
            .Produces<SpResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPost("/", async (
                SeatDto seatDto,
                ISeatService seatService,
                IUserContext userContext,
                CancellationToken cancellationToken) =>
            {
                seatDto.CreatedByUserId = userContext.GetUserId();
                return Results.Ok(await seatService.CreateSeatAsync(seatDto));
            })
            .WithName("CreateSeat")
            .WithSummary("Create seat")
            .WithDescription("Create a new seat.")
            .Produces<SpResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPut("/{id:int}", async (
                int id,
                SeatDto seatDto,
                ISeatService seatService,
                IUserContext userContext,
                CancellationToken cancellationToken) =>
            {
                seatDto.UpdatedByUserId = userContext.GetUserId();
                return Results.Ok(await seatService.UpdateSeatAsync(id, seatDto));
            })
            .WithName("UpdateSeat")
            .WithSummary("Update seat")
            .WithDescription("Update an existing seat.")
            .Produces<SpResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapDelete("/{id:int}", async (
                int id,
                ISeatService seatService,
                CancellationToken cancellationToken) =>
            {
                return Results.Ok(await seatService.DeleteSeatAsync(id));
            })
            .WithName("DeleteSeat")
            .WithSummary("Delete seat")
            .WithDescription("Delete a seat by id.")
            .Produces<SpResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}

namespace BarberShop.Api.Endpoints.Tickets;

public static class RegisterTicketEndpoints
{
  public static void MapTicketEndpoints(this IEndpointRouteBuilder app)
  {
    var group = app.MapGroup("/api/tickets")
        .RequireAuthorization()

        .WithDescription("Endpoints for managing tickets.")
        .WithTags("Tickets");

    group.MapGet("/", async (
        PaginationQuery paginationQuery,
        ITicketService ticketService,
        CancellationToken cancellationToken) =>
      {
        var paginationRequest = paginationQuery.Adapt<PaginationRequest>();

        var result = await ticketService.GetTicketsAsync(paginationRequest);
        return Results.Ok(ApiResponse<PagedResult<TicketDto>>.Success(result));
      })
        .WithName("GetTickets")
        .WithSummary("Get tickets")
        .WithDescription("Retrieve a paginated list of tickets.")
        .Produces<ApiResponse<PagedResult<TicketDto>>>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

    group.MapGet("/{id:int}", async (
            int id,
            ITicketService ticketService,
            CancellationToken cancellationToken) =>
        {
          var response = await ticketService.GetTicketByIdAsync(id);
          return response.Code == "0"
                  ? Results.NotFound(response.Message ?? "Ticket not found")
                  : Results.Ok(response);
        })
        .WithName("GetTicketById")
        .WithSummary("Get ticket by id")
        .WithDescription("Retrieve a ticket by its id.")
        .Produces<SpResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

    group.MapPost("/", async (
            TicketDto ticketDto,
            ITicketService ticketService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
          ticketDto.CreatedByUserId = userContext.GetUserId();
          return Results.Ok(await ticketService.CreateTicketAsync(ticketDto));
        })
        .WithName("CreateTicket")
        .WithSummary("Create ticket")
        .WithDescription("Create a new ticket.")
        .Produces<SpResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

    group.MapPut("/{id:int}", async (
            int id,
            TicketDto ticketDto,
            ITicketService ticketService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
          ticketDto.UpdatedByUserId = userContext.GetUserId();
          return Results.Ok(await ticketService.UpdateTicketAsync(id, ticketDto));
        })
        .WithName("UpdateTicket")
        .WithSummary("Update ticket")
        .WithDescription("Update an existing ticket.")
        .Produces<SpResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

    group.MapDelete("/{id:int}", async (
            int id,
            ITicketService ticketService,
            CancellationToken cancellationToken) =>
        {
          return Results.Ok(await ticketService.DeleteTicketAsync(id));
        })
        .WithName("DeleteTicket")
        .WithSummary("Delete ticket")
        .WithDescription("Delete a ticket by id.")
        .Produces<SpResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);
  }
}

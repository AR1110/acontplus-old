using Microsoft.AspNetCore.Mvc;

namespace BarberShop.Api.Extensions.Endpoints;

public static class TicketEndpointsExtensions
{
    public static IEndpointRouteBuilder MapTicketEndpoints(this IEndpointRouteBuilder builder)
    {
        // Seat Endpoints Group
        var seatGroup = builder.MapGroup("/api/seats")
            .RequireAuthorization() // Requires authentication for these endpoints
                      // Enables OpenAPI/Swagger documentation for these endpoints
            .WithTags("Seats");     // Groups these endpoints under the "Seats" tag in Swagger UI

        // GET all seats with pagination
        seatGroup.MapGet("/",
            async (ISeatEndpoints seatEndpoints, [FromQuery] int pageIndex, [FromQuery] int pageSize) =>
            {
                var paginationDto = new PaginationRequest { PageIndex = pageIndex, PageSize = pageSize };
                return await seatEndpoints.GetSeatsAsync(paginationDto);
            })
            .WithDescription("Retrieves a paginated list of all available seats.");

        // GET seat by ID
        seatGroup.MapGet("/{id:int}",
            async (ISeatEndpoints seatEndpoints, int id) =>
                await seatEndpoints.GetSeatByIdAsync(id))
            .WithDescription("Retrieves a specific seat by its ID.");

        // POST (Create) a new seat
        seatGroup.MapPost("/",
            async (ISeatEndpoints seatEndpoints, SeatDto seatDto) =>
                await seatEndpoints.CreateSeatAsync(seatDto))
            .WithDescription("Creates a new seat.")
            .WithName("CreateSeat");

        // PUT (Update) an existing seat
        seatGroup.MapPut("/{id:int}",
            async (ISeatEndpoints seatEndpoints, int id, SeatDto seatDto) =>
                await seatEndpoints.UpdateSeatAsync(id, seatDto))
            .WithDescription("Updates an existing seat by ID.");

        // DELETE a seat by ID
        seatGroup.MapDelete("/{id:int}",
            async (ISeatEndpoints seatEndpoints, int id) =>
                await seatEndpoints.DeleteSeatAsync(id))
            .WithDescription("Deletes a seat by its ID.");

        // Work Session Endpoints Group
        var workSessionGroup = builder.MapGroup("/api/work-sessions")
            .RequireAuthorization()
            
            .WithTags("WorkSessions");

        // GET all work sessions with pagination
        workSessionGroup.MapGet("/",
            async (IWorkSessionEndpoints workSessionEndpoints, [FromQuery] int pageIndex, [FromQuery] int pageSize) =>
            {
                var paginationDto = new PaginationRequest { PageIndex = pageIndex, PageSize = pageSize };
                return await workSessionEndpoints.GetWorkSessionsAsync(paginationDto);
            })
            .WithDescription("Retrieves a paginated list of all work sessions.");

        // GET work session by ID
        workSessionGroup.MapGet("/{id:int}",
            async (IWorkSessionEndpoints workSessionEndpoints, int id) =>
                await workSessionEndpoints.GetWorkSessionByIdAsync(id))
            .WithDescription("Retrieves a specific work session by its ID.");

        // POST (Create) a new work session
        workSessionGroup.MapPost("/",
            async (IWorkSessionEndpoints workSessionEndpoints, WorkSessionDto workSessionDto) =>
                await workSessionEndpoints.CreateWorkSessionAsync(workSessionDto))
            .WithDescription("Creates a new work session.")
            .WithName("CreateWorkSession");

        // PUT (Update) an existing work session
        workSessionGroup.MapPut("/{id:int}",
            async (IWorkSessionEndpoints workSessionEndpoints, int id, WorkSessionDto workSessionDto) =>
                await workSessionEndpoints.UpdateWorkSessionAsync(id, workSessionDto))
            .WithDescription("Updates an existing work session by ID.");

        // DELETE a work session by ID
        workSessionGroup.MapDelete("/{id:int}",
            async (IWorkSessionEndpoints workSessionEndpoints, int id) =>
                await workSessionEndpoints.DeleteWorkSessionAsync(id))
            .WithDescription("Deletes a work session by its ID.");

        var ticketGroup = builder.MapGroup("/api/tickets")
            .RequireAuthorization()
            
            .WithTags("Tickets");

        // GET all tickets with pagination
        ticketGroup.MapGet("/",
            async (ITicketEndpoints ticketEndpoints, [FromQuery] int pageIndex, [FromQuery] int pageSize) =>
            {
                var paginationDto = new PaginationRequest { PageIndex = pageIndex, PageSize = pageSize };
                return await ticketEndpoints.GetTicketsAsync(paginationDto);
            })
            .WithDescription("Retrieves a paginated list of all tickets.");

        // GET ticket by ID
        ticketGroup.MapGet("/{id:int}",
            async (ITicketEndpoints ticketEndpoints, int id) =>
                await ticketEndpoints.GetTicketByIdAsync(id))
            .WithDescription("Retrieves a specific ticket by its ID.");

        // POST (Create) a new ticket
        ticketGroup.MapPost("/",
            async (ITicketEndpoints ticketEndpoints, TicketDto ticketDto) =>
                await ticketEndpoints.CreateTicketAsync(ticketDto))
            .WithDescription("Creates a new ticket.")
            .WithName("CreateTicket");

        // PUT (Update) an existing ticket
        ticketGroup.MapPut("/{id:int}",
            async (ITicketEndpoints ticketEndpoints, int id, TicketDto ticketDto) =>
                await ticketEndpoints.UpdateTicketAsync(id, ticketDto))
            .WithDescription("Updates an existing ticket by ID.");

        // DELETE a ticket by ID
        ticketGroup.MapDelete("/{id:int}",
            async (ITicketEndpoints ticketEndpoints, int id) =>
                await ticketEndpoints.DeleteTicketAsync(id))
            .WithDescription("Deletes a ticket by its ID.");

        return builder;
    }
}

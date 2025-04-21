using BarberShop.API.Endpoints.Interfaces;

namespace BarberShop.API.Extensions.Endpoints;

public static class TicketEndpointsExtensions
{
    public static IEndpointRouteBuilder MapTicketEndpoints(this IEndpointRouteBuilder builder)
    {
        var seatGroup = builder.MapGroup("/seat")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("Seat");


        seatGroup.MapGet("/", async (ISeatEndpoints seatEndpoints) =>
            await seatEndpoints.GetAllSeatsAsync());

        seatGroup.MapGet("/{id}", async (ISeatEndpoints seatEndpoints, int id) =>
            await seatEndpoints.GetSeatByIdAsync(id));

        seatGroup.MapPost("/", async (ISeatEndpoints seatEndpoints, SeatDto seatDto) =>
            await seatEndpoints.CreateSeatAsync(seatDto));

        seatGroup.MapPut("/{id}", async (ISeatEndpoints seatEndpoints, int id, SeatDto seatDto) =>
            await seatEndpoints.UpdateSeatAsync(id, seatDto));

        seatGroup.MapDelete("/{id}", async (ISeatEndpoints seatEndpoints, int id) =>
            await seatEndpoints.DeleteSeatAsync(id));

        return builder;
    }
}


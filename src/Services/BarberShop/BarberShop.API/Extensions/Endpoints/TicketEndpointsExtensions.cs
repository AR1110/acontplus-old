using BarberShop.Api.Endpoints.Interfaces;
using Common.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace BarberShop.Api.Extensions.Endpoints;

public static class TicketEndpointsExtensions
{
    public static IEndpointRouteBuilder MapTicketEndpoints(this IEndpointRouteBuilder builder)
    {
        var seatGroup = builder.MapGroup("/seat")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("Seat");


        seatGroup.MapGet("/",
            async (ISeatEndpoints seatEndpoints, [FromQuery] int pageIndex, [FromQuery] int pageSize) =>
            {
                var paginationDto = new PaginationDto { PageIndex = pageIndex, PageSize = pageSize };
                return await seatEndpoints.GetSeatsAsync(paginationDto);
            });

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

using BarberShop.Api.Endpoints.Seats;
using BarberShop.Api.Endpoints.Tickets;
using BarberShop.Api.Endpoints.WorkSessions;

namespace BarberShop.Api.Endpoints;

public static class RegisterEndpoints
{
  public static void MapAllEndpoints(this IEndpointRouteBuilder app)
  {
    app.MapSeatEndpoints();
    app.MapWorkSessionEndpoints();
    app.MapTicketEndpoints();
    app.MapLookupEndpoints();
  }
}

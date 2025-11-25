namespace BarberShop.Api.Endpoints.Implementations;

public class TicketEndpoints(IUserContext userContext, ITicketService ticketService) : ITicketEndpoints
{
    public async Task<IResult> CreateTicketAsync(TicketDto ticketDto)
    {
        ticketDto.CreatedByUserId = userContext.GetUserId();
        return Results.Ok(await ticketService.CreateTicketAsync(ticketDto));
    }

    public async Task<IResult> DeleteTicketAsync(int id)
    {
        return Results.Ok(await ticketService.DeleteTicketAsync(id));
    }

    public async Task<IResult> GetTicketByIdAsync(int id)
    {
        return Results.Ok(await ticketService.GetTicketByIdAsync(id));
    }

    public async Task<IResult> GetTicketsAsync(PaginationRequest paginationRequest)
    {
        return Results.Ok(await ticketService.GetTicketsAsync(paginationRequest));
    }

    public async Task<IResult> UpdateTicketAsync(int id, TicketDto ticketDto)
    {
        ticketDto.UpdatedByUserId = userContext.GetUserId();
        return Results.Ok(await ticketService.UpdateTicketAsync(id, ticketDto));
    }
}

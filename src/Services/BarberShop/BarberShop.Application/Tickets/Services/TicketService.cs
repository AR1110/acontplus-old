namespace BarberShop.Application.Tickets.Services;

public class TicketService(ITicketRepository ticketRepository, IAdoRepository adoRepository) : ITicketService
{
  public async Task<PagedResult<TicketDto>> GetTicketsAsync(PaginationRequest paginationRequest)
  {
    var response = await adoRepository.GetPagedFromStoredProcedureAsync<TicketDto>("BarberShop.Ticket_Get",
        paginationRequest);

    return response ?? new PagedResult<TicketDto>
    {
      Items = [],
      PageIndex = paginationRequest.PageIndex,
      PageSize = paginationRequest.PageSize,
      TotalCount = 0
    };
  }

  public async Task<SpResponse> GetTicketByIdAsync(int id)
  {
    var ticket = await ticketRepository.GetTicketByIdAsync(id);
    return ticket == null
        ? new SpResponse
        {
          Code = "0",
          Message = "Ticket no encontrado"
        }
        : new SpResponse
        {
          Code = "1",
          Payload = ticket
        };
  }

  public async Task<SpResponse> CreateTicketAsync(TicketDto ticketDto)
  {
    return new SpResponse
    {
      Code = "1",
      Message = "Ticket creado exitosamente",
      Payload = ObjectMapper.Map<Ticket, TicketDto>(
            await ticketRepository.CreateTicketAsync(
                ObjectMapper.Map<TicketDto, Ticket>(ticketDto)))
    };
  }

  public async Task<SpResponse> UpdateTicketAsync(int id, TicketDto ticketDto)
  {
    var existingTicket = await ticketRepository.GetTicketByIdAsync(id);
    if (existingTicket == null)
      return new SpResponse
      {
        Code = "0",
        Message = "Ticket no encontrado!"
      };

    var updatedTicket = ObjectMapper.Map(ticketDto, existingTicket);
    await ticketRepository.UpdateTicketAsync(updatedTicket);

    return new SpResponse
    {
      Code = "1",
      Message = "Ticket actualizado exitosamente!",
      Payload = ObjectMapper.Map<Ticket, TicketDto>(updatedTicket)
    };
  }

  public async Task<SpResponse> DeleteTicketAsync(int id)
  {
    await ticketRepository.DeleteTicketAsync(id);
    return new SpResponse
    {
      Code = "1",
      Message = "Ticket eliminado exitosamente"
    };
  }
}

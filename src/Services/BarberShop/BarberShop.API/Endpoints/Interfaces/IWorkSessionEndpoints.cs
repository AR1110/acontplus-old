using BarberShop.Application.WorkSessions.DTOs;
using Common.Core.Models;

namespace BarberShop.Api.Endpoints.Interfaces;

public interface IWorkSessionEndpoints
{
    Task<IResult> GetWorkSessionsAsync(PaginationDto paginationDto);
    Task<IResult> GetWorkSessionByIdAsync(int id);
    Task<IResult> CreateWorkSessionAsync(WorkSessionDto workSessionDto);
    Task<IResult> UpdateWorkSessionAsync(int id, WorkSessionDto workSessionDto);
    Task<IResult> DeleteWorkSessionAsync(int id);
}
using Restaurant.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant.Application.Interfaces;

public interface IFloorService
{
    Task<SpResponse> AddAsync(Floor floor);
    Task<SpResponse> DeleteAsync(int userId, int id);
    Task<SpResponse> GetAllAsync();
    Task<SpResponse> GetByEstabAsync(int establecimientoId);
    Task<SpResponse> UpdateAsync(int id, Floor floor);
}


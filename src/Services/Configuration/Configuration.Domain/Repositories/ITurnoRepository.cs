using Configuration.Domain.Models;

namespace Configuration.Domain.Repositories;

public interface ITurnoRepository
{
  Task<SpResponse> GetAsync(Dictionary<string, object> parameters);

  Task<SpResponse> AddAsync(Dictionary<string, object> parameters);

  Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);

  //Task<SpResponse> ReadTurnoAsync(int userRoleId, int pageIndex, int pageSize);

  Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters);
}

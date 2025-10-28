namespace Vet.Domain.Repositories;

public interface IPetRepository
{
    Task<SpResponse> AddAsync(Pet pet);
    Task<SpResponse> DeleteAsync(int userId, int id);
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> GetByIdAsync(int id);
    Task<SpResponse> UpdateAsync(int id, Pet pet);
    Task<SpResponse> SearchAsync(Dictionary<string, object> parameters);
}

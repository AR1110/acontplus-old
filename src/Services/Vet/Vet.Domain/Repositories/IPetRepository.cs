namespace Vet.Domain.Repositories;

public interface IPetRepository
{
    Task<ApiResponse> AddAsync(Pet pet);
    Task<ApiResponse> DeleteAsync(int userId, int id);
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetByIdAsync(int id);
    Task<ApiResponse> UpdateAsync(int id, Pet pet);
    Task<ApiResponse> SearchAsync(Dictionary<string, object> parameters);
}

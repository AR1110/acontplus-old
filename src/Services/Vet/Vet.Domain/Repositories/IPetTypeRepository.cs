namespace Vet.Domain.Repositories;

public interface IPetTypeRepository
{
    Task<ApiResponse> AddAsync(PetType petType);
    Task<ApiResponse> DeleteAsync(int userId, int id);
    Task<ApiResponse> GetAsync();
    Task<ApiResponse> GetByIdAsync(int id);
    Task<ApiResponse> UpdateAsync(int id, PetType petType);
}

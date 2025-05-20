namespace Vet.API.Interfaces;

public interface IBreedService
{
    Task<ApiResponse> AddAsync(Breed breed);
    Task<ApiResponse> DeleteAsync(int userId, int id);
    Task<ApiResponse> GetAsync();
    Task<ApiResponse> GetByIdAsync(int id);
    Task<ApiResponse> UpdateAsync(int id, Breed breed);
}
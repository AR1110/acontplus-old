namespace Vet.Domain.Repositories;

public interface IBreedRepository
{
    Task<SpResponse> AddAsync(Breed breed);
    Task<SpResponse> DeleteAsync(int userId, int id);
    Task<SpResponse> GetAsync();
    Task<SpResponse> GetByIdAsync(int id);
    Task<SpResponse> UpdateAsync(int id, Breed breed);
}

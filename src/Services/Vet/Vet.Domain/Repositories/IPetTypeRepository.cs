namespace Vet.Domain.Repositories;

public interface IPetTypeRepository
{
    Task<SpResponse> AddAsync(PetType petType);
    Task<SpResponse> DeleteAsync(int userId, int id);
    Task<SpResponse> GetAsync();
    Task<SpResponse> GetByIdAsync(int id);
    Task<SpResponse> UpdateAsync(int id, PetType petType);
}

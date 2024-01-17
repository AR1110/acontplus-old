using Common.Core.Models;
using Vet.API.Entities;


namespace Vet.API.Interfaces
{
    public interface IPetService
    {
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
        Task<Pet> GetByIdAsync(int id);
        Task<Pet> AddAsync(Pet pet);
        Pet UpdateAsync(Pet pet);
        void RemoveAsync(Pet pet);

        Task<ApiResponse> SearchAsync(Dictionary<string, object> parameters);
    }
}
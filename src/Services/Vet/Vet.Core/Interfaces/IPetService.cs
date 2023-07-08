using Lib.Common.Api;
using Vet.Core.Entities;

namespace Vet.Core.Interfaces
{
    public interface IPetService
    {
        Task<List<Pet>> GetAsync();
        Task<Pet> GetByIdAsync(int id);
        Task<Pet> AddAsync(Pet pet);
        Pet UpdateAsync(Pet pet);
        void RemoveAsync(Pet pet);

        Task<APIResponse> SearchAsync(Dictionary<string, object> parameters);
    }
}
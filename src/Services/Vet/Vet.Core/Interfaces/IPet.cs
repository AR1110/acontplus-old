using Vet.Core.Entities;

namespace Vet.Core.Interfaces
{
    public interface IPet
    {
        public Task<List<Pet>> GetAsync();
        public Task<Pet> GetByIdAsync(int id);
        public Task<Pet> CreateAsync(Pet pet);
        public Pet UpdateAsync(Pet pet);
        public void RemoveAsync(Pet pet);
    }
}
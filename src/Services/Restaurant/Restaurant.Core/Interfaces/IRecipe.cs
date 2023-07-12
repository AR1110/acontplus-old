using Restaurant.Core.Entities;

namespace Restaurant.Core.Interfaces
{
    public interface IRecipe
    {
        public Task<List<Recipe>> GetAsync();
        public Task<Recipe> GetByIdAsync(int id);
        public Task<Recipe> CreateAsync(Recipe recipe);
        public Recipe UpdateAsync(Recipe recipe);
        public void RemoveAsync(Recipe recipe);
    }
}

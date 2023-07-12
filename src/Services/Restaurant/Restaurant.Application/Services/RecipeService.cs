using Microsoft.EntityFrameworkCore;
using Restaurant.Core.Entities;
using Restaurant.Core.Interfaces;
using Restaurant.Infrastructure.Data;

namespace Restaurant.Application
{
    public class RecipeService : IRecipe
    {
        private readonly RestaurantContext _context;
        public RecipeService(RestaurantContext context)
        {
            _context = context;
        }
        public async Task<List<Recipe>> GetAsync()
        {
            var response = await _context.Recipes.ToListAsync(); 
            return response;
        }
        public async Task<Recipe> GetByIdAsync(int id)
        {
            var response = await _context.Recipes.SingleOrDefaultAsync(x => x.Id == id);
            return response;
        }
        public async Task<Recipe> CreateAsync(Recipe recipe)
        {
            await _context.Recipes.AddAsync(recipe);
            _context.SaveChanges();
            return recipe;
        }
        public Recipe UpdateAsync(Recipe recipe)
        {
            _context.Recipes.Update(recipe);
            _context.SaveChanges();
            return recipe;
        }
        public void RemoveAsync(Recipe recipe)
        {
            _context.Recipes.Remove(recipe);
            _context.SaveChanges();
        }

    }
}

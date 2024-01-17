using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Microsoft.EntityFrameworkCore;
using Restaurant.Core.Entities;
using Restaurant.Core.Interfaces;
using Restaurant.Infrastructure.Data;

namespace Restaurant.Application.Services
{
    public class RecipeService : IRecipe
    {
        private readonly IADORepository _repository;
        private readonly RestaurantContext _context;
        private readonly ApiResponse _response;

        public RecipeService(IADORepository repository)
        {
            _repository = repository;
            _response = new ApiResponse();
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

        // Get
        public async Task<object> GetByItem(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Restaurant.Recipe_Get_By_Item", parameters);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                return null;
            }
            else
            {
                return DataConverters.DataSetToJSON(ds);
            }
        }

        public Task<Recipe> GetByIdAsync(Dictionary<string, object> parameters)
        {
            throw new NotImplementedException();
        }


    }
}

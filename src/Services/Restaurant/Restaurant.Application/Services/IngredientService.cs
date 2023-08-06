using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lib.Common;
using Lib.Common.Api;
using Newtonsoft.Json;
using Restaurant.Core.Entities;
using Restaurant.Core.Interfaces;
using Restaurant.Infrastructure.Data;

namespace Restaurant.Application.Services
{
    public class IngredientService : IIngredientService
    {
        private readonly IADORepository _repository;
        private readonly RestaurantContext _context;
        public IngredientService(IADORepository repository, RestaurantContext context)
        {
            _repository = repository;
            _context = context;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Restaurant.Ingredient_Get", parameters);
            if (ds.Tables.Count == 0)
            {
                return null;
            }
            else
            {
                return Converters.DataSetToJSON(ds);
            }
        }
        public async Task<object> GetByIdAsync(int id)
        {
            var parameters = new Dictionary<string, object>{
                {"id", id},
            };
            var ds = await _repository.GetDataSetAsync("Restaurant.Ingredient_GetById", parameters);
            if (ds.Tables.Count == 0)
            {
                return null;
            }
            else
            {
                return Converters.DataSetToJSON(ds);
            }
        }
        public async Task<string> AddAsync(ApiRequest data)
        {
            var parameters = new Dictionary<string, object>{
                    {"userRoleId", data.UserRoleId},
                    {"json", Converters.SerializeDictionary(data.Data)}
                };
            var response = await _repository.SPExecuteAsync("Restaurant.Ingredient_Insert", parameters);
            return response;
        }
        public async Task<string> UpdateAsync(int id, ApiRequest data)
        {
            var parameters = new Dictionary<string, object>{
                {"userRoleId", data.UserRoleId},
                {"id", id},
                {"json", JsonConvert.SerializeObject(data.Data)}
            };
            var response = await _repository.SPExecuteAsync("Restaurant.Ingredient_Update", parameters);
            return response;
        }

        public async Task<bool> DeleteAsync(int id)
        {

            var ingredient = await _context.Ingredients.FindAsync(id);
            ingredient.Enabled = false;
            ingredient.Deleted = true;
            _context.Update(ingredient);
            await _context.SaveChangesAsync();
            return true;
            // var parameters = new Dictionary<string, object>{
            //     {"id", id}
            // };
            // var response = await _repository.SPExecuteAsync("Restaurant.Ingredient_Delete", parameters);
            // return response;
        }
    }
}
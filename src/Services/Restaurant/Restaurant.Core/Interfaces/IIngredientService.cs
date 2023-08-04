using System.Reflection.Metadata;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Restaurant.Core.Entities;

namespace Restaurant.Core.Interfaces
{
    public interface IIngredientService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<object> GetById(int id);
        Task<string> AddAsync(Dictionary<string, object> parameters);
        Task<string> UpdateAsync(int id, Ingredient data);
        Task<bool> DeleteAsync(int id);
    }
}
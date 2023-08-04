using System.Reflection.Metadata;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Restaurant.Core.Entities;
using Lib.Common.Api;

namespace Restaurant.Core.Interfaces
{
    public interface IIngredientService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<object> GetByIdAsync(int id);
        Task<string> AddAsync(ApiRequest parameters);
        Task<string> UpdateAsync(int id, ApiRequest data);
        Task<bool> DeleteAsync(int id);
    }
}
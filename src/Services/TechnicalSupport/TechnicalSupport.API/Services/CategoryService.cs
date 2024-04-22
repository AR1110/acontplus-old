using Common.Core.Models;
using Common.Core.Utils;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using TechnicalSupport.API.Data;
using TechnicalSupport.API.Entities;
using TechnicalSupport.API.Interfaces;

namespace TechnicalSupport.API.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly TechnicalSupportContext _context;

        public CategoryService(TechnicalSupportContext context)
        {
            _context = context;
        }
        public async Task<ApiResponse> AddAsync(Category category)
        {
            try
            {
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
                return new ApiResponse { code = "1", message = "Guardada Exitosamente" };
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<ApiResponse> DeleteAsync(int userId, int id)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);
                category.Enabled = false;
                category.Deleted = true;
                category.UserId = userId;
                _context.Update(category);
                await _context.SaveChangesAsync();
                return new ApiResponse { code = "1", message = "Eliminada Exitosamente" };
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<ApiResponse> GetAsync()
        {
            try
            {
                if (!await _context.Categories.AnyAsync())
                {
                    return new ApiResponse { code = "0", message = "No data" };
                }
                return new ApiResponse { code = "1", payload = DataConverters.SerializeObjectCustom<List<Category>>(await _context.Categories.ToListAsync()) };
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<ApiResponse> UpdateAsync(int id, Category category)
        {
            try
            {
                var categoryFound = await _context.Categories.FindAsync(id);
                categoryFound.Code = category.Code;
                categoryFound.Enabled = category.Enabled;
                categoryFound.Name = category.Name;
                categoryFound.UserId = category.UserId;
                _context.Update(categoryFound);
                await _context.SaveChangesAsync();
                return new ApiResponse { code = "1", message = "Actualizada Exitosamente" };
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}

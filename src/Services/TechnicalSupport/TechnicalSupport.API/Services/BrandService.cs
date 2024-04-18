using Common.Core.Models;
using Common.Core.Utils;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using TechnicalSupport.API.Data;
using TechnicalSupport.API.Entities;
using TechnicalSupport.API.Interfaces;

namespace TechnicalSupport.API.Services
{
    public class BrandService : IBrandService
    {
        private readonly TechnicalSupportContext _context;

        public BrandService(TechnicalSupportContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse> AddAsync(Brand brand)
        {
            try
            {
                _context.Brands.Add(brand);
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
                var brand = await _context.Brands.FindAsync(id);
                brand.Enabled = false;
                brand.Deleted = true;
                _context.Update(brand);
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
                if (!await _context.Brands.AnyAsync())
                {
                    return new ApiResponse { code = "0", message = "No data" };
                }
                return new ApiResponse { code = "1", payload = DataConverters.SerializeObjectCustom<List<Brand>>(await _context.Brands.ToListAsync()) };
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<ApiResponse> UpdateAsync(int id, Brand brand)
        {
            try
            {
                var brandFound = await _context.Brands.FindAsync(id);
                brandFound.Code = brand.Code; 
                brandFound.Enabled = brand.Enabled; 
                brandFound.Name = brand.Name;
                _context.Update(brandFound);
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

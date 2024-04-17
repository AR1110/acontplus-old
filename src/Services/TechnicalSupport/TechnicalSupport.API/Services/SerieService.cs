using Common.Core.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using TechnicalSupport.API.Data;
using TechnicalSupport.API.Entities;
using TechnicalSupport.API.Interfaces;

namespace TechnicalSupport.API.Services
{
    public class SerieService : ISerieService
    {
        private readonly TechnicalSupportContext _context;

        public SerieService(TechnicalSupportContext context)
        {
            _context = context;
        }
        public async Task<ApiResponse> AddAsync(Serie serie)
        {
            try
            {
                _context.Series.Add(serie);
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
                var brand = await _context.Series.FindAsync(id);
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
                if (!await _context.Series.AnyAsync())
                {
                    return new ApiResponse { code = "0", message = "No data" };
                }
                return new ApiResponse { code = "1", payload = JsonConvert.SerializeObject(await _context.Brands.ToListAsync()) };
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<ApiResponse> UpdateAsync(int id, Serie serie)
        {
            try
            {
                var brandFound = await _context.Series.FindAsync(id);
                brandFound.BrandId = serie.BrandId;
                brandFound.Code = serie.Code;
                brandFound.Enabled = serie.Enabled;
                brandFound.Name = serie.Name;
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

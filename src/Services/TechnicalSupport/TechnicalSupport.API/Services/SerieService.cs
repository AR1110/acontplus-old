using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
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
        private readonly IADORepository _repository;
        public SerieService(TechnicalSupportContext context, IADORepository repoitory)
        {
            _context = context;
            _repository = repoitory;
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
                var serie = await _context.Series.FindAsync(id);
                serie.Enabled = false;
                serie.Deleted = true;
                serie.UserId = userId;
                _context.Update(serie);
                await _context.SaveChangesAsync();
                return new ApiResponse { code = "1", message = "Eliminada Exitosamente" };
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            try
            {
                if (!await _context.Series.AnyAsync())
                {
                    return new ApiResponse { code = "0", message = "No data" };
                }
                //return new ApiResponse { code = "1", payload = JsonConvert.SerializeObject(await _context.Brands.ToListAsync()) };
                var dt = await _repository.GetDataTableAsync("TechnicalSupport.Serie_Get", parameters);
                if (DataValidation.DataTableIsNull(dt))
                {
                    return new ApiResponse { code = "0", message = "No data" };
                }
                return new ApiResponse { code = "1", payload = DataConverters.DataTableToJSON(dt) };
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
                var serieFound = await _context.Series.FindAsync(id);
                serieFound.BrandId = serie.BrandId;
                serieFound.Code = serie.Code;
                serieFound.Enabled = serie.Enabled;
                serieFound.Name = serie.Name;
                serieFound.UserId = serie.UserId;
                _context.Update(serieFound);
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

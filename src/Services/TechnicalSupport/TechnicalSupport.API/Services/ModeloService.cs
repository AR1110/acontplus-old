using Common.Core.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using TechnicalSupport.API.Data;
using TechnicalSupport.API.Entities;
using TechnicalSupport.API.Interfaces;

namespace TechnicalSupport.API.Services
{
    public class ModeloService : IModeloService
    {
        private readonly TechnicalSupportContext _context;

        public ModeloService(TechnicalSupportContext context)
        {
            _context = context;
        }
        public async Task<ApiResponse> AddAsync(Modelo modelo)
        {
            try
            {
                _context.Modelos.Add(modelo);
                await _context.SaveChangesAsync();
                return new ApiResponse { code = "1", message = "Guardado Exitosamente" };
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
                var modelo = await _context.Modelos.FindAsync(id);
                modelo.Enabled = false;
                modelo.Deleted = true;
                _context.Update(modelo);
                await _context.SaveChangesAsync();
                return new ApiResponse { code = "1", message = "Eliminado Exitosamente" };
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
                if (!await _context.Modelos.AnyAsync())
                {
                    return new ApiResponse { code = "0", message = "No data" };
                }
                return new ApiResponse { code = "1", payload = JsonConvert.SerializeObject(await _context.Modelos.ToListAsync()) };
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<ApiResponse> UpdateAsync(int id, Modelo modelo)
        {
            try
            {
                var modeloFound = await _context.Modelos.FindAsync(id);
                modeloFound.Code = modelo.Code;
                modeloFound.Enabled = modelo.Enabled;
                modeloFound.Name = modelo.Name;
                _context.Update(modeloFound);
                await _context.SaveChangesAsync();
                return new ApiResponse { code = "1", message = "Actualizado Exitosamente" };
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}

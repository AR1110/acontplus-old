using Common.Core.Utils;
using Configuracion.API.Data;
using Configuracion.API.Entities;
using Configuracion.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Configuracion.API.Services
{
    public class EstablecimientoLogoService : IEstablecimientoLogoService
    {
        private readonly ConfigContext _context;
        public EstablecimientoLogoService(ConfigContext context)
        {
            _context = context;
        }
        public async Task<object> AddAsync(EstablecimientoLogo data)
        {
            try
            {
                data.IsCompressed = true;
                await _context.AddAsync(data);
                await _context.SaveChangesAsync();
                return new { code = "1", message = "Guardado Exitosamente" };
            }
            catch (Exception)
            {
                throw;
            }
            
        }

        public async Task<object> DeleteAsync(int id)
        {
            try
            {
                var logo = await _context.EstablecimientoLogos.FindAsync(id);
                if (logo == null) { return null; };
                logo.Enabled = false;
                logo.Deleted = false;
                _context.Update(logo);
                await _context.SaveChangesAsync();
                return new { code = "1", message = "Eliminado Exitosamente" };
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<EstablecimientoLogo> GetAsync(int establecimientoId)
        {
            var logo = await _context.EstablecimientoLogos.FirstOrDefaultAsync(x => x.EstablecimientoId == establecimientoId);
            if (logo == null) { return null; }
            if (logo.IsCompressed == true)
            {
                logo.Content = CompressionHelper.Decompress(logo.Content);
            }
            return logo;
        }

        public async Task<object> UpdateAsync(int id, EstablecimientoLogo data)
        {
            try
            {
                var logo = await _context.EstablecimientoLogos.FindAsync(id);
                if (logo == null) { return null; };
                logo.Content = data.Content;
                logo.ContentType = data.ContentType;
                logo.IsCompressed = true;
                _context.Update(logo);
                await _context.SaveChangesAsync();
                return new { code = "1", message = "Actualizado Exitosamente" };
            }
            catch (Exception)
            {
                throw;
            }  
        }
    }
}

using Common.Core.Utils;
using Configuracion.API.Data;
using Configuracion.API.Entities;
using Configuracion.API.Interfaces;

namespace Configuracion.API.Services
{
    public class EstablecimientoLogoService : IEstablecimientoLogoService
    {
        private readonly ConfigContext _context;
        public EstablecimientoLogoService(ConfigContext context)
        {
            _context = context;
        }
        public Task<string> AddAsync(EstablecimientoLogo data)
        {
            throw new NotImplementedException();
        }

        public Task<string> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<EstablecimientoLogo> GetAsync(int id)
        {
            var logo = await _context.EstablecimientoLogos.FindAsync(id);
            if (logo == null) { return null; }
            logo.Content = CompressionHelper.Decompress(logo.Content);
            return logo;
        }

        public Task<string> UpdateAsync(int id, EstablecimientoLogo data)
        {
            throw new NotImplementedException();
        }
    }
}

using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Configuracion.API.Interfaces;

namespace Configuracion.API.Services
{
    public class EstadoDocumentoService : IEstadoDocumentoService
    {
        private readonly IADORepository _repository;
        public EstadoDocumentoService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<ApiResponse> GetAsync(string json)
        {
            var data = new ApiResponse();
            var estados = await _repository.CustomReader<EstadoPago>("Gestion.EstadoDocumento_Get", new Dictionary<string, object> { { "json", SqlStringParam.Sanitize(json) } });
            if (estados.Count > 0)
            {
                data.code = "1";
                data.data = estados;
            }
            return data;
        }

    }
}

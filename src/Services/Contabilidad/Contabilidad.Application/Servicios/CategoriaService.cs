using Contabilidad.Core.Interfaces;
using Lib.Common;

namespace Contabilidad.Application.Servicios
{
    public class CategoriaService : ICategoriaService
    {
        private readonly IADORepository _repository;
        public CategoriaService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<string> GetAsync(Dictionary<string, object> parameters)
        {
            var dt = await _repository.GetDataTableAsync("Contabilidad.Categoria_Get", parameters);
            if (!DataValidation.DataTableIsNull(dt))
            {
                return Converters.DataTableToJSON(dt);
            }
            else
            {
                return null;
            }
        }
    }
}

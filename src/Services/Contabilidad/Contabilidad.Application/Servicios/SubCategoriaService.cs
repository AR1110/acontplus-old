using Contabilidad.Core.Entities;
using Contabilidad.Core.Interfaces;
using Contabilidad.Infrastructure.Data;
using Lib.Common;
using Lib.Common.Api;
using System.Data;

namespace Contabilidad.Application.Servicios
{
    public class SubCategoriaService : ISubCategoriaService
    {
        private readonly IADORepository _repository;
        private readonly ContabilidadContext _context;
        private readonly APIResponse _response;
        public SubCategoriaService(IADORepository repository, ContabilidadContext context)
        {
            _repository = repository;
            _context = context;
            _response = new APIResponse();
        }
        public async Task<object?> GetAsync(Dictionary<string, object> parameters)
        {
            DataSet ds = await _repository.GetDataSetAsync("Contabilidad.SubCategoria_Get", parameters);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                if (ds.Tables.Count > 0)
                {
                    _ = new DataSet();
                }
                return null;
            }
            else
            {
                return Converters.DataSetToJSON(ds);
            }
        }

        public async Task<APIResponse> InsertAsync(SubCategoria data)
        {
            if (_context.Subcategorias.Any(x => x.Codigo == data.Codigo))
            {
                _response.Create(code: "0", message: "Codigo ya existe");
                return _response;
            }

            _context.Subcategorias.Add(data);

            await _context.SaveChangesAsync();

            _response.Create(code: "1", message: "Ok");

            return _response;
        }

    }
}

using Contabilidad.Core.Entities;
using Contabilidad.Core.Interfaces;
using Contabilidad.Infrastructure.Data;
using Lib.Common;
using Lib.Common.Api;
using Newtonsoft.Json;
using System.Data;
using System.Text.Json.Serialization;

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
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            DataSet ds = await _repository.GetDataSetAsync("Contabilidad.SubCategoria_Get", parameters);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                if (ds.Tables.Count > 0)
                {
                    ds = new DataSet();
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
                _response.Create(code:"0", message: "Codigo ya existe");
                return _response;
            }
            //var parameters = new Dictionary<string, object>
            //{
            //    {"json", JsonConvert.SerializeObject(data)}
            //};
            //int id = await _repository.ExecuteScalarAsync("Contabilidad.SubCategoria_Insert ", parameters);

            _context.Subcategorias.Add(data);

            await _context.SaveChangesAsync();
            
            _response.Create(code: "1", message: "Ok");

            return _response;
        }

    }
}

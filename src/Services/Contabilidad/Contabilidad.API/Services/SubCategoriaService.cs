using System.Data;

namespace Contabilidad.API.Services
{
    public class SubCategoriaService : ISubCategoriaService
    {
        private readonly IADORepository _repository;
        private readonly ContabilidadContext _context;
        private readonly ApiResponse _response;
        public SubCategoriaService(IADORepository repository, ContabilidadContext context)
        {
            _repository = repository;
            _context = context;
            _response = new ApiResponse();
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Contabilidad.Subcategoria_Get", parameters);

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
                return DataConverters.DataSetToJSON(ds);
            }
        }

        public async Task<ApiResponse> InsertAsync(Subcategory data)
        {
            if (_context.Subcategories.Any(x => x.Code == data.Code))
            {
                _response.Create(code: "0", message: "Codigo ya existe");
                return _response;
            }

            _context.Subcategories.Add(data);

            await _context.SaveChangesAsync();

            _response.Create(code: "1", message: "Ok");

            return _response;
        }

    }
}

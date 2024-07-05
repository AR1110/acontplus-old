namespace Inventario.API.Services
{
    public class ArticuloService: IArticuloService
    {
        private readonly IAdoRepository _repository;
        private readonly string nameSchema = "Inventario.Articulo_";

        public ArticuloService(IAdoRepository repository)
        {
            _repository = repository;
        }

        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync(nameSchema + "Get", parameters, true);

            if (!DataValidation.DataSetIsNull(ds))
            {
                return DataConverters.DataSetToJson(ds, true);
            }

            return null;
        }

        public async Task<ApiResponse> SearchAsync(Dictionary<string, object> parameters)
        {
            var dt = await _repository.GetDataTableAsync(nameSchema + "Get_Search", parameters);

            if (!DataValidation.DataTableIsNull(dt))
            {
                return new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
            }

            return  new ApiResponse { Code = "0", Message = "No existen datos."};
        }

        public async Task<object> GetByIdAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync(nameSchema + "Get_Id", parameters, true);
            if (ds.Tables[0].Rows.Count == 0) { return null; }

            return DataConverters.DataSetToJson(ds, true);
        }

        public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteAsync<ApiResponse>(nameSchema + "Insert", parameters);
        }

        public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteAsync<ApiResponse>(nameSchema + "Update", parameters);
        }

        public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteAsync<ApiResponse>(nameSchema + "Delete", parameters);
        }
    }
}

namespace Inventario.API.Services;

public class ProductService : IProductService
{
    private readonly IAdoRepository _repository;
    private readonly string nameSchema = "Inventario.Product_";

    public ProductService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync(nameSchema + "Get", parameters);
        if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
        {
            return new ApiResponse { Code = "0", Message = "Sin registros", Payload = null };
        }


        return new ApiResponse
        {
            Code = "1",
            Message = "Listado exitosamente",
            Payload = DataConverters.DataSetToJson(ds)
        };
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>(nameSchema + "Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>(nameSchema + "Update", parameters);
    }
}

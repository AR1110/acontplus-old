namespace Ventas.API.Services;

public class ProformaService : IProformaService
{
    private readonly IAdoRepository _repository;
    private readonly string nameSchema = "Ventas.Proforma_";

    public ProformaService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync(nameSchema + "Get", parameters);
        if (ds.Tables.Count == 0)
        {
            return null;
        }

        return DataConverters.DataSetToJSON(ds);
    }


    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync(nameSchema + "Insert", parameters);
    }

    public async Task<object> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync(nameSchema + "GetId", parameters, true);
        if (ds.Tables[0].Rows.Count == 0) { return null; }

        return DataConverters.DataSetToJSON(ds, true);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync(nameSchema + "Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync(nameSchema + "Delete", parameters);
    }

    public async Task<ApiResponse> ConvertToDoc(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync(nameSchema + "Convert_To_Doc", parameters);
    }
}

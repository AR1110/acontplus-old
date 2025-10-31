namespace Configuration.Application.Services;

public class FirmaElectronicaService(IAdoRepository adoRepository) : IFirmaElectronicaService
{
    private const string ModuleName = "Config.FirmaElectronica_";

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Insert", parameters);
    }

    public async Task<FileModel> DownloadAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Download", parameters);

        if (DataValidation.DataSetIsNull(ds))
            return null;

        var dt = ds.Tables[0];

        if (dt.Rows.Count > 0 && dt.Columns.Contains("signature"))
        {
            var response = new FileModel
            {
                Content = dt.Rows[0].Field<byte[]>("signature"),
                FileName = dt.Rows[0].Field<string>("filename")
            };
            return response;
        }

        return null;
    }

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters);
        return !DataValidation.DataSetIsNull(ds)
            ? new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) }
            : new SpResponse { Code = "0", Message = "No data found" };
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Update", parameters);
    }

    public async Task<SpResponse> UpdateFileAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Update_Signature", parameters);
    }
}

using System.Text;
using System.Web;

namespace Configuracion.Application.Services;

public class FirmaElectronicaService(IAdoRepository adoRepository) : IFirmaElectronicaService
{
    private const string ModuleName = "Config.FirmaElectronica_";

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Insert", parameters);
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
    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters, false);
        return !DataValidation.DataSetIsNull(ds)
            ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds, true) }
            : new ApiResponse { Code = "0", Message = "No data found" };
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Update", parameters);
    }

    public async Task<ApiResponse> UpdateFileAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Update_Signature", parameters);
    }
}

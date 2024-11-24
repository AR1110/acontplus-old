using System.Web;

namespace FactElect.API.Services;

public class DocumentoElectronicoService(IAdoRepository adoRepository) : IDocumentoElectronicoService
{
    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("FactElect.Doc_Elect_Get", parameters, true);
        return !DataValidation.DataSetIsNull(ds)
            ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds, true) }
            : new ApiResponse { Code = "0", Message = "No se encontraron datos" };
    }

    public async Task<ApiResponse> GetByStatusAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("FactElect.Doc_Elect_GetByStatus", parameters, true);
        return !DataValidation.DataSetIsNull(ds)
            ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds, true) }
            : new ApiResponse { Code = "0", Message = "No se encontraron datos" };
    }

    public async Task<ApiResponse> GetDataFormAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("FactElect.Doc_Elect_Get_Data_Form", parameters);
        return !DataValidation.DataSetIsNull(ds)
            ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds, true) }
            : new ApiResponse { Code = "0", Message = "No se encontraron datos" };
    }

    public async Task<FileModel> GetXmlSriAsync(Dictionary<string, object> parameters)
    {
        var dt = await adoRepository.GetDataTableAsync("FactElect.Doc_Elect_Get_Xml", parameters);
        if (dt.Rows.Count > 0 && dt.Columns.Contains("xmlSri"))
        {
            var xmlSri = HttpUtility.HtmlDecode(dt.Rows[0].Field<string>("xmlSri"));
            var response = new FileModel
            {
                Content = Encoding.UTF8.GetBytes(xmlSri), FileName = dt.Rows[0].Field<string>("filename") + ".xml"
            };
            return response;
        }

        return null;
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        var result = await adoRepository.OnlyExecuteAsync("FactElect.Doc_Elect_Update", parameters);
        return result > 0
            ? new ApiResponse { Code = "1", Message = "Update successful" }
            : new ApiResponse { Code = "0", Message = "Update failed" };
    }
}

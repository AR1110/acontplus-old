using System.Web;

namespace Compras.API.Services;

public class DocumentoRecibidoService(IAdoRepository repository) : IDocumentoRecibidoService
{
    public async Task<ApiResponse> AddAsync(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", request.UserRoleId },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
        };
        return await repository.SpExecuteAsync("Recepcion.Documento_Insert", parameters);
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Recepcion.Documento_Get", parameters);
        if (DataValidation.DataSetIsNull(ds, true))
        {
            return new ApiResponse { code = "0", message = "Data not found" };
        }

        return new ApiResponse { code = "1", payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<XmlDocument> GetById(Dictionary<string, object> parameters)
    {
        var xdoc = new XmlDocument();
        var dt = await repository.GetDataTableAsync("Recepcion.Documento_Get_Id", parameters);
        if (dt.Rows.Count > 0 && dt.Columns.Contains("xmlDoc"))
        {
            var xmlDoc = dt.Rows[0]["xmlDoc"].ToString();
            xdoc.LoadXml(xmlDoc);
            return xdoc;
        }
        else
        {
            return new XmlDocument();
        }
    }


    public async Task<ApiResponse> UpdateAsync(int id, ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", request.UserRoleId },
            { "id", id },
            { "json", DataConverters.SerializeDictionary(request.Data) }
        };
        return await repository.SpExecuteAsync("Recepcion.Documento_Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await repository.SpExecuteAsync("Recepcion.Documento_Delete", parameters);
    }

    public async Task<ApiResponse> UploadXmlAsync(Dictionary<string, object> parameters)
    {
        return await repository.SpExecuteAsync("Recepcion.Documento_Upload_Xml", parameters);
    }

    public async Task<byte[]> DownloadAsync(Dictionary<string, object> parameters)
    {
        var dt = await repository.GetDataTableAsync("Recepcion.Documento_Get_Id", parameters);
        if (dt.Rows.Count > 0 && dt.Columns.Contains("xmlDoc"))
        {
            var xmlDoc = HttpUtility.HtmlDecode(dt.Rows[0].Field<string>("xmlDoc"));
            return Encoding.UTF8.GetBytes(xmlDoc);
        }
        else
        {
            return null;
        }
    }

    public async Task<ApiResponse> UpdateSubcategoryAsync(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", request.UserRoleId },
            { "json", DataConverters.SerializeDictionary(request.Data) }
        };
        return await repository.SpExecuteAsync("Recepcion.Documento_Update_Subcategory", parameters);
    }
}

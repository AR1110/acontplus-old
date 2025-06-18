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
        return await repository.SpExecuteAsync<ApiResponse>("Recepcion.Documento_Insert", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await repository.SpExecuteAsync<ApiResponse>("Recepcion.Documento_Delete", parameters);
    }

    public async Task<byte[]> DownloadAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Recepcion.Documento_Get_Id", parameters, withTableNames: false);
        var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        if (dt.Rows.Count > 0 && dt.Columns.Contains("xmlDoc"))
        {
            var xmlDoc = HttpUtility.HtmlDecode(dt.Rows[0].Field<string>("xmlDoc"));
            return Encoding.UTF8.GetBytes(xmlDoc);
        }

        return null;
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Recepcion.Documento_Get", parameters);
        if (DataValidation.DataSetIsNull(ds, true)) return new ApiResponse { Code = "0", Message = "Data not found" };

        return new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<XmlDocument> GetById(Dictionary<string, object> parameters)
    {
        var xdoc = new XmlDocument();
        var ds = await repository.GetDataSetAsync("Recepcion.Documento_Get_Id", parameters, withTableNames: false);
        var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        switch (dt.Rows.Count)
        {
            case > 0 when dt.Columns.Contains("xmlDoc"):
            {
                var xmlDoc = dt.Rows[0]["xmlDoc"].ToString();
                if (xmlDoc != null) xdoc.LoadXml(xmlDoc);

                return xdoc;
            }
            default:
                return new XmlDocument();
        }
    }

    public async Task<ApiResponse> MigrateAsync(Dictionary<string, object> parameters)
    {
        return await repository.SpExecuteAsync<ApiResponse>("Recepcion.Documento_Migrate", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(int id, ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", request.UserRoleId },
            { "id", id },
            { "json", DataConverters.SerializeDictionary(request.Data) }
        };
        return await repository.SpExecuteAsync<ApiResponse>("Recepcion.Documento_Update", parameters);
    }

    public async Task<ApiResponse> UploadXmlAsync(Dictionary<string, object> parameters)
    {
        return await repository.SpExecuteAsync<ApiResponse>("Recepcion.Documento_Upload_Xml", parameters);
    }


    public async Task<ApiResponse> UpdateSubcategoryAsync(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", request.UserRoleId }, { "json", DataConverters.SerializeDictionary(request.Data) }
        };
        return await repository.SpExecuteAsync<ApiResponse>("Recepcion.Documento_Update_Subcategory", parameters);
    }
}
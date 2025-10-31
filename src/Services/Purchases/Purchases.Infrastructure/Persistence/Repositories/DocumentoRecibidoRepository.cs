using System.Web;

namespace Purchases.Infrastructure.Persistence.Repositories;

public class DocumentoRecibidoRepository(IAdoRepository repository) : IDocumentoRecibidoRepository
{


    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>("Recepcion.Documento_Delete", parameters);
    }

    public async Task<byte[]> DownloadAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Recepcion.Documento_Get_Id", parameters);
        var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
        if (dt.Rows.Count > 0 && dt.Columns.Contains("xmlDoc"))
        {
            var xmlDoc = HttpUtility.HtmlDecode(dt.Rows[0].Field<string>("xmlDoc"));
            return Encoding.UTF8.GetBytes(xmlDoc);
        }

        return null;
    }

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Recepcion.Documento_Get", parameters);
        if (DataValidation.DataSetIsNull(ds, true)) return new SpResponse { Code = "0", Message = "Data not found" };

        return new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<XmlDocument> GetById(Dictionary<string, object> parameters)
    {
        var xdoc = new XmlDocument();
        var ds = await repository.GetDataSetAsync("Recepcion.Documento_Get_Id", parameters);
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

    public async Task<SpResponse> MigrateAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>("Recepcion.Documento_Migrate", parameters);
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>("Recepcion.Documento_Insert", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>("Recepcion.Documento_Update", parameters);
    }

    public async Task<SpResponse> UploadXmlAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>("Recepcion.Documento_Upload_Xml", parameters);
    }

    public async Task<SpResponse> UpdateSubcategoryAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>("Recepcion.Documento_Update_Subcategory", parameters);
    }
}

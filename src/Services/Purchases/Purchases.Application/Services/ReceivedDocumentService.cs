namespace Purchases.Application.Services;

public class ReceivedDocumentService(IUnitOfWork unitOfWork) : IReceivedDocumentService
{
  private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;
  private const string ModuleName = "Compra.DocumentoRecibido_";

  public async Task<object> GetAsync(Dictionary<string, object> parameters)
  {
    var ds = await _adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters);
    return DataValidation.DataSetIsNull(ds) ? null : DataConverters.DataSetToJson(ds);
  }

  public async Task<object> GetByIdAsync(Dictionary<string, object> parameters)
  {
    var ds = await _adoRepository.GetDataSetAsync($"{ModuleName}GetById", parameters);
    return DataValidation.DataSetIsNull(ds) ? null : DataConverters.DataSetToJson(ds);
  }

  public async Task<XmlDocument> GetByIdXmlAsync(Dictionary<string, object> parameters)
  {
    var xdoc = new XmlDocument();
    var ds = await _adoRepository.GetDataSetAsync("Recepcion.Documento_Get_Id", parameters);
    var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
    if (dt.Rows.Count > 0 && dt.Columns.Contains("xmlDoc"))
    {
      var xmlDoc = dt.Rows[0]["xmlDoc"].ToString();
      if (xmlDoc != null) xdoc.LoadXml(xmlDoc);
      return xdoc;
    }
    return new XmlDocument();
  }

  public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
  {
    return await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Insert", parameters);
  }

  public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
  {
    return await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Update", parameters);
  }

  public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
  {
    return await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Delete", parameters);
  }

  public async Task<SpResponse> MigrateAsync(Dictionary<string, object> parameters)
  {
    return await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Migrate", parameters);
  }

  public async Task<SpResponse> UpdateSubcategoryAsync(Dictionary<string, object> parameters)
  {
    return await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}UpdateSubcategory", parameters);
  }

  public async Task<byte[]> DownloadAsync(Dictionary<string, object> parameters)
  {
    return await _adoRepository.QuerySingleOrDefaultAsync<byte[]>($"{ModuleName}Download", parameters);
  }

  public async Task<SpResponse> UploadXmlAsync(Dictionary<string, object> parameters)
  {
    return await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}UploadXml", parameters);
  }
}

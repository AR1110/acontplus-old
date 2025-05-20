namespace FactElect.Application.Services;

public class DocumentoElectronicoErrorService(IAdoRepository adoRepository) : IDocumentoElectronicoErrorService
{
    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("FactElect.Doc_Elect_Error_Get_Id", parameters);
        return !DataValidation.DataSetIsNull(ds, true)
            ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) }
            : new ApiResponse { Code = "0", Message = "No se encontraron datos" };
    }
}

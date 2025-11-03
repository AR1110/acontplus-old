namespace Billing.Application.Services;

public class DocumentoElectronicoErrorService(IAdoRepository adoRepository, IConfiguration configuration) : IDocumentoElectronicoErrorService
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("FactElect.Doc_Elect_Error_Get_Id", parameters);
        return !DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) }
            : new SpResponse { Code = "0", Message = "No se encontraron datos" };
    }
    public async Task CleanupProcessedErrorsAsync()
    {
        try
        {
            var batchSize = configuration.GetValue("ErrorCleanup:BatchSize", 500);
            var maxBatches = configuration.GetValue("ErrorCleanup:MaxBatches", 10);

            await adoRepository.ExecuteNonQueryAsync("FactElect.Doc_Elect_Error_Delete",
                new Dictionary<string, object>
                {
                    { "BatchSize", batchSize },
                    { "MaxBatches", maxBatches }
                });

            // Log successful cleanup (optional)
            // _logger.LogInformation($"Error cleanup completed successfully with batch size: {batchSize}");
        }
        catch (Exception)
        {
            // Log error (optional)
            // _logger.LogError(ex, "Error occurred during cleanup process");

            // Don't throw exception to prevent background service from stopping
        }
    }
}

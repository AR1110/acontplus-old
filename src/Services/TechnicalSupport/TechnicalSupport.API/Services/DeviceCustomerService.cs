public class DeviceCustomerService : IDeviceCustomerService
{
    private readonly IAdoRepository _repository;

    public DeviceCustomerService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("TechnicalSupport.Device_Customer_Get", parameters);
        if (DataValidation.DataSetIsNull(ds))
        {
            // Handle case where no data is found
            return new ApiResponse { code = "1", message = "No se encontraron datos" };
        }

        return new ApiResponse { code = "1", payload = DataConverters.DataSetToJSON(ds) };
    }
}

public class DeviceCustomerService : IDeviceCustomerService
{
    private readonly IAdoSqlServer _adoSqlServer;

    public DeviceCustomerService(IAdoSqlServer adoSqlServer)
    {
        _adoSqlServer = adoSqlServer;
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _adoSqlServer.GetDataSetAsync("TechnicalSupport.Device_Customer_Get", parameters);
        if (DataValidation.DataSetIsNull(ds))
        {
            // Handle case where no data is found
            return new ApiResponse { Code = "1", Message = "No se encontraron datos" };
        }

        return new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}

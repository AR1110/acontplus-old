namespace Compras.API.Services
{
    public class ArticuloService(IAdoRepository adoRepository) : IArticuloService
    {
        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var dt = await adoRepository.GetDataTableAsync("Recepcion.Articulo_Get", parameters);
            return DataValidation.DataTableIsNull(dt)
                ? new ApiResponse { Code = "0", Message = "Recurso no encontrado" }
                : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
        }
    }
}

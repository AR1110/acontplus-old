namespace Contabilidad.API.Services;

public class CuotaPorCobrarService(IAdoRepository adoRepository) : ICuotaPorCobrarService
{
    private const string ModuleName = "Contabilidad.CuotaPorCobrar_";

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Update", parameters);
    }
}

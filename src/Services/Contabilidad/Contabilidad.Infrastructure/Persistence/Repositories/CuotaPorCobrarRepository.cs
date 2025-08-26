using Contabilidad.Domain.Repositories;

namespace Contabilidad.Infrastructure.Persistence.Repositories;

public class CuotaPorCobrarRepository(IAdoRepository adoRepository) : ICuotaPorCobrarRepository
{
    private const string ModuleName = "Contabilidad.CuotaPorCobrar_";

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Update", parameters);
    }
}

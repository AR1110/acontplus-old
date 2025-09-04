namespace Contabilidad.Infrastructure.Persistence.Repositories;

public class CuotaPorCobrarRepository(IAdoRepository adoRepository) : ICuotaPorCobrarRepository
{
    private const string ModuleName = "Contabilidad.CuotaPorCobrar_";

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Update", parameters);
    }
}

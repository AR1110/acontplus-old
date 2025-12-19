using Acontplus.Core.Dtos.Requests;
using System.Data;

namespace Billing.Infrastructure.Persistence.Repositories;

public class AtsRepository(IAdoRepository adoRepository) : IAtsRepository
{
    private const string ModuleName = "FactElect.Ats_";

    public async Task<SpResponse> CheckValidationAsync(Dictionary<string, object> parameters,
        CancellationToken cancellationToken)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}CheckValidation", parameters,
            cancellationToken: cancellationToken);
    }

    public async Task<DataSet> GetAsync(Dictionary<string, object> parameters, CancellationToken cancellationToken)
    {
        var commandOptions = new CommandOptionsDto
        {
            CommandTimeout = 0
        };
        return await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters, commandOptions,
            cancellationToken: cancellationToken);
    }
}

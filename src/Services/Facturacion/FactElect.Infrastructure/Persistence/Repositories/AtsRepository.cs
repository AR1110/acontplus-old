using Acontplus.Core.Abstractions.Persistence;
using Acontplus.Core.DTOs.Requests;
using Acontplus.Core.DTOs.Responses;
using FactElect.Domain.Repositories;
using System.Data;

namespace FactElect.Infrastructure.Persistence.Repositories;

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

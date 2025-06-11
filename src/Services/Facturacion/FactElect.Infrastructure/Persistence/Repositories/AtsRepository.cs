using System.Data;
using Common.Core.Abstractions;
using Common.Core.Models;
using FactElect.Domain.Repositories;

namespace FactElect.Infrastructure.Persistence.Repositories;

public class AtsRepository(IAdoRepository adoRepository) : IAtsRepository
{
    private readonly string _moduleName = "FactElect.Ats_";

    public async Task<ApiResponse> CheckValidationAsync(Dictionary<string, object> parameters,
        CancellationToken cancellationToken)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{_moduleName}CheckValidation", parameters,
            cancellationToken: cancellationToken);
    }

    public async Task<DataSet> GetAsync(Dictionary<string, object> parameters, CancellationToken cancellationToken)
    {
        return await adoRepository.GetDataSetAsync($"{_moduleName}Get", parameters, timeout: false,
            cancellationToken: cancellationToken);
    }
}
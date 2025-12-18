namespace Purchases.Application.Services;

public class NonHabitualPurchaseService(IUnitOfWork unitOfWork) : INonHabitualPurchaseService
{
  private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;
  private const string ModuleName = "Compra.CompraNoHabitual_";

  public async Task<object> GetAsync(Dictionary<string, object> parameters)
  {
    var ds = await _adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters);
    return DataValidation.DataSetIsNull(ds) ? null : DataConverters.DataSetToJson(ds);
  }

  public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
  {
    return await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Insert", parameters);
  }

  public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
  {
    return await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Update", parameters);
  }

  public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
  {
    return await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Delete", parameters);
  }
}

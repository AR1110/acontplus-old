namespace Purchases.Application.Services;

public class ArticleService(IUnitOfWork unitOfWork) : IArticleService
{
    private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;
    private const string ModuleName = "Compra.Articulo_";

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters);
        return DataValidation.DataSetIsNull(ds)
            ? new SpResponse { Code = "0", Message = "Can't get data" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}

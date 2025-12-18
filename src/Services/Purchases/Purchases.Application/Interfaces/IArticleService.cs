namespace Purchases.Application.Interfaces;

public interface IArticleService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
}

using Purchases.Application.Dtos.Articles;

namespace Purchases.Application.Services;

public class ArticleService(IUnitOfWork unitOfWork) : IArticleService
{
    private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;
    private const string ModuleName = "Purchases.Article";

    public async Task<Result<IReadOnlyList<ArticleItem>, DomainError>> GetAsync(int userRoleId, CancellationToken cancellationToken = default)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "userRoleId", userRoleId } };
            var articles = await _adoRepository.QueryAsync<ArticleItem>($"{ModuleName}Get", parameters);
            return Result<IReadOnlyList<ArticleItem>, DomainError>.Success(articles.ToList().AsReadOnly());
        }
        catch (Exception ex)
        {
            return Result<IReadOnlyList<ArticleItem>, DomainError>.Failure(DomainError.Internal("ARTICLE_GET_ERROR", ex.Message));
        }
    }
}

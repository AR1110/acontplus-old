using Purchases.Application.Dtos.Articles;

namespace Purchases.Application.Interfaces;

public interface IArticleService
{
    Task<Result<IReadOnlyList<ArticleItem>, DomainError>> GetAsync(int userRoleId, CancellationToken cancellationToken = default);
}

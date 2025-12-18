namespace Purchases.Application.Dtos.Articles;

public record ArticleItem(
    int Id,
    string Name,
    string? Description,
    string? Code,
    decimal Price,
    bool IsActive);

public record AdditionalArticleDataCreate(
    int DocumentId,
    List<AdditionalInfoDto> InfoAdicional,
    int CreatedByUserId);

public record AdditionalArticleDataUpdate(
    int Id,
    int DocumentId,
    List<AdditionalInfoDto> InfoAdicional);

public record AdditionalArticleDataItem(
    int Id,
    int DocumentId,
    List<AdditionalInfoDto> InfoAdicional);

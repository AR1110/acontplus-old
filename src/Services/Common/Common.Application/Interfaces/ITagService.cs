namespace Common.Application.Interfaces;

public interface ITagService
{
    Task<Result<TagItem, DomainError>> AddAsync(TagCreate request, int createdByUserId, CancellationToken cancellationToken = default);
    Task<Result<dynamic, DomainError>> GetAsync();
    Task<Result<bool, DomainError>> DeleteAsync(int id);
    Task<Result<TagItem, DomainError>> UpdateAsync(int id, TagUpdate request, int updatedByUserId, CancellationToken cancellationToken = default);
}
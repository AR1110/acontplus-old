using Purchases.Application.Dtos.ReceivedDocuments;


namespace Purchases.Application.Interfaces;

public interface IReceivedDocumentService
{
    Task<Result<PagedResult<ReceivedDocumentItem>, DomainError>> GetAsync(PaginationRequest paginationRequest, CancellationToken cancellationToken = default);
    Task<Result<ReceivedDocumentItem, DomainError>> GetByIdAsync(int id, int userRoleId, CancellationToken cancellationToken = default);
    Task<Result<string, DomainError>> GetByIdXmlAsync(int id, int userRoleId, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> AddAsync(ReceivedDocumentCreate request, CancellationToken cancellationToken = default);
    Task<Result<ReceivedDocumentItem, DomainError>> UpdateAsync(int id, ReceivedDocumentUpdate request, int userRoleId, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> UpdateSubcategoryAsync(int id, ReceivedDocumentCategoryUpdate request, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id, int userRoleId, CancellationToken cancellationToken = default);
    Task<Result<ReceivedDocumentItem, DomainError>> MigrateAsync(ReceivedDocumentMigrate request, CancellationToken cancellationToken = default);
    Task<Result<byte[], DomainError>> DownloadAsync(int id, int userRoleId, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> UploadXmlAsync(string xmlContent, string accessKey, int establishmentId, int subcategoryId, int userRoleId, CancellationToken cancellationToken = default);
}

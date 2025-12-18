using Purchases.Application.Dtos.PurchaseInvoices;


namespace Purchases.Application.Interfaces;

public interface IPurchaseInvoiceService
{
    Task<Result<PagedResult<PurchaseInvoiceItem>, DomainError>> GetAsync(PaginationRequest paginationRequest, CancellationToken cancellationToken = default);
    Task<Result<PurchaseInvoiceItem, DomainError>> GetByIdAsync(int id, int userRoleId, CancellationToken cancellationToken = default);
    Task<Result<PurchaseInvoiceItem, DomainError>> AddAsync(PurchaseInvoiceCreate request, CancellationToken cancellationToken = default);
    Task<Result<PurchaseInvoiceItem, DomainError>> UpdateAsync(int id, PurchaseInvoiceUpdate request, int userRoleId, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id, int userRoleId, CancellationToken cancellationToken = default);
}

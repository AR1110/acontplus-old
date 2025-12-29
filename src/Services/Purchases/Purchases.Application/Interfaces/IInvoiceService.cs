using Purchases.Application.Dtos.Invoices;

namespace Purchases.Application.Interfaces;

public interface IInvoiceService
{
    Task<Result<PagedResult<InvoiceItem>, DomainError>> GetAsync(PaginationRequest paginationRequest, CancellationToken cancellationToken = default);
    Task<Result<InvoiceItem, DomainError>> GetByIdAsync(int id, int userRoleId, CancellationToken cancellationToken = default);
    Task<Result<InvoiceItem, DomainError>> AddAsync(InvoiceCreate request, CancellationToken cancellationToken = default);
    Task<Result<InvoiceItem, DomainError>> UpdateAsync(int id, InvoiceUpdate request, int userRoleId, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id, int userRoleId, CancellationToken cancellationToken = default);
}

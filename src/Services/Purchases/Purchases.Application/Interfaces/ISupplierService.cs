using Purchases.Application.Dtos.Suppliers;

namespace Purchases.Application.Interfaces;

public interface ISupplierService
{
    Task<Result<IReadOnlyList<SupplierItem>, DomainError>> GetAsync(int userRoleId, CancellationToken cancellationToken = default);
    Task<Result<SupplierItem, DomainError>> GetByIdAsync(int id, int userRoleId, CancellationToken cancellationToken = default);
    Task<Result<SupplierItem, DomainError>> AddAsync(SupplierCreate request, CancellationToken cancellationToken = default);
    Task<Result<SupplierItem, DomainError>> UpdateAsync(int id, SupplierUpdate request, int userRoleId, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id, int userRoleId, CancellationToken cancellationToken = default);
}

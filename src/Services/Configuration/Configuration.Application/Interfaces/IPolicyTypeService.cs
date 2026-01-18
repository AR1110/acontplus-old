namespace Configuration.Application.Interfaces;

public interface IPolicyTypeService
{
    Task<Result<PolicyType, DomainError>>
        AddAsync(PolicyTypeCreate request, CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<PolicyType>, DomainError>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Result<PolicyType, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<PolicyType, DomainError>> UpdateAsync(int id, PolicyTypeUpdate request,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> ExistsByCodeAsync(string code, CancellationToken cancellationToken = default,
        int? excludeId = null);
}

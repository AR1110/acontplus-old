namespace Configuration.Application.Interfaces;

public interface IDemoStepService
{
    Task<Result<DemoStepItem, DomainError>> AddAsync(DemoStepCreate request, IUserContext userContext, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<DemoStepItem>, DomainError>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Result<DemoStepItem, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<DemoStepItem, DomainError>> UpdateAsync(int id, DemoStepUpdate request, IUserContext userContext,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> ExistsByCodeAsync(string code, int? excludeId = null,
        CancellationToken cancellationToken = default);
}
using Sales.Application.Dtos;

namespace Sales.Application.Interfaces;

public interface ISuscripcionService
{
    Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters, CancellationToken cancellationToken = default);
    Task<Result<SubscriptionResponse, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<SubscriptionResponse, DomainError>> AddAsync(SuscripcionCreate request, int userId,
        CancellationToken cancellationToken = default);

    Task<Result<SubscriptionResponse, DomainError>> UpdateAsync(int id, SuscripcionUpdate request, int userId,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> DeleteAsync(int id, int userId, CancellationToken cancellationToken = default);
    Task<Result<SubscriptionResponse, DomainError>> PayAsync(int userId, int id, bool paid, CancellationToken cancellationToken = default);

    Task<Result<SubscriptionResponse, DomainError>> UpdateStatusAsync(int userId, int id, bool isActive,
        CancellationToken cancellationToken = default);
}
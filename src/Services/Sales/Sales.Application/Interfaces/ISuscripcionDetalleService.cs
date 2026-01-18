namespace Sales.Application.Interfaces;

public interface ISuscripcionDetalleService
{
    Task<Result<bool, DomainError>> DeleteAsync(int userId, int id);
    Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters);
}
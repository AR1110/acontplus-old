namespace Accounting.Domain.Repositories;

public interface IChequeRepository
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
}

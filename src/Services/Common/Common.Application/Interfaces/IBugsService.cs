using Acontplus.Core.Domain.Common.Results;

namespace Common.Application.Interfaces;

public interface IBugsService
{
    Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters);
}

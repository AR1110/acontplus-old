namespace Configuration.Application.Interfaces;

public interface IReportService
{
    Task<Result<dynamic, DomainError>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<Result<dynamic, DomainError>> AddAsync(ReportCreate request, CancellationToken cancellationToken = default);

    Task<Result<dynamic, DomainError>> UpdateAsync(int id, ReportUpdate request, CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default);
}

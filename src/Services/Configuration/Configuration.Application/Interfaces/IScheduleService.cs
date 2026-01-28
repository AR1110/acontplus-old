namespace Configuration.Application.Interfaces;

public interface IScheduleService
{
    Task<Result<IReadOnlyList<ScheduleItem>, DomainError>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Result<ScheduleItem, DomainError>> AddAsync(ScheduleCreate request, int createdByUserId, CancellationToken cancellationToken = default);
    Task<Result<ScheduleItem, DomainError>> UpdateAsync(int id, ScheduleUpdate request, int updatedByUserId, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id);
}

namespace Configuration.Application.Services;

public class ScheduleService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<ScheduleService> logger) : IScheduleService
{
    private readonly IRepository<Schedule> _scheduleRepository = unitOfWork.GetRepository<Schedule>();
    private readonly IMapper _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    private readonly ILogger<ScheduleService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    public async Task<Result<ScheduleItem, DomainError>> AddAsync(ScheduleCreate request, int createdByUserId, CancellationToken cancellationToken = default)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync();
        try
        {
            var schedule = _mapper.Map<ScheduleCreate, Schedule>(request);
            schedule.CreatedByUserId = createdByUserId;

            await _scheduleRepository.AddAsync(schedule);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();

            var response = _mapper.Map<Schedule, ScheduleItem>(schedule);
            return Result<ScheduleItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error adding schedule");
            return Result<ScheduleItem, DomainError>.Failure(DomainError.Internal("SCHEDULE_ADD_ERROR", ex.Message));
        }
    }

    public async Task<Result<ScheduleItem, DomainError>> UpdateAsync(int id, ScheduleUpdate request, int updatedByUserId, CancellationToken cancellationToken = default)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync();
        try
        {
            var scheduleFound = await _scheduleRepository.GetByIdAsync(id);
            if (scheduleFound == null)
            {
                return Result<ScheduleItem, DomainError>.Failure(DomainError.NotFound("SCHEDULE_NOT_FOUND", "Schedule not found"));
            }

            _mapper.Map(request, scheduleFound);
            scheduleFound.UpdatedByUserId = updatedByUserId;

            await _scheduleRepository.UpdateAsync(scheduleFound);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();

            var response = _mapper.Map<Schedule, ScheduleItem>(scheduleFound);
            return Result<ScheduleItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error updating schedule with ID {Id}", id);
            return Result<ScheduleItem, DomainError>.Failure(DomainError.Internal("SCHEDULE_UPDATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync();
        try
        {
            var schedule = await _scheduleRepository.GetByIdAsync(id);
            if (schedule == null)
            {
                return Result<bool, DomainError>.Failure(DomainError.NotFound("SCHEDULE_NOT_FOUND", "Schedule not found"));
            }
            await _scheduleRepository.DeleteAsync(schedule);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error deleting schedule with ID {Id}", id);
            return Result<bool, DomainError>.Failure(DomainError.Internal("SCHEDULE_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<IReadOnlyList<ScheduleItem>, DomainError>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var schedules = await _scheduleRepository.GetAllAsync(cancellationToken);
            var response = _mapper.Map<IReadOnlyList<ScheduleItem>>(schedules);
            return Result<IReadOnlyList<ScheduleItem>, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving schedule data");
            return Result<IReadOnlyList<ScheduleItem>, DomainError>.Failure(DomainError.Internal("SCHEDULE_GET_ERROR", ex.Message));
        }
    }
}

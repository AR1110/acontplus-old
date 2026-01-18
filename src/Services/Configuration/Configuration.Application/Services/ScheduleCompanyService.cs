namespace Configuration.Application.Services;

public class ScheduleCompanyService(IUnitOfWork unitOfWork) : IScheduleCompanyService
{
    private readonly IRepository<ScheduleCompany> _scheduleCompanyRepository = unitOfWork.GetRepository<ScheduleCompany>();
    private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;

    public async Task<Result<SpResponse, DomainError>> AddAsync(Dictionary<string, object> parameters)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var result = await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Config.ScheduleCompany_Insert", parameters);
            await transaction.CommitAsync();
            return Result<SpResponse, DomainError>.Success(result ?? new SpResponse { Code = "50000", Message = "No response from database" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<SpResponse, DomainError>.Failure(DomainError.Internal("ADD_SCHEDULE_COMPANY_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var scheduleCompany = await _scheduleCompanyRepository.GetByIdAsync(id);
            if (scheduleCompany == null)
                return Result<bool, DomainError>.Failure(DomainError.NotFound("SCHEDULECOMPANY_NOT_FOUND", "ScheduleCompany not found"));

            await _scheduleCompanyRepository.DeleteAsync(scheduleCompany);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<bool, DomainError>.Success(true, "Eliminado exitosamente");
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw new Exception("Error deleting ScheduleCompany");
        }
    }

    public async Task<Result<dynamic, DomainError>> GetByCompanyIdAsync(int companyId)
    {
        try
        {
            var scheduleCompanies = await _scheduleCompanyRepository.GetAllAsync();
            var filteredCompanies = scheduleCompanies.Where(x => x.CompanyId == companyId).ToList();

            return filteredCompanies == null || filteredCompanies.Count == 0
                ? Result<dynamic, DomainError>.Failure(DomainError.NotFound("SCHEDULE_COMPANY_NOT_FOUND", "ScheduleCompany not found"))
                : Result<dynamic, DomainError>.Success(filteredCompanies);
        }
        catch (Exception ex)
        {
            return Result<dynamic, DomainError>.Failure(DomainError.Internal("GET_SCHEDULE_COMPANY_ERROR", ex.Message));
        }
    }

    public async Task<Result<SpResponse, DomainError>> UpdateAsync(int id, ScheduleCompany scheduleCompany)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var scheduleCompanyToUpdate = await _scheduleCompanyRepository.GetByIdAsync(id);

            if (scheduleCompanyToUpdate == null)
                return Result<SpResponse, DomainError>.Failure(DomainError.NotFound("SCHEDULE_COMPANY_NOT_FOUND", "No se pudo actualizar"));

            scheduleCompanyToUpdate.CompanyId = scheduleCompany.CompanyId;
            scheduleCompanyToUpdate.ScheduleId = scheduleCompany.ScheduleId;
            scheduleCompanyToUpdate.StartTime = scheduleCompany.StartTime;
            scheduleCompanyToUpdate.EndTime = scheduleCompany.EndTime;
            scheduleCompanyToUpdate.IsActive = scheduleCompany.IsActive;
            scheduleCompanyToUpdate.UpdatedByUserId = scheduleCompany.UpdatedByUserId;
            await _scheduleCompanyRepository.UpdateAsync(scheduleCompanyToUpdate);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<SpResponse, DomainError>.Success(new SpResponse
            { Code = "0", Message = "Actualizado exitosamente", Payload = scheduleCompanyToUpdate.Id });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<SpResponse, DomainError>.Failure(DomainError.Internal("UPDATE_SCHEDULE_COMPANY_ERROR", ex.Message));
        }
    }
}

namespace Identity.Api.Interfaces;

public interface IScheduleCompanyService
{
    Task<Result<SpResponse, DomainError>> AddAsync(Dictionary<string, object> parameters);
    Task<Result<bool, DomainError>> DeleteAsync(int id);
    Task<Result<dynamic, DomainError>> GetByIdAsync(int CompanyId);
    Task<Result<SpResponse, DomainError>> UpdateAsync(int id, ScheduleCompany data);
}
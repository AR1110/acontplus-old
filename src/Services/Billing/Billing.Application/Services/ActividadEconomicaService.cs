namespace Billing.Application.Services;

public class ActividadEconomicaService(IUnitOfWork unitOfWork) : IActividadEconomicaService
{
    private readonly IAdoRepository _adoSqlServer = unitOfWork.AdoRepository;
    private const string ModuleName = "Sri.ActividadEconomica_";

    public async Task<Result<SpResponse, DomainError>> AddAsync(Dictionary<string, object> parameters)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var result = await _adoSqlServer.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Insert", parameters);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<SpResponse, DomainError>.Success(result ?? new SpResponse { Code = "50000", Message = "No response from database" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<SpResponse, DomainError>.Failure(DomainError.Internal("ACTIVIDAD_ECONOMICA_ADD_ERROR", ex.Message));
        }
    }

    public async Task<Result<SpResponse, DomainError>> DeleteAsync(Dictionary<string, object> parameters)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var result = await _adoSqlServer.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Delete", parameters);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<SpResponse, DomainError>.Success(result ?? new SpResponse { Code = "50000", Message = "No response from database" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<SpResponse, DomainError>.Failure(DomainError.Internal("ACTIVIDAD_ECONOMICA_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters)
    {
        try
        {
            var ds = await _adoSqlServer.GetDataSetAsync($"{ModuleName}Get", parameters);
            return DataValidation.DataSetIsNull(ds)
                ? Result<dynamic, DomainError>.Failure(DomainError.NotFound("ACTIVIDAD_ECONOMICA_NOT_FOUND", "No actividad economica data found"))
                : Result<dynamic, DomainError>.Success(DataConverters.DataSetToJson(ds));
        }
        catch (Exception ex)
        {
            return Result<dynamic, DomainError>.Failure(DomainError.Internal("ACTIVIDAD_ECONOMICA_GET_ERROR", ex.Message));
        }
    }

    public async Task<Result<SpResponse, DomainError>> UpdateAsync(Dictionary<string, object> parameters)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var result = await _adoSqlServer.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Update", parameters);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<SpResponse, DomainError>.Success(result ?? new SpResponse { Code = "50000", Message = "No response from database" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<SpResponse, DomainError>.Failure(DomainError.Internal("ACTIVIDAD_ECONOMICA_UPDATE_ERROR", ex.Message));
        }
    }
}

namespace Billing.Application.Services;

public class TarifaImpuestoService(IUnitOfWork unitOfWork) : ITarifaImpuestoService
{
    private readonly IAdoRepository _repository = unitOfWork.AdoRepository;
    private const string ModuleName = "Sri.TarifaImpuesto_";

    public async Task<Result<SpResponse, DomainError>> AddAsync(TarifaImpuesto tarifaImpuesto)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var parameters = new Dictionary<string, object>
            {
                { "json", DataConverters.SerializeObjectCustom<TarifaImpuesto>(tarifaImpuesto) }
            };
            var result = await _repository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Insert", parameters);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<SpResponse, DomainError>.Success(result ?? new SpResponse { Code = "50000", Message = "No response from database" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<SpResponse, DomainError>.Failure(DomainError.Internal("TARIFA_IMPUESTO_ADD_ERROR", ex.Message));
        }
    }

    public Task<Result<SpResponse, DomainError>> DeleteAsync(Dictionary<string, object> parameters)
    {
        throw new NotImplementedException();
    }

    public async Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters)
    {
        try
        {
            var ds = await _repository.GetDataSetAsync($"{ModuleName}Get", parameters);
            return DataValidation.DataSetIsNull(ds)
                ? Result<dynamic, DomainError>.Failure(DomainError.NotFound("TARIFA_IMPUESTO_NOT_FOUND", "No tarifa impuesto data found"))
                : Result<dynamic, DomainError>.Success(DataConverters.DataSetToJson(ds));
        }
        catch (Exception ex)
        {
            return Result<dynamic, DomainError>.Failure(DomainError.Internal("TARIFA_IMPUESTO_GET_ERROR", ex.Message));
        }
    }

    public async Task<Result<SpResponse, DomainError>> UpdateAsync(int id, TarifaImpuesto tarifaImpuesto)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var parameters = new Dictionary<string, object>
                {
                    { "id", id },
                    { "json", DataConverters.SerializeObjectCustom<TarifaImpuesto>(tarifaImpuesto) }
                }
                ;
            var result = await _repository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Update", parameters);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<SpResponse, DomainError>.Success(result ?? new SpResponse { Code = "50000", Message = "No response from database" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<SpResponse, DomainError>.Failure(DomainError.Internal("TARIFA_IMPUESTO_UPDATE_ERROR", ex.Message));
        }
    }
}

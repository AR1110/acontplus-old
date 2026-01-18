using Sales.Domain.Entities;

namespace Sales.Application.Services;

public class SuscripcionDetalleService(IUnitOfWork unitOfWork) : ISuscripcionDetalleService
{
    private readonly IRepository<SuscripcionDetalle> _suscripcionDetalleRepository = unitOfWork.GetRepository<SuscripcionDetalle>();
    private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;

    public async Task<Result<bool, DomainError>> DeleteAsync(int userId, int id)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var detail = await _suscripcionDetalleRepository.GetByIdAsync(id);

            if (detail == null) return Result<bool, DomainError>.Failure(DomainError.NotFound("SUSCRIPCION_DETALLE_NOT_FOUND", "No se encontró el detalle"));

            await _suscripcionDetalleRepository.DeleteAsync(detail);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<bool, DomainError>.Failure(DomainError.Internal("SUSCRIPCION_DETALLE_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters)
    {
        try
        {
            var ds = await _adoRepository.GetDataSetAsync("Sales.SuscripcionDetalle_Get", parameters);
            return DataValidation.DataSetIsNull(ds)
                ? Result<dynamic, DomainError>.Failure(DomainError.NotFound("SUSCRIPCION_DETALLE_NOT_FOUND", "No suscripcion detalle data found"))
                : Result<dynamic, DomainError>.Success(DataConverters.DataSetToJson(ds));
        }
        catch (Exception ex)
        {
            return Result<dynamic, DomainError>.Failure(DomainError.Internal("SUSCRIPCION_DETALLE_GET_ERROR", ex.Message));
        }
    }
}
namespace Configuration.Application.Services;

public class LicenciaDetalleService(IUnitOfWork unitOfWork) : ILicenciaDetalleService
{
    private readonly IRepository<LicenciaDetalle> _licenciaDetalleRepository = unitOfWork.GetRepository<LicenciaDetalle>();
    private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;

    public async Task<Result<SpResponse, DomainError>> AddAsync(LicenciaDetalle detalle)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            await _licenciaDetalleRepository.AddAsync(detalle);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<SpResponse, DomainError>.Success(new SpResponse { Code = "0", Message = "Registrada Exitosamente" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<SpResponse, DomainError>.Failure(DomainError.Internal("ADD_LICENCIA_DETALLE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, int userId)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var detalle = await _licenciaDetalleRepository.GetByIdAsync(id);

            if (detalle == null) return Result<bool, DomainError>.Failure(DomainError.NotFound("LICENCIA_DETALLE_NOT_FOUND", "No se encontró el detalle"));

            detalle.IsActive = false;
            detalle.IsDeleted = true;
            detalle.DeletedByUserId = userId;
            await _licenciaDetalleRepository.UpdateAsync(detalle);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<bool, DomainError>.Success(true, "Eliminada Exitosamente");
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<bool, DomainError>.Failure(DomainError.Internal("DELETE_LICENCIA_DETALLE_ERROR", ex.Message));
        }
    }

    public async Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters)
    {
        try
        {
            var ds = await _adoRepository.GetDataSetAsync("Config.Licencia_Detalle_Get", parameters);
            return DataValidation.DataSetIsNull(ds)
                ? Result<dynamic, DomainError>.Failure(DomainError.NotFound("LICENCIA_DETALLE_NOT_FOUND", "No se encontraron datos de licencia detalle"))
                : Result<dynamic, DomainError>.Success(DataConverters.DataSetToJson(ds));
        }
        catch (Exception ex)
        {
            return Result<dynamic, DomainError>.Failure(DomainError.Internal("GET_LICENCIA_DETALLE_ERROR", ex.Message));
        }
    }

    public async Task<Result<SpResponse, DomainError>> UpdateAsync(int id, LicenciaDetalle detalle)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var detalleFound = await _licenciaDetalleRepository.GetByIdAsync(id);
            if (detalleFound == null) return Result<SpResponse, DomainError>.Failure(DomainError.NotFound("LICENCIA_DETALLE_NOT_FOUND", "No se encontró el detalle"));

            detalleFound.LicenciaId = detalle.LicenciaId;
            detalleFound.AplicacionId = detalle.AplicacionId;
            detalleFound.TaxId = detalle.TaxId;
            detalleFound.TaxPercentId = detalle.TaxPercentId;
            detalleFound.Cost = detalle.Cost;
            detalleFound.Tax = detalle.Tax;
            detalleFound.Discount = detalle.Discount;
            detalleFound.Total = detalle.Total;
            detalleFound.UpdatedByUserId = detalle.UpdatedByUserId;
            detalleFound.IsActive = detalle.IsActive;
            await _licenciaDetalleRepository.UpdateAsync(detalleFound);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<SpResponse, DomainError>.Success(new SpResponse { Code = "0", Message = "Actualizada Exitosamente" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<SpResponse, DomainError>.Failure(DomainError.Internal("UPDATE_LICENCIA_DETALLE_ERROR", ex.Message));
        }
    }
}
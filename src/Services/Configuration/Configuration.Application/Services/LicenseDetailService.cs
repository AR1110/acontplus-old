namespace Configuration.Application.Services;

public class LicenseDetailService(IUnitOfWork unitOfWork) : ILicenseDetailService
{
    private readonly IRepository<LicenseDetails> _licenseDetailRepository = unitOfWork.GetRepository<LicenseDetails>();
    private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;

    public async Task<Result<SpResponse, DomainError>> AddAsync(LicenseDetails detail)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            await _licenseDetailRepository.AddAsync(detail);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<SpResponse, DomainError>.Success(new SpResponse { Code = "0", Message = "Registered Successfully" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<SpResponse, DomainError>.Failure(DomainError.Internal("ADD_LICENSE_DETAIL_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, int userId)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var detail = await _licenseDetailRepository.GetByIdAsync(id);

            if (detail == null) return Result<bool, DomainError>.Failure(DomainError.NotFound("LICENSE_DETAIL_NOT_FOUND", "Detail not found"));

            detail.IsActive = false;
            detail.IsDeleted = true;
            detail.DeletedByUserId = userId;
            await _licenseDetailRepository.UpdateAsync(detail);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<bool, DomainError>.Success(true, "Deleted Successfully");
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<bool, DomainError>.Failure(DomainError.Internal("DELETE_LICENSE_DETAIL_ERROR", ex.Message));
        }
    }

    public async Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters)
    {
        try
        {
            var ds = await _adoRepository.GetDataSetAsync("Config.Licencia_Detalle_Get", parameters);
            return DataValidation.DataSetIsNull(ds)
                ? Result<dynamic, DomainError>.Failure(DomainError.NotFound("LICENSE_DETAIL_NOT_FOUND", "No license detail data found"))
                : Result<dynamic, DomainError>.Success(DataConverters.DataSetToJson(ds));
        }
        catch (Exception ex)
        {
            return Result<dynamic, DomainError>.Failure(DomainError.Internal("GET_LICENSE_DETAIL_ERROR", ex.Message));
        }
    }

    public async Task<Result<SpResponse, DomainError>> UpdateAsync(int id, LicenseDetails detail)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var detailFound = await _licenseDetailRepository.GetByIdAsync(id);
            if (detailFound == null) return Result<SpResponse, DomainError>.Failure(DomainError.NotFound("LICENSE_DETAIL_NOT_FOUND", "Detail not found"));

            detailFound.LicenciaId = detail.LicenciaId;
            detailFound.AplicacionId = detail.AplicacionId;
            detailFound.TaxId = detail.TaxId;
            detailFound.TaxPercentId = detail.TaxPercentId;
            detailFound.Cost = detail.Cost;
            detailFound.Tax = detail.Tax;
            detailFound.Discount = detail.Discount;
            detailFound.Total = detail.Total;
            detailFound.UpdatedByUserId = detail.UpdatedByUserId;
            detailFound.IsActive = detail.IsActive;
            await _licenseDetailRepository.UpdateAsync(detailFound);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<SpResponse, DomainError>.Success(new SpResponse { Code = "0", Message = "Updated Successfully" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<SpResponse, DomainError>.Failure(DomainError.Internal("UPDATE_LICENSE_DETAIL_ERROR", ex.Message));
        }
    }
}

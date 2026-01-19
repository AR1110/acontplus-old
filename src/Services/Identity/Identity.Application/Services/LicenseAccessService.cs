using MapsterMapper;

namespace Identity.Application.Services;

public class LicenseAccessService(IUnitOfWork unitOfWork, IMapper mapper) : ILicenseAccessService
{
    private readonly IRepository<LicenseAccesses> _licenseAccessRepository = unitOfWork.GetRepository<LicenseAccesses>();
    private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;
    private readonly IMapper _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));

    public async Task<Result<LicenseAccessItem, DomainError>> AddAsync(LicenseAccessCreate request, int createdByUserId, CancellationToken cancellationToken = default)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var existingItems = await _licenseAccessRepository.GetAllAsync();
            if (existingItems.Any(x => x.LicenciaId == request.LicenciaId && x.RoleId == request.RoleId))
                return Result<LicenseAccessItem, DomainError>.Failure(DomainError.Validation("DuplicateLicenseRole", "Esta licencia y rol ya se encuentran registrados"));

            var licenseAccess = _mapper.Map<LicenseAccessCreate, LicenseAccesses>(request);
            licenseAccess.CreatedByUserId = createdByUserId;

            await _licenseAccessRepository.AddAsync(licenseAccess);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();

            var response = _mapper.Map<LicenseAccesses, LicenseAccessItem>(licenseAccess);
            return Result<LicenseAccessItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<LicenseAccessItem, DomainError>.Failure(DomainError.Internal("LICENSE_ACCESS_ADD_ERROR", ex.Message));
        }
    }

    public async Task<Result<LicenseAccessItem, DomainError>> UpdateAsync(int id, LicenseAccessUpdate request, int updatedByUserId, CancellationToken cancellationToken = default)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var accessLicense = await _licenseAccessRepository.GetByIdAsync(id);
            if (accessLicense == null)
                return Result<LicenseAccessItem, DomainError>.Failure(DomainError.NotFound("LICENSE_ACCESS_NOT_FOUND", "Registro no encontrado"));

            _mapper.Map(request, accessLicense);
            accessLicense.UpdatedByUserId = updatedByUserId;

            await _licenseAccessRepository.UpdateAsync(accessLicense);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();

            var response = _mapper.Map<LicenseAccesses, LicenseAccessItem>(accessLicense);
            return Result<LicenseAccessItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<LicenseAccessItem, DomainError>.Failure(DomainError.Internal("LICENSE_ACCESS_UPDATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var licenseAccessFound = await _licenseAccessRepository.GetByIdAsync(id);
            if (licenseAccessFound == null)
                return Result<bool, DomainError>.Failure(DomainError.NotFound("LICENSE_ACCESS_NOT_FOUND", "Registro no encontrado"));

            await _licenseAccessRepository.DeleteAsync(licenseAccessFound);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();

            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<bool, DomainError>.Failure(DomainError.Internal("LICENSE_ACCESS_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters)
    {
        try
        {
            var ds = await _adoRepository.GetDataSetAsync("Seguridad.LicenciaAcceso_Get", parameters);
            return DataValidation.DataSetIsNull(ds)
                ? Result<dynamic, DomainError>.Failure(DomainError.NotFound("LICENSE_ACCESS_NOT_FOUND", "No se encontraron datos de licencia de acceso"))
                : Result<dynamic, DomainError>.Success(DataConverters.DataSetToJson(ds));
        }
        catch (Exception ex)
        {
            return Result<dynamic, DomainError>.Failure(DomainError.Internal("LICENSE_ACCESS_GET_ERROR", ex.Message));
        }
    }
}

using MapsterMapper;

namespace Identity.Api.Services;

public class LicenciaAccesoService(IUnitOfWork unitOfWork, IMapper mapper) : ILicenciaAccesoService
{
    private readonly IRepository<LicenseAccesses> _licenciaAccesoRepository = unitOfWork.GetRepository<LicenseAccesses>();
    private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;
    private readonly IMapper _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));

    public async Task<Result<LicenciaAccesoItem, DomainError>> AddAsync(LicenciaAccesoCreate request, int createdByUserId, CancellationToken cancellationToken = default)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var existingItems = await _licenciaAccesoRepository.GetAllAsync();
            if (existingItems.Any(x =>
                    x.LicenciaId == request.LicenciaId && x.RoleId == request.RoleId))
                return Result<LicenciaAccesoItem, DomainError>.Failure(DomainError.Validation("DuplicateLicenseRole", "Esta licencia y rol ya se encuentran registrados"));

            var licenciaAcceso = _mapper.Map<LicenciaAccesoCreate, LicenseAccesses>(request);
            licenciaAcceso.CreatedByUserId = createdByUserId;

            await _licenciaAccesoRepository.AddAsync(licenciaAcceso);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();

            var response = _mapper.Map<LicenseAccesses, LicenciaAccesoItem>(licenciaAcceso);
            return Result<LicenciaAccesoItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<LicenciaAccesoItem, DomainError>.Failure(DomainError.Internal("LICENCIA_ACCESO_ADD_ERROR", ex.Message));
        }
    }

    public async Task<Result<LicenciaAccesoItem, DomainError>> UpdateAsync(int id, LicenciaAccesoUpdate request, int updatedByUserId, CancellationToken cancellationToken = default)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var accessLicense = await _licenciaAccesoRepository.GetByIdAsync(id);
            if (accessLicense == null)
                return Result<LicenciaAccesoItem, DomainError>.Failure(DomainError.NotFound("LICENCIA_ACCESO_NOT_FOUND", "Registro no encontrado"));

            _mapper.Map(request, accessLicense);
            accessLicense.UpdatedByUserId = updatedByUserId;

            await _licenciaAccesoRepository.UpdateAsync(accessLicense);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();

            var response = _mapper.Map<LicenseAccesses, LicenciaAccesoItem>(accessLicense);
            return Result<LicenciaAccesoItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<LicenciaAccesoItem, DomainError>.Failure(DomainError.Internal("LICENCIA_ACCESO_UPDATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var licenciaAccesoFound = await _licenciaAccesoRepository.GetByIdAsync(id);
            if (licenciaAccesoFound == null)
                return Result<bool, DomainError>.Failure(DomainError.NotFound("LICENCIA_ACCESO_NOT_FOUND", "Registro no encontrado"));

            await _licenciaAccesoRepository.DeleteAsync(licenciaAccesoFound);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();

            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<bool, DomainError>.Failure(DomainError.Internal("LICENCIA_ACCESO_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters)
    {
        try
        {
            var ds = await _adoRepository.GetDataSetAsync("Seguridad.LicenciaAcceso_Get", parameters);
            return DataValidation.DataSetIsNull(ds)
                ? Result<dynamic, DomainError>.Failure(DomainError.NotFound("LICENCIA_ACCESO_NOT_FOUND", "No se encontraron datos de licencia de acceso"))
                : Result<dynamic, DomainError>.Success(DataConverters.DataSetToJson(ds));
        }
        catch (Exception ex)
        {
            return Result<dynamic, DomainError>.Failure(DomainError.Internal("LICENCIA_ACCESO_GET_ERROR", ex.Message));
        }
    }
}

namespace Identity.Api.Services;

public class LicenciaAccesoDetalleService(IUnitOfWork unitOfWork, MapsterMapper.IMapper mapper) : ILicenciaAccesoDetalleService
{
    private readonly IRepository<LicenciaAccesoDetalle> _licenciaAccesoDetalleRepository = unitOfWork.GetRepository<LicenciaAccesoDetalle>();
    private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;
    private readonly MapsterMapper.IMapper _mapper = mapper;
    private const string ModuleName = "Seguridad.LicenciaAccesoDetalle";

    public async Task<Result<LicenciaAccesoDetalle, DomainError>> AddAsync(LicenciaAccesoDetalleCreate request)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var licenciaAccesoDetalle = _mapper.Map<LicenciaAccesoDetalleCreate, LicenciaAccesoDetalle>(request);
            if (licenciaAccesoDetalle == null)
                return Result<LicenciaAccesoDetalle, DomainError>.Failure(DomainError.Validation("INVALID_DATA", "No se recibieron datos"));

            //Validate if the record already exists
            var existingItems = await _licenciaAccesoDetalleRepository.GetAllAsync();
            if (existingItems.Any(x =>
                    x.LicenciaAccesoId == licenciaAccesoDetalle.LicenciaAccesoId &&
                    x.MenuId == licenciaAccesoDetalle.MenuId))
                return Result<LicenciaAccesoDetalle, DomainError>.Failure(DomainError.Validation("DUPLICATE_RECORD", "El registro ya existe"));

            await _licenciaAccesoDetalleRepository.AddAsync(licenciaAccesoDetalle);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<LicenciaAccesoDetalle, DomainError>.Success(licenciaAccesoDetalle);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<LicenciaAccesoDetalle, DomainError>.Failure(DomainError.Internal("LICENCIA_ACCESO_DETALLE_ADD_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var detalleFound = await _licenciaAccesoDetalleRepository.GetByIdAsync(id);
            if (detalleFound == null)
                return Result<bool, DomainError>.Failure(DomainError.NotFound("LICENCIA_ACCESO_DETALLE_NOT_FOUND", "Registro no encontrado"));

            await _licenciaAccesoDetalleRepository.DeleteAsync(detalleFound);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<bool, DomainError>.Failure(DomainError.Internal("LICENCIA_ACCESO_DETALLE_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters)
    {
        try
        {
            var response = await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}_Get", parameters);
            return response == null
                ? Result<dynamic, DomainError>.Failure(DomainError.NotFound("LICENCIA_ACCESO_DETALLE_NOT_FOUND", "No se encontraron datos"))
                : Result<dynamic, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<dynamic, DomainError>.Failure(DomainError.Internal("LICENCIA_ACCESO_DETALLE_GET_ERROR", ex.Message));
        }
    }

    public async Task<Result<LicenciaAccesoDetalle, DomainError>> UpdateAsync(int id, LicenciaAccesoDetalleUpdate request)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var detalleFound = await _licenciaAccesoDetalleRepository.GetByIdAsync(id);
            if (detalleFound == null)
                return Result<LicenciaAccesoDetalle, DomainError>.Failure(DomainError.NotFound("LICENCIA_ACCESO_DETALLE_NOT_FOUND", "Registro no encontrado"));

            var licenciaAccesoDetalle = _mapper.Map<LicenciaAccesoDetalleUpdate, LicenciaAccesoDetalle>(request);

            detalleFound.MenuId = licenciaAccesoDetalle.MenuId;
            detalleFound.Actions = licenciaAccesoDetalle.Actions;
            detalleFound.Order = licenciaAccesoDetalle.Order;
            detalleFound.IsActive = licenciaAccesoDetalle.IsActive;
            detalleFound.UpdatedByUserId = licenciaAccesoDetalle.UpdatedByUserId;
            await _licenciaAccesoDetalleRepository.UpdateAsync(detalleFound);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<LicenciaAccesoDetalle, DomainError>.Success(detalleFound);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<LicenciaAccesoDetalle, DomainError>.Failure(DomainError.Internal("LICENCIA_ACCESO_DETALLE_UPDATE_ERROR", ex.Message));
        }
    }
}
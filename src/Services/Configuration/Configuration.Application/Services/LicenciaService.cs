namespace Configuration.Application.Services;

public class LicenciaService : ILicenciaService
{
    private readonly IRepository<Licencia> _licenciaRepository;
    private readonly IRepository<Aplicacion> _aplicacionRepository;
    private readonly IRepository<LicenciaDetalle> _licenciaDetalleRepository;
    private readonly IRepository<LicenseType> _licenseTypeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<LicenciaService> _logger;
    private readonly IMapper _mapper;

    public LicenciaService(IUnitOfWork unitOfWork, ILogger<LicenciaService> logger, IMapper mapper)
    {
        ArgumentNullException.ThrowIfNull(unitOfWork);
        _unitOfWork = unitOfWork;
        _licenciaRepository = _unitOfWork.GetRepository<Licencia>();
        _licenciaDetalleRepository = _unitOfWork.GetRepository<LicenciaDetalle>();
        _aplicacionRepository = _unitOfWork.GetRepository<Aplicacion>();
        _licenseTypeRepository = _unitOfWork.GetRepository<LicenseType>();
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Result<LicenciaCreate, DomainError>> AddAsync(LicenciaCreate request, int createdByUserId,
        CancellationToken cancellationToken = default)
    {
        await using var tx = await _unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted, cancellationToken);
        try
        {
            var exists = await _licenciaRepository.GetFirstOrDefaultAsync(x => x.Code == request.Code && x.LicenseTypeId == request.LicenseTypeId, cancellationToken);
            if (exists != null)
                return Result<LicenciaCreate, DomainError>.Failure(DomainError.Conflict("LICENCIA_EXISTS", "Esta licencia ya se encuentra registrada"));

            if (request.Detalles == null || request.Detalles.Count == 0)
                return Result<LicenciaCreate, DomainError>.Failure(DomainError.Validation("LICENCIA_DETAIL_REQUIRED", "Debe agregar al menos un detalle"));

            var licenseType = await _licenseTypeRepository.GetByIdAsync(request.LicenseTypeId, cancellationToken);
            if (licenseType == null)
                return Result<LicenciaCreate, DomainError>.Failure(DomainError.Validation("LICENSETYPE_NOT_FOUND", "Tipo de licencia no existe"));

            var licencia = new Licencia
            {
                Id = 0,
                Code = request.Code,
                LicenseType = licenseType,
                LicenseTypeId = request.LicenseTypeId,
                Cost = request.Cost,
                Tax = request.Tax,
                Discount = request.Discount,
                Total = request.Total,
                CreatedByUserId = createdByUserId,
                IsActive = true
            };

            foreach (var d in request.Detalles)
            {
                var app = await _aplicacionRepository.GetByIdAsync(d.AplicacionId, cancellationToken);
                if (app == null)
                    return Result<LicenciaCreate, DomainError>.Failure(DomainError.Validation("APLICACION_NOT_FOUND", $"Aplicacion {d.AplicacionId} no existe"));
                licencia.LicenciaDetalles.Add(new LicenciaDetalle
                {
                    Id = 0,
                    Licencia = licencia,
                    Aplicacion = app,
                    AplicacionId = d.AplicacionId,
                    Cost = d.Cost,
                    Tax = d.Tax,
                    Discount = d.Discount,
                    Total = d.Total,
                    IsActive = true
                });
            }

            await _licenciaRepository.AddAsync(licencia, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await tx.CommitAsync(cancellationToken);

            return Result<LicenciaCreate, DomainError>.Success(_mapper.Map<LicenciaCreate>(licencia));
        }
        catch (Exception ex)
        {
            if (!tx.IsCompleted) await tx.RollbackAsync(cancellationToken);
            _logger.LogError(ex, "Error creating licencia");
            return Result<LicenciaCreate, DomainError>.Failure(DomainError.Internal("LICENCIA_CREATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        await using var tx = await _unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted, cancellationToken);
        try
        {
            var licencia = await _licenciaRepository.GetByIdAsync(id, cancellationToken);
            if (licencia == null)
                return Result<bool, DomainError>.Failure(DomainError.Validation("LICENCIA_NOT_FOUND", "Licencia no encontrada"));

            await _licenciaRepository.DeleteAsync(licencia, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await tx.CommitAsync(cancellationToken);
            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            if (!tx.IsCompleted) await tx.RollbackAsync(cancellationToken);
            _logger.LogError(ex, "Error deleting licencia {Id}", id);
            return Result<bool, DomainError>.Failure(DomainError.Internal("LICENCIA_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<IReadOnlyList<LicenciaItem>, DomainError>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var items = await _licenciaRepository.GetAllAsync(cancellationToken);
            var responses = items.Select(licencia => _mapper.Map<LicenciaItem>(licencia)).ToList();
            return Result<IReadOnlyList<LicenciaItem>, DomainError>.Success(responses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting licencias");
            return Result<IReadOnlyList<LicenciaItem>, DomainError>.Failure(DomainError.Internal("LICENCIA_GETALL_ERROR", ex.Message));
        }
    }

    public async Task<Result<LicenciaItem, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var licencia = await _licenciaRepository.GetByIdAsync(id, cancellationToken);
            return licencia == null
                ? Result<LicenciaItem, DomainError>.Failure(DomainError.NotFound("LICENCIA_NOT_FOUND", "Licencia no encontrada"))
                : Result<LicenciaItem, DomainError>.Success(_mapper.Map<LicenciaItem>(licencia));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting licencia {Id}", id);
            return Result<LicenciaItem, DomainError>.Failure(DomainError.Internal("LICENCIA_GETBYID_ERROR", ex.Message));
        }
    }

    public async Task<Result<LicenciaUpdate, DomainError>> UpdateAsync(int id, LicenciaUpdate request, int updatedByUserId,
        CancellationToken cancellationToken = default)
    {
        await using var tx = await _unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted, cancellationToken);
        try
        {
            var licencia = await _licenciaRepository.GetByIdAsync(id, cancellationToken);
            if (licencia == null)
                return Result<LicenciaUpdate, DomainError>.Failure(DomainError.NotFound("LICENCIA_NOT_FOUND", "Licencia no encontrada"));

            if (request.Detalles == null || request.Detalles.Count == 0)
                return Result<LicenciaUpdate, DomainError>.Failure(DomainError.Validation("LICENCIA_DETAIL_REQUIRED", "Debe agregar al menos un detalle"));

            var licenseType = await _licenseTypeRepository.GetByIdAsync(request.LicenseTypeId, cancellationToken);
            if (licenseType == null)
                return Result<LicenciaUpdate, DomainError>.Failure(DomainError.Validation("LICENSETYPE_NOT_FOUND", "Tipo de licencia no existe"));

            licencia.Code = request.Code;
            licencia.LicenseTypeId = request.LicenseTypeId;
            licencia.Cost = request.Cost;
            licencia.Tax = request.Tax;
            licencia.Discount = request.Discount;
            licencia.Total = request.Total;
            licencia.UpdatedByUserId = updatedByUserId;

            // Replace details: simple approach
            var existing = licencia.LicenciaDetalles.ToList();
            foreach (var e in existing)
            {
                await _licenciaDetalleRepository.DeleteAsync(e, cancellationToken);
            }

            licencia.LicenciaDetalles.Clear();
            foreach (var d in request.Detalles)
            {
                var app = await _aplicacionRepository.GetByIdAsync(d.AplicacionId, cancellationToken);
                if (app == null)
                    return Result<LicenciaUpdate, DomainError>.Failure(DomainError.Validation("APLICACION_NOT_FOUND", $"Aplicacion {d.AplicacionId} no existe"));
                licencia.LicenciaDetalles.Add(new LicenciaDetalle
                {
                    Id = 0,
                    Licencia = licencia,
                    Aplicacion = app,
                    AplicacionId = d.AplicacionId,
                    Cost = d.Cost,
                    Tax = d.Tax,
                    Discount = d.Discount,
                    Total = d.Total,
                    IsActive = true
                });
            }

            await _licenciaRepository.UpdateAsync(licencia, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await tx.CommitAsync(cancellationToken);
            return Result<LicenciaUpdate, DomainError>.Success(_mapper.Map<LicenciaUpdate>(licencia));
        }
        catch (Exception ex)
        {
            if (!tx.IsCompleted) await tx.RollbackAsync(cancellationToken);
            _logger.LogError(ex, "Error updating licencia {Id}", id);
            return Result<LicenciaUpdate, DomainError>.Failure(DomainError.Internal("LICENCIA_UPDATE_ERROR", ex.Message));
        }
    }
}



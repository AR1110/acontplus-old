namespace Sales.Application.Services;

public class SuscripcionService : ISuscripcionService
{
    private readonly IAdoRepository _adoRepository;
    private readonly ILogger<SuscripcionService> _logger;
    private readonly IMapper _mapper;
    private readonly IRepository<SuscripcionDetalle> _suscripcionDetalleRepository;
    private readonly IRepository<Suscripcion> _suscripcionRepository;
    private readonly IUnitOfWork _unitOfWork;

    public SuscripcionService(IUnitOfWork unitOfWork, ILogger<SuscripcionService> logger, IMapper mapper)
    {
        ArgumentNullException.ThrowIfNull(unitOfWork);
        _unitOfWork = unitOfWork;
        _suscripcionRepository = unitOfWork.GetRepository<Suscripcion>();
        _suscripcionDetalleRepository = unitOfWork.GetRepository<SuscripcionDetalle>();
        _adoRepository = unitOfWork.AdoRepository;
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var ds = await _adoRepository.GetDataSetAsync("Sales.Suscripcion_Get", parameters);
            return DataValidation.DataSetIsNull(ds)
                ? Result<dynamic, DomainError>.Failure(DomainError.NotFound("SUSCRIPCION_NOT_FOUND", "No suscripcion data found"))
                : Result<dynamic, DomainError>.Success(DataConverters.DataSetToJson(ds));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting suscripciones");
            return Result<dynamic, DomainError>.Failure(DomainError.Internal("SUSCRIPCION_GET_ERROR", ex.Message));
        }
    }

    public async Task<Result<SubscriptionResponse, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var subscription = await _suscripcionRepository.GetFirstOrDefaultAsync(s => s.Id == id, cancellationToken);
            if (subscription == null)
                return Result<SubscriptionResponse, DomainError>.Failure(DomainError.NotFound("SUSCRIPCION_NOT_FOUND", "No se encontró la suscripción"));

            var response = _mapper.Map<SubscriptionResponse>(subscription);
            return Result<SubscriptionResponse, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting suscripcion by id {Id}", id);
            return Result<SubscriptionResponse, DomainError>.Failure(DomainError.Internal("SUSCRIPCION_GET_BY_ID_ERROR", ex.Message));
        }
    }

    public async Task<Result<SubscriptionResponse, DomainError>> AddAsync(SuscripcionCreate request, int userId,
        CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var suscripcion = _mapper.Map<Suscripcion>(request);
            suscripcion.CreatedByUserId = userId;
            suscripcion.IsActive = true;
            suscripcion.IsDeleted = false;

            // Map and add suscripcion detalles
            if (request.SuscripcionDetalles.Any())
                foreach (var detalleDto in request.SuscripcionDetalles)
                {
                    var detalle = _mapper.Map<SuscripcionDetalle>(detalleDto);
                    detalle.CreatedByUserId = userId;
                    detalle.IsActive = true;
                    detalle.IsDeleted = false;
                    suscripcion.SuscripcionDetalles.Add(detalle);
                }

            await _suscripcionRepository.AddAsync(suscripcion, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            var suscripcionResponse = _mapper.Map<SubscriptionResponse>(suscripcion);
            return Result<SubscriptionResponse, DomainError>.Success(suscripcionResponse);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error creating suscripcion");
            return Result<SubscriptionResponse, DomainError>.Failure(DomainError.Internal("SUSCRIPCION_ADD_ERROR", ex.Message));
        }
    }

    public async Task<Result<SubscriptionResponse, DomainError>> UpdateAsync(int id, SuscripcionUpdate request, int userId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var existingSuscripcion =
                await _suscripcionRepository.GetFirstOrDefaultAsync(x => x.Id == id, cancellationToken,
                    x => x.SuscripcionDetalles);
            if (existingSuscripcion == null)
                return Result<SubscriptionResponse, DomainError>.Failure(DomainError.NotFound("SUSCRIPCION_NOT_FOUND", "No se encontró la suscripción"));

            // Update main suscripcion properties
            existingSuscripcion.SubscriptionTypeId = request.SubscriptionTypeId;
            existingSuscripcion.CompanyId = request.CompanyId;
            existingSuscripcion.StartDate = request.StartDate;
            existingSuscripcion.EndDate = request.EndDate;
            existingSuscripcion.MaxPaymentDate = request.MaxPaymentDate;
            existingSuscripcion.Cost = request.Cost;
            existingSuscripcion.Tax = request.Tax;
            existingSuscripcion.Discount = request.Discount;
            existingSuscripcion.Total = request.Total;
            existingSuscripcion.Paid = request.Paid;
            existingSuscripcion.WarningMessage = request.WarningMessage;
            existingSuscripcion.IsActive = request.IsActive;
            existingSuscripcion.UpdatedByUserId = userId;

            var existingDetallesDict = existingSuscripcion.SuscripcionDetalles.ToDictionary(x => x.Id, x => x);

            // Create a set of IDs from the request for tracking what should be kept
            var requestDetalleIds = request.SuscripcionDetalles
                .Where(d => d.Id > 0)
                .Select(d => d.Id)
                .ToHashSet();

            // Remove detalles that are no longer in the request
            var detallesToRemove = existingSuscripcion.SuscripcionDetalles
                .Where(existing => !requestDetalleIds.Contains(existing.Id))
                .ToList();

            foreach (var detalle in detallesToRemove)
            {
                detalle.IsDeleted = true;
                detalle.DeletedByUserId = userId;
                detalle.DeletedAt = DateTime.UtcNow;
                await _suscripcionDetalleRepository.UpdateAsync(detalle, cancellationToken);
            }

            // Update existing detalles and add new ones
            foreach (var detalleDto in request.SuscripcionDetalles)
                if (detalleDto.Id > 0 && existingDetallesDict.TryGetValue(detalleDto.Id, out var existingDetalle))
                {
                    // Update existing detalle
                    existingDetalle.LicenciaDetalleId = detalleDto.LicenciaDetalleId;
                    existingDetalle.StartDate = detalleDto.StartDate;
                    existingDetalle.EndDate = detalleDto.EndDate;
                    existingDetalle.MaxPaymentDate = detalleDto.MaxPaymentDate;
                    existingDetalle.Cost = detalleDto.Cost;
                    existingDetalle.Tax = detalleDto.Tax;
                    existingDetalle.Discount = detalleDto.Discount;
                    existingDetalle.Total = detalleDto.Total;
                    existingDetalle.Paid = detalleDto.Paid;
                    existingDetalle.UpdatedByUserId = userId;
                    existingDetalle.UpdatedAt = DateTime.UtcNow;

                    await _suscripcionDetalleRepository.UpdateAsync(existingDetalle, cancellationToken);
                }
                else
                {
                    // Create new detalle
                    var newDetalle = _mapper.Map<SuscripcionDetalle>(detalleDto);
                    newDetalle.SuscripcionId = id;
                    newDetalle.CreatedByUserId = userId;
                    newDetalle.IsActive = true;
                    newDetalle.IsDeleted = false;

                    await _suscripcionDetalleRepository.AddAsync(newDetalle, cancellationToken);
                }

            await _suscripcionRepository.UpdateAsync(existingSuscripcion, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var suscripcionResponse = _mapper.Map<SubscriptionResponse>(existingSuscripcion);
            return Result<SubscriptionResponse, DomainError>.Success(suscripcionResponse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating suscripcion {Id}", id);
            return Result<SubscriptionResponse, DomainError>.Failure(DomainError.Internal("SUSCRIPCION_UPDATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, int userId, CancellationToken cancellationToken = default)
    {
        try
        {
            var suscripcion = await _suscripcionRepository.GetByIdAsync(id, cancellationToken);
            if (suscripcion == null)
                return Result<bool, DomainError>.Failure(DomainError.NotFound("SUSCRIPCION_NOT_FOUND", "No se encontró la suscripción"));

            await _suscripcionRepository.DeleteAsync(suscripcion, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting suscripcion {Id}", id);
            return Result<bool, DomainError>.Failure(DomainError.Internal("SUSCRIPCION_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<SubscriptionResponse, DomainError>> PayAsync(int userId, int id, bool paid, CancellationToken cancellationToken = default)
    {
        try
        {
            var suscripcion = await _suscripcionRepository.GetByIdAsync(id, cancellationToken);
            if (suscripcion == null)
                return Result<SubscriptionResponse, DomainError>.Failure(DomainError.NotFound("SUSCRIPCION_NOT_FOUND", "No se encontró la suscripción"));

            suscripcion.Paid = paid;
            suscripcion.UpdatedByUserId = userId;
            await _suscripcionRepository.UpdateAsync(suscripcion, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var suscripcionResponse = _mapper.Map<SubscriptionResponse>(suscripcion);
            return Result<SubscriptionResponse, DomainError>.Success(suscripcionResponse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating payment status for suscripcion {Id}", id);
            return Result<SubscriptionResponse, DomainError>.Failure(DomainError.Internal("SUSCRIPCION_PAY_ERROR", ex.Message));
        }
    }

    public async Task<Result<SubscriptionResponse, DomainError>> UpdateStatusAsync(int userId, int id, bool isActive,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var suscripcion = await _suscripcionRepository.GetByIdAsync(id, cancellationToken);
            if (suscripcion == null)
                return Result<SubscriptionResponse, DomainError>.Failure(DomainError.NotFound("SUSCRIPCION_NOT_FOUND", "No se encontró la suscripción"));

            suscripcion.IsActive = isActive;
            suscripcion.UpdatedByUserId = userId;
            await _suscripcionRepository.UpdateAsync(suscripcion, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var suscripcionResponse = _mapper.Map<SubscriptionResponse>(suscripcion);
            return Result<SubscriptionResponse, DomainError>.Success(suscripcionResponse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating status for suscripcion {Id}", id);
            return Result<SubscriptionResponse, DomainError>.Failure(DomainError.Internal("SUSCRIPCION_STATUS_UPDATE_ERROR", ex.Message));
        }
    }
}

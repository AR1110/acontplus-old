namespace Configuration.Application.Services;

public class Ec2InstanceService : IEc2InstanceService
{
    private readonly IRepository<Ec2Instance> _ec2InstanceRepository;
    private readonly IAdoRepository _adoRepository;
    private readonly ILogger<Ec2InstanceService> _logger;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public Ec2InstanceService(IUnitOfWork unitOfWork, ILogger<Ec2InstanceService> logger, IMapper mapper)
    {
        ArgumentNullException.ThrowIfNull(unitOfWork);
        _unitOfWork = unitOfWork;
        _ec2InstanceRepository = unitOfWork.GetRepository<Ec2Instance>();
        _adoRepository = unitOfWork.AdoRepository;
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Result<Ec2InstanceItem, DomainError>> AddAsync(Ec2InstanceCreate request, IUserContext userContext, CancellationToken cancellationToken = default)
    {
        await using var transaction = await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var ec2Instance = _mapper.Map<Ec2InstanceCreate, Ec2Instance>(request);
            ec2Instance.CreatedByUserId = userContext.GetUserId();

            // Validate unique instance ID
            var existsByInstanceId = await ExistsAsync(ec2Instance.InstanceId, cancellationToken: cancellationToken);
            if (existsByInstanceId.IsSuccess && existsByInstanceId.Value)
                return Result<Ec2InstanceItem, DomainError>.Failure(DomainError.Validation("EC2_INSTANCE_ID_EXISTS", $"La instancia {ec2Instance.InstanceId} ya existe"));

            await _ec2InstanceRepository.AddAsync(ec2Instance, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            var response = _mapper.Map<Ec2Instance, Ec2InstanceItem>(ec2Instance);
            return Result<Ec2InstanceItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error creating EC2 instance");
            return Result<Ec2InstanceItem, DomainError>.Failure(DomainError.Internal("EC2_INSTANCE_CREATE_ERROR", "Error al crear la instancia EC2"));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        await using var transaction = await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var ec2Instance = await _ec2InstanceRepository.GetByIdAsync(id, cancellationToken);
            if (ec2Instance == null)
                return Result<bool, DomainError>.Failure(DomainError.NotFound("EC2_INSTANCE_NOT_FOUND", $"Instancia EC2 con ID {id} no encontrada"));

            await _ec2InstanceRepository.DeleteAsync(ec2Instance, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error deleting EC2 instance with ID {Id}", id);
            return Result<bool, DomainError>.Failure(DomainError.Internal("EC2_INSTANCE_DELETE_ERROR", "Error al eliminar la instancia EC2"));
        }
    }

    public async Task<Result<IReadOnlyList<Ec2Instance>, DomainError>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var ec2Instances = await _ec2InstanceRepository.GetAllAsync(cancellationToken);
            return Result<IReadOnlyList<Ec2Instance>, DomainError>.Success(ec2Instances);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving EC2 instances");
            return Result<IReadOnlyList<Ec2Instance>, DomainError>.Failure(DomainError.Internal("EC2_INSTANCE_GET_ALL_ERROR", "Error al obtener las instancias EC2"));
        }
    }

    public async Task<Result<Ec2Instance, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var ec2Instance = await _ec2InstanceRepository.GetByIdAsync(id, cancellationToken);
            return ec2Instance == null
                ? Result<Ec2Instance, DomainError>.Failure(DomainError.NotFound("EC2_INSTANCE_NOT_FOUND", $"Instancia EC2 con ID {id} no encontrada"))
                : Result<Ec2Instance, DomainError>.Success(ec2Instance);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving EC2 instance with ID {Id}", id);
            return Result<Ec2Instance, DomainError>.Failure(DomainError.Internal("EC2_INSTANCE_GET_ERROR", "Error al obtener la instancia EC2"));
        }
    }

    public async Task<Result<Ec2InstanceItem, DomainError>> UpdateAsync(int id, Ec2InstanceUpdate request, IUserContext userContext, CancellationToken cancellationToken = default)
    {
        await using var transaction = await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var existingEc2Instance = await _ec2InstanceRepository.GetByIdAsync(id, cancellationToken);
            if (existingEc2Instance == null)
                return Result<Ec2InstanceItem, DomainError>.Failure(DomainError.NotFound("EC2_INSTANCE_NOT_FOUND", $"Instancia EC2 con ID {id} no encontrada"));

            // Validate unique instance ID if it's being changed
            if (existingEc2Instance.InstanceId != request.InstanceId)
            {
                var existsByInstanceId = await ExistsAsync(request.InstanceId, id, cancellationToken);
                if (existsByInstanceId.IsSuccess && existsByInstanceId.Value)
                    return Result<Ec2InstanceItem, DomainError>.Failure(DomainError.Validation("EC2_INSTANCE_ID_EXISTS", $"La instancia {request.InstanceId} ya existe"));
            }

            // Update properties
            existingEc2Instance.Region = request.Region;
            existingEc2Instance.InstanceId = request.InstanceId;
            existingEc2Instance.InstanceName = request.InstanceName;
            existingEc2Instance.InstanceType = request.InstanceType;
            existingEc2Instance.IpAddress = request.IpAddress;
            existingEc2Instance.UrlStart = request.UrlStart;
            existingEc2Instance.UrlStop = request.UrlStop;
            existingEc2Instance.UpdatedAt = DateTime.UtcNow;
            existingEc2Instance.UpdatedByUserId = userContext.GetUserId();

            await _ec2InstanceRepository.UpdateAsync(existingEc2Instance, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            var response = _mapper.Map<Ec2Instance, Ec2InstanceItem>(existingEc2Instance);
            return Result<Ec2InstanceItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error updating EC2 instance with ID {Id}", id);
            return Result<Ec2InstanceItem, DomainError>.Failure(DomainError.Internal("EC2_INSTANCE_UPDATE_ERROR", "Error al actualizar la instancia EC2"));
        }
    }

    public async Task<Result<bool, DomainError>> UpdateExternalAsync(List<Ec2InstanceItem> instances, CancellationToken cancellationToken = default)
    {
        await using var transaction = await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            foreach (var item in instances)
            {
                var ec2Instance = await _ec2InstanceRepository.GetFirstOrDefaultAsync(x => x.InstanceId == item.InstanceId, cancellationToken);
                if (ec2Instance == null) continue;

                ec2Instance.IsActive = item.IsActive;
                if (item.IsActive)
                    ec2Instance.IpAddress = item.IpAddress;

                ec2Instance.UpdatedAt = DateTime.UtcNow;
                await _ec2InstanceRepository.UpdateAsync(ec2Instance, cancellationToken);
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error updating external EC2 instances");
            return Result<bool, DomainError>.Failure(DomainError.Internal("EC2_INSTANCE_EXTERNAL_UPDATE_ERROR", "Error al actualizar las instancias EC2 externas"));
        }
    }

    public async Task<Result<bool, DomainError>> ExistsAsync(string instanceId, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        try
        {
            var exists = await _ec2InstanceRepository.GetFirstOrDefaultAsync(x => x.InstanceId == instanceId && (excludeId == null || x.Id != excludeId), cancellationToken) != null;
            return Result<bool, DomainError>.Success(exists);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking EC2 instance existence for InstanceId {InstanceId}", instanceId);
            return Result<bool, DomainError>.Failure(DomainError.Internal("EC2_INSTANCE_EXISTS_ERROR", "Error al verificar la existencia de la instancia EC2"));
        }
    }
}

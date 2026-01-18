using Microsoft.Extensions.Caching.Memory;

namespace Configuration.Application.Services;

public class SistemaService : ISistemaService
{
    private const string CacheKey = "sistemas_all";
    private static readonly TimeSpan CacheExpiration = TimeSpan.FromMinutes(15);
    private readonly IAdoRepository _adoRepository;
    private readonly IRepository<Aplicacion> _aplicacionRepository;
    private readonly IMemoryCache _cache;
    private readonly ILogger<SistemaService> _logger;
    private readonly IRepository<Sistema> _sistemaRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly MapsterMapper.IMapper _mapper;

    public SistemaService(
        IUnitOfWork unitOfWork,
        IMemoryCache cache,
        ILogger<SistemaService> logger,
        MapsterMapper.IMapper mapper)
    {
        ArgumentNullException.ThrowIfNull(unitOfWork);
        ArgumentNullException.ThrowIfNull(cache);
        ArgumentNullException.ThrowIfNull(mapper);

        _unitOfWork = unitOfWork;
        _sistemaRepository = unitOfWork.GetRepository<Sistema>();
        _aplicacionRepository = unitOfWork.GetRepository<Aplicacion>();
        _adoRepository = unitOfWork.AdoRepository;
        _cache = cache;
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Result<IReadOnlyList<SistemaItem>, DomainError>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Try to get from cache first
            if (_cache.TryGetValue(CacheKey, out IReadOnlyList<SistemaItem>? cachedResult) && cachedResult != null)
            {
                _logger.LogDebug("Retrieved sistemas from cache");
                return Result<IReadOnlyList<SistemaItem>, DomainError>.Success(cachedResult);
            }

            // Get from database with includes
            var sistemas = await _sistemaRepository.GetAllAsync(cancellationToken);

            if (!sistemas.Any())
                return Result<IReadOnlyList<SistemaItem>, DomainError>.Success(Array.Empty<SistemaItem>());

            // Map to DTOs
            var response = sistemas.Select(x => _mapper.Map<SistemaItem>(x)).ToList();

            // Cache the result
            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(CacheExpiration)
                .SetPriority(CacheItemPriority.Normal);

            _cache.Set(CacheKey, response, cacheEntryOptions);
            _logger.LogDebug("Cached sistemas for {Duration} minutes", CacheExpiration.TotalMinutes);

            return Result<IReadOnlyList<SistemaItem>, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving sistemas");
            return Result<IReadOnlyList<SistemaItem>, DomainError>.Failure(DomainError.Internal(
                "SISTEMA_GET_ERROR",
                ex.Message
            ));
        }
    }

    public async Task<Result<SistemaItem, DomainError>> GetByIdAsync(int id,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var sistema = await _sistemaRepository.GetByIdAsync(id, cancellationToken);
            if (sistema == null)
                return Result<SistemaItem, DomainError>.Failure(DomainError.Validation(
                    "SISTEMA_NOT_FOUND",
                    "Sistema no encontrado"));

            var response = _mapper.Map<SistemaItem>(sistema);
            return Result<SistemaItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving sistema with ID {Id}", id);
            return Result<SistemaItem, DomainError>.Failure(DomainError.Internal(
                "SISTEMA_GET_BY_ID_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<SistemaItem, DomainError>> AddAsync(SistemaCreate request, int userId,
        CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            // Validate unique code
            var existsByCode = await ExistsAsync(request.Code, request.Name, null, cancellationToken);
            if (existsByCode.IsSuccess && existsByCode.Value)
                return Result<SistemaItem, DomainError>.Failure(DomainError.Validation(
                    "SISTEMA_CODE_EXISTS",
                    $"El código {request.Code} ya existe"));

            // Create new sistema
            var sistema = new Sistema
            {
                Id = 0, // Will be set by EF Core
                Code = request.Code,
                Name = request.Name,
                DomainUrl = request.DomainUrl,
                IpAddress = request.IpAddress ?? string.Empty,
                ConnectionStrings = request.ConnectionStrings,
                CreatedByUserId = userId,
                IsActive = true,
                IsDeleted = false
            };

            await _sistemaRepository.AddAsync(sistema, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            // Invalidate cache
            _cache.Remove(CacheKey);

            var response = _mapper.Map<SistemaItem>(sistema);
            return Result<SistemaItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted)
                await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error creating sistema");
            return Result<SistemaItem, DomainError>.Failure(DomainError.Internal(
                "SISTEMA_CREATE_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<SistemaItem, DomainError>> UpdateAsync(int id, SistemaUpdate request,
        int userId, CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var existingSistema = await _sistemaRepository.GetByIdAsync(id, cancellationToken);
            if (existingSistema == null)
                return Result<SistemaItem, DomainError>.Failure(DomainError.Validation(
                    "SISTEMA_NOT_FOUND",
                    "Sistema no encontrado"));

            // Validate unique code (excluding current item)
            var existsByCode = await ExistsAsync(request.Code, request.Name, id, cancellationToken);
            if (existsByCode.IsSuccess && existsByCode.Value)
                return Result<SistemaItem, DomainError>.Failure(DomainError.Validation(
                    "SISTEMA_CODE_EXISTS",
                    $"El código {request.Code} ya existe"));

            // Update properties
            existingSistema.Code = request.Code;
            existingSistema.Name = request.Name;
            existingSistema.DomainUrl = request.DomainUrl;
            existingSistema.IpAddress = request.IpAddress ?? string.Empty;
            existingSistema.ConnectionStrings = request.ConnectionStrings;
            existingSistema.UpdatedByUserId = userId;
            existingSistema.UpdatedAt = DateTime.UtcNow;

            await _sistemaRepository.UpdateAsync(existingSistema, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            // Invalidate cache
            _cache.Remove(CacheKey);

            var response = _mapper.Map<SistemaItem>(existingSistema);
            return Result<SistemaItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted)
                await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error updating sistema with ID {Id}", id);
            return Result<SistemaItem, DomainError>.Failure(DomainError.Internal(
                "SISTEMA_UPDATE_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, int userId,
        CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var sistema = await _sistemaRepository.GetByIdAsync(id, cancellationToken);
            if (sistema == null)
                return Result<bool, DomainError>.Failure(DomainError.Validation(
                    "SISTEMA_NOT_FOUND",
                    "Sistema no encontrado"));

            // Check if sistema has aplicaciones
            var aplicaciones = await _aplicacionRepository.GetAllAsync(cancellationToken);
            var sistemaAplicaciones = aplicaciones.Where(x => x.SistemaId == id && !x.IsDeleted).ToList();

            if (sistemaAplicaciones.Any())
                return Result<bool, DomainError>.Failure(DomainError.Validation(
                    "SISTEMA_HAS_APLICACIONES",
                    "No se puede eliminar el sistema porque tiene aplicaciones asociadas"));

            // Soft delete
            sistema.IsActive = false;
            sistema.IsDeleted = true;
            sistema.UpdatedByUserId = userId;
            sistema.UpdatedAt = DateTime.UtcNow;

            await _sistemaRepository.UpdateAsync(sistema, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            // Invalidate cache
            _cache.Remove(CacheKey);

            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted)
                await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error deleting sistema with ID {Id}", id);
            return Result<bool, DomainError>.Failure(DomainError.Internal(
                "SISTEMA_DELETE_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> ExistsAsync(string code, string name, int? excludeId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var query = "SELECT COUNT(1) FROM Config.Sistema WHERE (Code = @Code OR Name = @Name) AND IsDeleted = 0";
            var parameters = new Dictionary<string, object>
            {
                { "@Code", code },
                { "@Name", name }
            };

            if (excludeId.HasValue)
            {
                query += " AND Id != @ExcludeId";
                parameters.Add("@ExcludeId", excludeId.Value);
            }

            var count = await _adoRepository.QuerySingleOrDefaultAsync<object>(query, parameters);
            return Result<bool, DomainError>.Success(count != null && Convert.ToInt32(count) > 0);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if sistema exists");
            return Result<bool, DomainError>.Failure(DomainError.Internal(
                "SISTEMA_EXISTS_ERROR",
                ex.Message));
        }
    }

    // Mapping handled by Mapster profiles
}

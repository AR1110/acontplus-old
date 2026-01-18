using Configuration.Application.Dtos;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace Configuration.Application.Services;

public class AplicacionService : IAplicacionService
{
    private const string CacheKey = "aplicaciones_all";
    private static readonly TimeSpan CacheExpiration = TimeSpan.FromMinutes(15);
    private readonly IAdoRepository _adoRepository;
    private readonly IRepository<Aplicacion> _aplicacionRepository;
    private readonly IMemoryCache _cache;
    private readonly ILogger<AplicacionService> _logger;
    private readonly IRepository<Sistema> _sistemaRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly MapsterMapper.IMapper _mapper;

    public AplicacionService(
        IUnitOfWork unitOfWork,
        IMemoryCache cache,
        ILogger<AplicacionService> logger,
        MapsterMapper.IMapper mapper)
    {
        ArgumentNullException.ThrowIfNull(unitOfWork);
        ArgumentNullException.ThrowIfNull(cache);
        ArgumentNullException.ThrowIfNull(mapper);

        _unitOfWork = unitOfWork;
        _aplicacionRepository = unitOfWork.GetRepository<Aplicacion>();
        _sistemaRepository = unitOfWork.GetRepository<Sistema>();
        _adoRepository = unitOfWork.AdoRepository;
        _cache = cache;
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Result<IReadOnlyList<AplicacionItem>, DomainError>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            if (_cache.TryGetValue(CacheKey, out IReadOnlyList<AplicacionItem>? cachedResult) && cachedResult != null)
            {
                _logger.LogDebug("Retrieved aplicaciones from cache");
                return Result<IReadOnlyList<AplicacionItem>, DomainError>.Success(cachedResult);
            }

            var aplicaciones = await _aplicacionRepository.GetAllAsync(cancellationToken);
            if (!aplicaciones.Any())
                return Result<IReadOnlyList<AplicacionItem>, DomainError>.Success(Array.Empty<AplicacionItem>());

            var response = aplicaciones.Select(x => _mapper.Map<AplicacionItem>(x)).ToList();

            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(CacheExpiration)
                .SetPriority(CacheItemPriority.Normal);

            _cache.Set(CacheKey, response, cacheEntryOptions);
            _logger.LogDebug("Cached aplicaciones for {Duration} minutes", CacheExpiration.TotalMinutes);

            return Result<IReadOnlyList<AplicacionItem>, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving aplicaciones");
            return Result<IReadOnlyList<AplicacionItem>, DomainError>.Failure(DomainError.Internal("APLICACION_GET_ERROR", ex.Message));
        }
    }

    public async Task<Result<AplicacionItem, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var aplicacion = await _aplicacionRepository.GetByIdAsync(id, cancellationToken);
            if (aplicacion == null)
                return Result<AplicacionItem, DomainError>.Failure(DomainError.Validation("APLICACION_NOT_FOUND", "Aplicación no encontrada"));

            var response = _mapper.Map<AplicacionItem>(aplicacion);
            return Result<AplicacionItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving aplicacion with ID {Id}", id);
            return Result<AplicacionItem, DomainError>.Failure(DomainError.Internal("APLICACION_GET_BY_ID_ERROR", ex.Message));
        }
    }

    public async Task<Result<AplicacionItem, DomainError>> AddAsync(AplicacionCreate request, int userId, CancellationToken cancellationToken = default)
    {
        await using var transaction = await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);
        try
        {
            var existsByCode = await ExistsByCodeAsync(request.Code, cancellationToken: cancellationToken);
            if (existsByCode.IsSuccess && existsByCode.Value)
                return Result<AplicacionItem, DomainError>.Failure(DomainError.Validation("APLICACION_CODE_EXISTS", $"El código {request.Code} ya existe"));

            var existsByName = await ExistsByNameAsync(request.Name, cancellationToken: cancellationToken);
            if (existsByName.IsSuccess && existsByName.Value)
                return Result<AplicacionItem, DomainError>.Failure(DomainError.Validation("APLICACION_NAME_EXISTS", $"El nombre {request.Name} ya existe"));

            var sistema = await _sistemaRepository.GetByIdAsync(request.SistemaId, cancellationToken);
            if (sistema == null)
                return Result<AplicacionItem, DomainError>.Failure(DomainError.Validation("SISTEMA_NOT_FOUND", "El sistema especificado no existe"));

            var aplicacion = new Aplicacion
            {
                Id = 0,
                Code = request.Code,
                Name = request.Name,
                SistemaId = request.SistemaId,
                Sistema = null!,
                DomainUrl = request.DomainUrl,
                IpAddress = request.IpAddress,
                ConnectionStrings = request.ConnectionStrings,
                IsActive = request.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _aplicacionRepository.AddAsync(aplicacion, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            InvalidateCache();

            var response = _mapper.Map<AplicacionItem>(aplicacion);
            return Result<AplicacionItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            _logger.LogError(ex, "Error adding aplicacion");
            return Result<AplicacionItem, DomainError>.Failure(DomainError.Internal("APLICACION_ADD_ERROR", ex.Message));
        }
    }

    public async Task<Result<AplicacionItem, DomainError>> UpdateAsync(int id, AplicacionUpdate request, int userId, CancellationToken cancellationToken = default)
    {
        await using var transaction = await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);
        try
        {
            var aplicacion = await _aplicacionRepository.GetByIdAsync(id, cancellationToken);
            if (aplicacion == null)
                return Result<AplicacionItem, DomainError>.Failure(DomainError.Validation("APLICACION_NOT_FOUND", "Aplicación no encontrada"));

            // Validate unique code
            var existsByCode = await ExistsByCodeAsync(request.Code, id, cancellationToken);
            if (existsByCode.IsSuccess && existsByCode.Value)
                return Result<AplicacionItem, DomainError>.Failure(DomainError.Validation(
                    "APLICACION_CODE_EXISTS",
                    $"El código {request.Code} ya existe"));

            // Validate unique name
            var existsByName = await ExistsByNameAsync(request.Name, id, cancellationToken);
            if (existsByName.IsSuccess && existsByName.Value)
                return Result<AplicacionItem, DomainError>.Failure(DomainError.Validation(
                    "APLICACION_NAME_EXISTS",
                    $"El nombre {request.Name} ya existe"));

            // Validate Sistema exists
            var sistema = await _sistemaRepository.GetByIdAsync(request.SistemaId, cancellationToken);
            if (sistema == null)
                return Result<AplicacionItem, DomainError>.Failure(DomainError.Validation(
                    "SISTEMA_NOT_FOUND",
                    "El sistema especificado no existe"));

            aplicacion.Code = request.Code;
            aplicacion.Name = request.Name;
            aplicacion.SistemaId = request.SistemaId;
            aplicacion.DomainUrl = request.DomainUrl;
            aplicacion.IpAddress = request.IpAddress;
            aplicacion.ConnectionStrings = request.ConnectionStrings;
            aplicacion.IsActive = request.IsActive;
            aplicacion.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            InvalidateCache();

            var response = _mapper.Map<AplicacionItem>(aplicacion);
            return Result<AplicacionItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            _logger.LogError(ex, "Error updating aplicacion with ID {Id}", id);
            return Result<AplicacionItem, DomainError>.Failure(DomainError.Internal("APLICACION_UPDATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, int userId, CancellationToken cancellationToken = default)
    {
        await using var transaction = await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);
        try
        {
            var aplicacion = await _aplicacionRepository.GetByIdAsync(id, cancellationToken);
            if (aplicacion == null)
                return Result<bool, DomainError>.Failure(DomainError.Validation("APLICACION_NOT_FOUND", "Aplicación no encontrada"));

            await _aplicacionRepository.DeleteAsync(aplicacion, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            InvalidateCache();

            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            _logger.LogError(ex, "Error deleting aplicacion with ID {Id}", id);
            return Result<bool, DomainError>.Failure(DomainError.Internal("APLICACION_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> ExistsByCodeAsync(string code, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        try
        {
            var query = $"SELECT COUNT(1) FROM Aplicaciones WHERE Code = @Code";
            var parameters = new Dictionary<string, object> { { "Code", code } };

            if (excludeId.HasValue)
            {
                query += " AND Id != @ExcludeId";
                parameters["ExcludeId"] = excludeId.Value;
            }

            var count = await _adoRepository.QuerySingleOrDefaultAsync<object>(query, parameters);
            return Result<bool, DomainError>.Success((int)count > 0);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if aplicacion exists by code {Code}", code);
            return Result<bool, DomainError>.Failure(DomainError.Internal("APLICACION_EXISTS_BY_CODE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> ExistsByNameAsync(string name, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        try
        {
            var query = $"SELECT COUNT(1) FROM Aplicaciones WHERE Name = @Name";
            var parameters = new Dictionary<string, object> { { "Name", name } };

            if (excludeId.HasValue)
            {
                query += " AND Id != @ExcludeId";
                parameters["ExcludeId"] = excludeId.Value;
            }

            var count = await _adoRepository.QuerySingleOrDefaultAsync<object>(query, parameters);
            return Result<bool, DomainError>.Success(count != null && (int)count > 0);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if aplicacion exists by name {Name}", name);
            return Result<bool, DomainError>.Failure(DomainError.Internal("APLICACION_EXISTS_BY_NAME_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> ExistsAsync(string code, string name, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        try
        {
            var query = $"SELECT COUNT(1) FROM Aplicaciones WHERE Code = @Code OR Name = @Name";
            var parameters = new Dictionary<string, object> { { "Code", code }, { "Name", name } };

            if (excludeId.HasValue)
            {
                query += " AND Id != @ExcludeId";
                parameters["ExcludeId"] = excludeId.Value;
            }

            var count = await _adoRepository.QuerySingleOrDefaultAsync<object>(query, parameters);
            return Result<bool, DomainError>.Success(count != null && (int)count > 0);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if aplicacion exists by code {Code} or name {Name}", code, name);
            return Result<bool, DomainError>.Failure(DomainError.Internal("APLICACION_EXISTS_ERROR", ex.Message));
        }
    }

    private void InvalidateCache()
    {
        _cache.Remove(CacheKey);
        _logger.LogDebug("Invalidated aplicaciones cache");
    }
}

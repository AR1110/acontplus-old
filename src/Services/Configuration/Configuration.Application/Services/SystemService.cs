using Microsoft.Extensions.Caching.Memory;

namespace Configuration.Application.Services;

public class SystemService : ISystemService
{
    private const string CacheKey = "systems_all";
    private static readonly TimeSpan CacheExpiration = TimeSpan.FromMinutes(15);
    private readonly IAdoRepository _adoRepository;
    private readonly IRepository<Applications> _applicationRepository;
    private readonly IMemoryCache _cache;
    private readonly ILogger<SystemService> _logger;
    private readonly IRepository<Systems> _systemRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly MapsterMapper.IMapper _mapper;

    public SystemService(
        IUnitOfWork unitOfWork,
        IMemoryCache cache,
        ILogger<SystemService> logger,
        MapsterMapper.IMapper mapper)
    {
        ArgumentNullException.ThrowIfNull(unitOfWork);
        ArgumentNullException.ThrowIfNull(cache);
        ArgumentNullException.ThrowIfNull(mapper);

        _unitOfWork = unitOfWork;
        _systemRepository = unitOfWork.GetRepository<Systems>();
        _applicationRepository = unitOfWork.GetRepository<Applications>();
        _adoRepository = unitOfWork.AdoRepository;
        _cache = cache;
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Result<IReadOnlyList<SystemItem>, DomainError>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Try to get from cache first
            if (_cache.TryGetValue(CacheKey, out IReadOnlyList<SystemItem>? cachedResult) && cachedResult != null)
            {
                _logger.LogDebug("Retrieved systems from cache");
                return Result<IReadOnlyList<SystemItem>, DomainError>.Success(cachedResult);
            }

            // Get from database with includes
            var systems = await _systemRepository.GetAllAsync(cancellationToken);

            if (!systems.Any())
                return Result<IReadOnlyList<SystemItem>, DomainError>.Success(Array.Empty<SystemItem>());

            // Map to DTOs
            var response = systems.Select(x => _mapper.Map<SystemItem>(x)).ToList();

            // Cache the result
            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(CacheExpiration)
                .SetPriority(CacheItemPriority.Normal);

            _cache.Set(CacheKey, response, cacheEntryOptions);
            _logger.LogDebug("Cached systems for {Duration} minutes", CacheExpiration.TotalMinutes);

            return Result<IReadOnlyList<SystemItem>, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving systems");
            return Result<IReadOnlyList<SystemItem>, DomainError>.Failure(DomainError.Internal(
                "SYSTEM_GET_ERROR",
                ex.Message
            ));
        }
    }

    public async Task<Result<SystemItem, DomainError>> GetByIdAsync(int id,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var systemEntity = await _systemRepository.GetByIdAsync(id, cancellationToken);
            if (systemEntity == null)
                return Result<SystemItem, DomainError>.Failure(DomainError.Validation(
                    "SYSTEM_NOT_FOUND",
                    "System not found"));

            var response = _mapper.Map<SystemItem>(systemEntity);
            return Result<SystemItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving System with ID {Id}", id);
            return Result<SystemItem, DomainError>.Failure(DomainError.Internal(
                "SYSTEM_GET_BY_ID_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<SystemItem, DomainError>> AddAsync(SystemCreate request, int userId,
        CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            // Validate unique code
            var existsByCode = await ExistsAsync(request.Code, request.Name, null, cancellationToken);
            if (existsByCode.IsSuccess && existsByCode.Value)
                return Result<SystemItem, DomainError>.Failure(DomainError.Validation(
                    "SYSTEM_CODE_EXISTS",
                    $"The code {request.Code} already exists"));

            // Create new Systems
            var systemEntity = new Systems
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

            await _systemRepository.AddAsync(systemEntity, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            // Invalidate cache
            _cache.Remove(CacheKey);

            var response = _mapper.Map<SystemItem>(systemEntity);
            return Result<SystemItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted)
                await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error creating System");
            return Result<SystemItem, DomainError>.Failure(DomainError.Internal(
                "SYSTEM_CREATE_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<SystemItem, DomainError>> UpdateAsync(int id, SystemUpdate request,
        int userId, CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var existingSystem = await _systemRepository.GetByIdAsync(id, cancellationToken);
            if (existingSystem == null)
                return Result<SystemItem, DomainError>.Failure(DomainError.Validation(
                    "SYSTEM_NOT_FOUND",
                    "System not found"));

            // Validate unique code (excluding current item)
            var existsByCode = await ExistsAsync(request.Code, request.Name, id, cancellationToken);
            if (existsByCode.IsSuccess && existsByCode.Value)
                return Result<SystemItem, DomainError>.Failure(DomainError.Validation(
                    "SYSTEM_CODE_EXISTS",
                    $"The code {request.Code} already exists"));

            // Update properties
            existingSystem.Code = request.Code;
            existingSystem.Name = request.Name;
            existingSystem.DomainUrl = request.DomainUrl;
            existingSystem.IpAddress = request.IpAddress ?? string.Empty;
            existingSystem.ConnectionStrings = request.ConnectionStrings;
            existingSystem.UpdatedByUserId = userId;
            existingSystem.UpdatedAt = DateTime.UtcNow;

            await _systemRepository.UpdateAsync(existingSystem, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            // Invalidate cache
            _cache.Remove(CacheKey);

            var response = _mapper.Map<SystemItem>(existingSystem);
            return Result<SystemItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted)
                await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error updating System with ID {Id}", id);
            return Result<SystemItem, DomainError>.Failure(DomainError.Internal(
                "SYSTEM_UPDATE_ERROR",
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
            var systemEntity = await _systemRepository.GetByIdAsync(id, cancellationToken);
            if (systemEntity == null)
                return Result<bool, DomainError>.Failure(DomainError.Validation(
                    "SYSTEM_NOT_FOUND",
                    "System not found"));

            // Check if Systems has aplicaciones
            var applications = await _applicationRepository.GetAllAsync(cancellationToken);
            var systemApplications = applications.Where(x => x.SystemId == id && !x.IsDeleted).ToList();

            if (systemApplications.Any())
                return Result<bool, DomainError>.Failure(DomainError.Validation(
                    "SYSTEM_HAS_APPLICATIONS",
                    "Cannot delete System because it has associated applications"));

            // Soft delete
            systemEntity.IsActive = false;
            systemEntity.IsDeleted = true;
            systemEntity.UpdatedByUserId = userId;
            systemEntity.UpdatedAt = DateTime.UtcNow;

            await _systemRepository.UpdateAsync(systemEntity, cancellationToken);
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

            _logger.LogError(ex, "Error deleting System with ID {Id}", id);
            return Result<bool, DomainError>.Failure(DomainError.Internal(
                "SYSTEM_DELETE_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> ExistsAsync(string code, string name, int? excludeId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var query = "SELECT COUNT(1) FROM Config.Systems WHERE (Code = @Code OR Name = @Name) AND IsDeleted = 0";
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
            _logger.LogError(ex, "Error checking if System exists");
            return Result<bool, DomainError>.Failure(DomainError.Internal(
                "SYSTEM_EXISTS_ERROR",
                ex.Message));
        }
    }
}

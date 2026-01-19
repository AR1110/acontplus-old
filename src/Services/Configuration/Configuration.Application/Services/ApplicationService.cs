using Microsoft.Extensions.Caching.Memory;

namespace Configuration.Application.Services;

public class ApplicationService : IApplicationService
{
    private const string CacheKey = "applications_all";
    private static readonly TimeSpan CacheExpiration = TimeSpan.FromMinutes(15);
    private readonly IAdoRepository _adoRepository;
    private readonly IRepository<Applications> _applicationRepository;
    private readonly IMemoryCache _cache;
    private readonly ILogger<ApplicationService> _logger;
    private readonly IRepository<Systems> _systemRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly MapsterMapper.IMapper _mapper;

    public ApplicationService(
        IUnitOfWork unitOfWork,
        IMemoryCache cache,
        ILogger<ApplicationService> logger,
        MapsterMapper.IMapper mapper)
    {
        ArgumentNullException.ThrowIfNull(unitOfWork);
        ArgumentNullException.ThrowIfNull(cache);
        ArgumentNullException.ThrowIfNull(mapper);

        _unitOfWork = unitOfWork;
        _applicationRepository = unitOfWork.GetRepository<Applications>();
        _systemRepository = unitOfWork.GetRepository<Systems>();
        _adoRepository = unitOfWork.AdoRepository;
        _cache = cache;
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Result<IReadOnlyList<ApplicationItem>, DomainError>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            if (_cache.TryGetValue(CacheKey, out IReadOnlyList<ApplicationItem>? cachedResult) && cachedResult != null)
            {
                _logger.LogDebug("Retrieved applications from cache");
                return Result<IReadOnlyList<ApplicationItem>, DomainError>.Success(cachedResult);
            }

            var applications = await _applicationRepository.GetAllAsync(cancellationToken);
            if (!applications.Any())
                return Result<IReadOnlyList<ApplicationItem>, DomainError>.Success(Array.Empty<ApplicationItem>());

            var response = applications.Select(x => _mapper.Map<ApplicationItem>(x)).ToList();

            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(CacheExpiration)
                .SetPriority(CacheItemPriority.Normal);

            _cache.Set(CacheKey, response, cacheEntryOptions);
            _logger.LogDebug("Cached applications for {Duration} minutes", CacheExpiration.TotalMinutes);

            return Result<IReadOnlyList<ApplicationItem>, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving applications");
            return Result<IReadOnlyList<ApplicationItem>, DomainError>.Failure(DomainError.Internal("APPLICATION_GET_ERROR", ex.Message));
        }
    }

    public async Task<Result<ApplicationItem, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var application = await _applicationRepository.GetByIdAsync(id, cancellationToken);
            if (application == null)
                return Result<ApplicationItem, DomainError>.Failure(DomainError.Validation("APPLICATION_NOT_FOUND", "Application not found"));

            var response = _mapper.Map<ApplicationItem>(application);
            return Result<ApplicationItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving Application with ID {Id}", id);
            return Result<ApplicationItem, DomainError>.Failure(DomainError.Internal("APPLICATION_GET_BY_ID_ERROR", ex.Message));
        }
    }

    public async Task<Result<ApplicationItem, DomainError>> AddAsync(ApplicationCreate request, int userId, CancellationToken cancellationToken = default)
    {
        await using var transaction = await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);
        try
        {
            var existsByCode = await ExistsByCodeAsync(request.Code, cancellationToken: cancellationToken);
            if (existsByCode.IsSuccess && existsByCode.Value)
                return Result<ApplicationItem, DomainError>.Failure(DomainError.Validation("APPLICATION_CODE_EXISTS", $"The code {request.Code} already exists"));

            var existsByName = await ExistsByNameAsync(request.Name, cancellationToken: cancellationToken);
            if (existsByName.IsSuccess && existsByName.Value)
                return Result<ApplicationItem, DomainError>.Failure(DomainError.Validation("APPLICATION_NAME_EXISTS", $"The name {request.Name} already exists"));

            var systemEntity = await _systemRepository.GetByIdAsync(request.SystemId, cancellationToken);
            if (systemEntity == null)
                return Result<ApplicationItem, DomainError>.Failure(DomainError.Validation("SYSTEM_NOT_FOUND", "The specified System does not exist"));

            var application = new Applications
            {
                Id = 0,
                Code = request.Code,
                Name = request.Name,
                SistemaId = request.SystemId,
                System = systemEntity,
                DomainUrl = request.DomainUrl,
                IpAddress = request.IpAddress,
                ConnectionStrings = request.ConnectionStrings,
                IsActive = request.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _applicationRepository.AddAsync(application, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            InvalidateCache();

            var response = _mapper.Map<ApplicationItem>(application);
            return Result<ApplicationItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            _logger.LogError(ex, "Error adding Application");
            return Result<ApplicationItem, DomainError>.Failure(DomainError.Internal("APPLICATION_ADD_ERROR", ex.Message));
        }
    }

    public async Task<Result<ApplicationItem, DomainError>> UpdateAsync(int id, ApplicationUpdate request, int userId, CancellationToken cancellationToken = default)
    {
        await using var transaction = await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);
        try
        {
            var application = await _applicationRepository.GetByIdAsync(id, cancellationToken);
            if (application == null)
                return Result<ApplicationItem, DomainError>.Failure(DomainError.Validation("APPLICATION_NOT_FOUND", "Application not found"));

            // Validate unique code
            var existsByCode = await ExistsByCodeAsync(request.Code, id, cancellationToken);
            if (existsByCode.IsSuccess && existsByCode.Value)
                return Result<ApplicationItem, DomainError>.Failure(DomainError.Validation(
                    "APPLICATION_CODE_EXISTS",
                    $"The code {request.Code} already exists"));

            // Validate unique name
            var existsByName = await ExistsByNameAsync(request.Name, id, cancellationToken);
            if (existsByName.IsSuccess && existsByName.Value)
                return Result<ApplicationItem, DomainError>.Failure(DomainError.Validation(
                    "APPLICATION_NAME_EXISTS",
                    $"The name {request.Name} already exists"));

            // Validate System exists
            var systemEntity = await _systemRepository.GetByIdAsync(request.SystemId, cancellationToken);
            if (systemEntity == null)
                return Result<ApplicationItem, DomainError>.Failure(DomainError.Validation(
                    "SYSTEM_NOT_FOUND",
                    "The specified System does not exist"));

            application.Code = request.Code;
            application.Name = request.Name;
            application.SistemaId = request.SystemId;
            application.System = systemEntity;
            application.DomainUrl = request.DomainUrl;
            application.IpAddress = request.IpAddress;
            application.ConnectionStrings = request.ConnectionStrings;
            application.IsActive = request.IsActive;
            application.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            InvalidateCache();

            var response = _mapper.Map<ApplicationItem>(application);
            return Result<ApplicationItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            _logger.LogError(ex, "Error updating Application with ID {Id}", id);
            return Result<ApplicationItem, DomainError>.Failure(DomainError.Internal("APPLICATION_UPDATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, int userId, CancellationToken cancellationToken = default)
    {
        await using var transaction = await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);
        try
        {
            var application = await _applicationRepository.GetByIdAsync(id, cancellationToken);
            if (application == null)
                return Result<bool, DomainError>.Failure(DomainError.Validation("APPLICATION_NOT_FOUND", "Application not found"));

            await _applicationRepository.DeleteAsync(application, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            InvalidateCache();

            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            _logger.LogError(ex, "Error deleting Application with ID {Id}", id);
            return Result<bool, DomainError>.Failure(DomainError.Internal("APPLICATION_DELETE_ERROR", ex.Message));
        }
    }

    private async Task<Result<bool, DomainError>> ExistsByCodeAsync(string code, int? excludeId = null, CancellationToken cancellationToken = default)
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
            _logger.LogError(ex, "Error checking if Application exists by code {Code}", code);
            return Result<bool, DomainError>.Failure(DomainError.Internal("APPLICATION_EXISTS_BY_CODE_ERROR", ex.Message));
        }
    }

    private async Task<Result<bool, DomainError>> ExistsByNameAsync(string name, int? excludeId = null, CancellationToken cancellationToken = default)
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
            _logger.LogError(ex, "Error checking if Application exists by name {Name}", name);
            return Result<bool, DomainError>.Failure(DomainError.Internal("APPLICATION_EXISTS_BY_NAME_ERROR", ex.Message));
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
            _logger.LogError(ex, "Error checking if Application exists by code {Code} or name {Name}", code, name);
            return Result<bool, DomainError>.Failure(DomainError.Internal("APPLICATION_EXISTS_ERROR", ex.Message));
        }
    }

    private void InvalidateCache()
    {
        _cache.Remove(CacheKey);
        _logger.LogDebug("Invalidated applications cache");
    }
}

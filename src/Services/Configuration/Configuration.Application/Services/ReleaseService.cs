namespace Configuration.Application.Services;

public class ReleaseService : IReleaseService
{
    private readonly IRepository<Aplicacion> _aplicacionRepository;
    private readonly ILogger<ReleaseService> _logger;
    private readonly IRepository<Release> _releaseRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly MapsterMapper.IMapper _mapper;

    public ReleaseService(
        IUnitOfWork unitOfWork,
        ILogger<ReleaseService> logger,
        MapsterMapper.IMapper mapper)
    {
        ArgumentNullException.ThrowIfNull(unitOfWork);
        ArgumentNullException.ThrowIfNull(mapper);

        _unitOfWork = unitOfWork;
        _releaseRepository = _unitOfWork.GetRepository<Release>();
        _aplicacionRepository = _unitOfWork.GetRepository<Aplicacion>();
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Result<IReadOnlyList<ReleaseItem>, DomainError>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        try
        {
            var releases = await _releaseRepository.GetAllAsync(cancellationToken);
            var responses = releases.Where(x => !x.IsDeleted).Select(x => _mapper.Map<ReleaseItem>(x)).ToList();
            return Result<IReadOnlyList<ReleaseItem>, DomainError>.Success(responses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving releases");
            return Result<IReadOnlyList<ReleaseItem>, DomainError>.Failure(
                DomainError.Internal("RELEASE_GETALL_ERROR", ex.Message));
        }
    }

    public async Task<Result<ReleaseItem, DomainError>> GetByIdAsync(int id,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var release = await _releaseRepository.GetByIdAsync(id, cancellationToken);
            if (release == null || release.IsDeleted)
                return Result<ReleaseItem, DomainError>.Failure(DomainError.Validation("RELEASE_NOT_FOUND",
                    "Release no encontrado"));

            var response = _mapper.Map<ReleaseItem>(release);
            return Result<ReleaseItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving release with ID {Id}", id);
            return Result<ReleaseItem, DomainError>.Failure(DomainError.Internal("RELEASE_GETBYID_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<ReleaseCreatedResponse, DomainError>> AddAsync(ReleaseCreate request, int userId,
        CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            // Validate Aplicacion exists
            var aplicacion = await _aplicacionRepository.GetByIdAsync(request.AplicacionId, cancellationToken);
            if (aplicacion == null)
                return Result<ReleaseCreatedResponse, DomainError>.Failure(
                    DomainError.Validation("APLICACION_NOT_FOUND", "La aplicación no existe"));

            // Validate version uniqueness for the same application
            var existingRelease = await _releaseRepository.GetAllAsync(cancellationToken);
            if (existingRelease.Any(x => x.AplicacionId == request.AplicacionId &&
                                         x.Version == request.Version &&
                                         !x.IsDeleted))
                return Result<ReleaseCreatedResponse, DomainError>.Failure(DomainError.Validation("VERSION_DUPLICATE",
                    "Ya existe una versión con el mismo número para esta aplicación"));

            var release = new Release
            {
                Id = 0, // Will be set by the database
                AplicacionId = request.AplicacionId,
                ReleaseDate = request.ReleaseDate,
                Version = request.Version,
                Title = request.Title,
                Content = request.Content,
                LogoutRequired = request.LogoutRequired,
                IsActive = true,
                CreatedByUserId = userId,
                CreatedAt = DateTime.UtcNow,
                CompressedContent = new byte[0] // This will be set by the Content property setter
            };

            await _releaseRepository.AddAsync(release, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            var response = _mapper.Map<ReleaseCreatedResponse>(release)
                with
            { AplicacionName = aplicacion?.Name ?? string.Empty };
            return Result<ReleaseCreatedResponse, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error creating release");
            return Result<ReleaseCreatedResponse, DomainError>.Failure(DomainError.Internal("RELEASE_CREATE_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<ReleaseUpdatedResponse, DomainError>> UpdateAsync(int id, ReleaseUpdate request,
        int userId, CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var releaseFound = await _releaseRepository.GetByIdAsync(id, cancellationToken);
            if (releaseFound == null || releaseFound.IsDeleted)
                return Result<ReleaseUpdatedResponse, DomainError>.Failure(
                    DomainError.Validation("RELEASE_NOT_FOUND", "Release no encontrado"));

            // Validate Aplicacion exists
            var aplicacion = await _aplicacionRepository.GetByIdAsync(request.AplicacionId, cancellationToken);
            if (aplicacion == null)
                return Result<ReleaseUpdatedResponse, DomainError>.Failure(
                    DomainError.Validation("APLICACION_NOT_FOUND", "La aplicación no existe"));

            // Validate version uniqueness for the same application (excluding current release)
            var existingRelease = await _releaseRepository.GetAllAsync(cancellationToken);
            if (existingRelease.Any(x => x.Id != id &&
                                         x.AplicacionId == request.AplicacionId &&
                                         x.Version == request.Version &&
                                         !x.IsDeleted))
                return Result<ReleaseUpdatedResponse, DomainError>.Failure(DomainError.Validation("VERSION_DUPLICATE",
                    "Ya existe una versión con el mismo número para esta aplicación"));

            releaseFound.AplicacionId = request.AplicacionId;
            releaseFound.ReleaseDate = request.ReleaseDate;
            releaseFound.Version = request.Version;
            releaseFound.Title = request.Title;
            releaseFound.Content = request.Content;
            releaseFound.LogoutRequired = request.LogoutRequired;
            releaseFound.UpdatedByUserId = userId;
            releaseFound.UpdatedAt = DateTime.UtcNow;

            await _releaseRepository.UpdateAsync(releaseFound, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            var response = _mapper.Map<ReleaseUpdatedResponse>(releaseFound)
                with
            { AplicacionName = aplicacion?.Name ?? string.Empty };
            return Result<ReleaseUpdatedResponse, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error updating release with ID {Id}", id);
            return Result<ReleaseUpdatedResponse, DomainError>.Failure(DomainError.Internal("RELEASE_UPDATE_ERROR",
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
            var release = await _releaseRepository.GetByIdAsync(id, cancellationToken);
            if (release == null || release.IsDeleted)
                return Result<bool, DomainError>.Failure(DomainError.Validation("RELEASE_NOT_FOUND",
                    "Release no encontrado"));

            // Soft delete
            release.IsDeleted = true;
            release.DeletedByUserId = userId;
            release.DeletedAt = DateTime.UtcNow;

            await _releaseRepository.UpdateAsync(release, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error deleting release with ID {Id}", id);
            return Result<bool, DomainError>.Failure(DomainError.Internal("RELEASE_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<IReadOnlyList<ReleaseItem>, DomainError>> GetByAplicacionIdAsync(int aplicacionId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var releases = await _releaseRepository.GetAllAsync(cancellationToken);
            var filteredReleases = releases.Where(x => x.AplicacionId == aplicacionId && !x.IsDeleted).ToList();
            var responses = filteredReleases.Select(x => _mapper.Map<ReleaseItem>(x)).ToList();
            return Result<IReadOnlyList<ReleaseItem>, DomainError>.Success(responses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving releases by application ID {AplicacionId}", aplicacionId);
            return Result<IReadOnlyList<ReleaseItem>, DomainError>.Failure(
                DomainError.Internal("RELEASE_GETBYAPLICACION_ERROR", ex.Message));
        }
    }

    // Mapping handled by Mapster profiles
}

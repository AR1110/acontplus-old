using System.Data;

namespace Common.Application.Services;

public class UserManualTypeService : IUserManualTypeService
{
    private readonly ILogger<UserManualTypeService> _logger;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<UserManualType> _userManualTypeRepository;
    private readonly MapsterMapper.IMapper _mapper;

    public UserManualTypeService(IUnitOfWork unitOfWork, ILogger<UserManualTypeService> logger, MapsterMapper.IMapper mapper)
    {
        ArgumentNullException.ThrowIfNull(unitOfWork);
        _unitOfWork = unitOfWork;
        _userManualTypeRepository = _unitOfWork.GetRepository<UserManualType>();
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Result<UserManualType, DomainError>> AddAsync(UserManualTypeCreate request,
        CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var userManualType = _mapper.Map<UserManualTypeCreate, UserManualType>(request);
            var existsResponse = await ExistsByCodeAsync(userManualType.Code, cancellationToken: cancellationToken);
            if (existsResponse.IsSuccess && existsResponse.Value)
                return Result<UserManualType, DomainError>.Failure(DomainError.Validation("USERMANUALTYPE_CODE_EXISTS",
                    "El código ya existe"));
            await _userManualTypeRepository.AddAsync(userManualType, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            return Result<UserManualType, DomainError>.Success(userManualType);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error creating user manual type");
            return Result<UserManualType, DomainError>.Failure(DomainError.Internal("USERMANUALTYPE_CREATE_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var userManualType = await _userManualTypeRepository.GetByIdAsync(id, cancellationToken);
            if (userManualType == null)
                return Result<bool, DomainError>.Failure(DomainError.Validation("USERMANUALTYPE_NOT_FOUND",
                    "UserManualType no encontrado"));
            await _userManualTypeRepository.DeleteAsync(userManualType, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error deleting user manual type with ID {Id}", id);
            return Result<bool, DomainError>.Failure(DomainError.Internal("USERMANUALTYPE_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<IReadOnlyList<UserManualType>, DomainError>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        try
        {
            var userManualTypes = await _userManualTypeRepository.GetAllAsync(cancellationToken);
            return Result<IReadOnlyList<UserManualType>, DomainError>.Success(userManualTypes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user manual types");
            return Result<IReadOnlyList<UserManualType>, DomainError>.Failure(
                DomainError.Internal("USERMANUALTYPE_GETALL_ERROR", ex.Message));
        }
    }

    public async Task<Result<UserManualType, DomainError>> GetByIdAsync(int id,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var userManualType = await _userManualTypeRepository.GetByIdAsync(id, cancellationToken);
            return userManualType == null
                ? Result<UserManualType, DomainError>.Failure(DomainError.Validation("USERMANUALTYPE_NOT_FOUND",
                    "UserManualType no encontrado"))
                : Result<UserManualType, DomainError>.Success(userManualType);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user manual type with ID {Id}", id);
            return Result<UserManualType, DomainError>.Failure(DomainError.Internal("USERMANUALTYPE_GETBYID_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<UserManualType, DomainError>> UpdateAsync(int id, UserManualTypeUpdate request,
        CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var userManualTypeFound = await _userManualTypeRepository.GetByIdAsync(id, cancellationToken);
            if (userManualTypeFound == null)
                return Result<UserManualType, DomainError>.Failure(DomainError.Validation("USERMANUALTYPE_NOT_FOUND",
                    "UserManualType no encontrado"));

            var userManualType = _mapper.Map<UserManualTypeUpdate, UserManualType>(request);
            var existsResponse = await ExistsByCodeAsync(userManualType.Code, id, cancellationToken);
            if (existsResponse.IsSuccess && existsResponse.Value)
                return Result<UserManualType, DomainError>.Failure(DomainError.Validation("USERMANUALTYPE_CODE_EXISTS",
                    "El código ya existe"));
            userManualTypeFound.Code = userManualType.Code;
            userManualTypeFound.Name = userManualType.Name;
            userManualTypeFound.UpdatedByUserId = userManualType.UpdatedByUserId;
            userManualTypeFound.IsActive = userManualType.IsActive;
            await _userManualTypeRepository.UpdateAsync(userManualTypeFound, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            return Result<UserManualType, DomainError>.Success(userManualTypeFound);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error updating user manual type with ID {Id}", id);
            return Result<UserManualType, DomainError>.Failure(DomainError.Internal("USERMANUALTYPE_UPDATE_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> ExistsByCodeAsync(string code, int? excludeId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var all = await _userManualTypeRepository.GetAllAsync(cancellationToken);
            var exists = all.Any(x => x.Code == code && (!excludeId.HasValue || x.Id != excludeId.Value));
            return Result<bool, DomainError>.Success(exists);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if user manual type code exists");
            return Result<bool, DomainError>.Failure(DomainError.Internal("USERMANUALTYPE_EXISTS_ERROR", ex.Message));
        }
    }
}
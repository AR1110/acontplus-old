using Acontplus.Core.Domain.Common.Results;
using MapsterMapper;

namespace Identity.Api.Services;

public class ActionService : IActionService
{
    private readonly IRepository<Actions> _actionRepository;
    private readonly IAdoRepository _adoRepository;
    private readonly ILogger<ActionService> _logger;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ActionService(IUnitOfWork unitOfWork, ILogger<ActionService> logger, IMapper mapper)
    {
        ArgumentNullException.ThrowIfNull(unitOfWork);
        _unitOfWork = unitOfWork;
        _actionRepository = unitOfWork.GetRepository<Actions>();
        _adoRepository = unitOfWork.AdoRepository;
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Result<ActionItem, DomainError>> AddAsync(ActionCreate request,
        CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var action = _mapper.Map<ActionCreate, Actions>(request);

            // Validate unique code
            var existsByCode = await ExistsByCodeAsync(action.Code, cancellationToken: cancellationToken);
            if (existsByCode)
                return DomainError.Validation("ACTION_CODE_EXISTS", $"El código {action.Code} ya existe");

            // Validate unique name
            var existsByName = await ExistsByNameAsync(action.Name, cancellationToken: cancellationToken);
            if (existsByName)
                return DomainError.Validation("ACTION_NAME_EXISTS", $"El nombre {action.Name} ya existe");

            await _actionRepository.AddAsync(action, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            var response = _mapper.Map<Actions, ActionItem>(action);
            return Result<ActionItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error creating action");
            return Result<ActionItem, DomainError>.Failure(DomainError.Internal(
                "ACTION_CREATE_ERROR",
                ex.Message
            ));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var action = await _actionRepository.GetByIdAsync(id, cancellationToken);
            if (action == null)
                return Result<bool, DomainError>.Failure(DomainError.Validation("ACTION_NOT_FOUND",
                    "Acción no encontrada"));

            await _actionRepository.DeleteAsync(action, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error deleting action with ID {Id}", id);
            return Result<bool, DomainError>.Failure(DomainError.Internal("ACTION_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<IReadOnlyList<ActionItem>, DomainError>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        try
        {
            var actions = await _actionRepository.GetAllAsync(cancellationToken);
            var responses = _mapper.Map<IReadOnlyList<Actions>, IReadOnlyList<ActionItem>>(actions);
            return Result<IReadOnlyList<ActionItem>, DomainError>.Success(responses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving actions");
            return Result<IReadOnlyList<ActionItem>, DomainError>.Failure(DomainError.Internal(
                "ACTION_GET_ERROR",
                ex.Message
            ));
        }
    }

    public async Task<Result<ActionItem, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var action = await _actionRepository.GetByIdAsync(id, cancellationToken);
            if (action == null)
                return Result<ActionItem, DomainError>.Failure(DomainError.NotFound("ACTION_NOT_FOUND", $"Action with ID {id} not found"));

            var response = _mapper.Map<Actions, ActionItem>(action);
            return Result<ActionItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving action with ID {Id}", id);
            return Result<ActionItem, DomainError>.Failure(DomainError.Internal("ACTION_GET_BY_ID_ERROR", ex.Message));
        }
    }

    public async Task<Result<ActionItem, DomainError>> UpdateAsync(int id, ActionUpdate request,
        CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var actionFound = await _actionRepository.GetByIdAsync(id, cancellationToken);
            if (actionFound == null)
                return Result<ActionItem, DomainError>.Failure(DomainError.Validation("ACTION_NOT_FOUND",
                    "Acción no encontrada"));

            // Validate unique code
            var existsByCode = await ExistsByCodeAsync(request.Code, id, cancellationToken);
            if (existsByCode)
                return DomainError.Validation("ACTION_CODE_EXISTS", $"El código {request.Code} ya existe");

            // Validate unique name
            var existsByName = await ExistsByNameAsync(request.Name, id, cancellationToken);
            if (existsByName)
                return DomainError.Validation("ACTION_NAME_EXISTS", $"El nombre {request.Name} ya existe");

            actionFound.Code = request.Code;
            actionFound.Name = request.Name;
            actionFound.Description = request.Description;
            actionFound.UpdatedByUserId = request.UpdatedByUserId;

            await _actionRepository.UpdateAsync(actionFound, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            var response = _mapper.Map<Actions, ActionItem>(actionFound);
            return Result<ActionItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error updating action with ID {Id}", id);
            return Result<ActionItem, DomainError>.Failure(DomainError.Internal("ACTION_UPDATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> ExistsAsync(string code, string name, int? excludeId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var query = "SELECT COUNT(1) FROM Seguridad.Actions WHERE (Code = @Code OR Name = @Name)";
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

            var count = await _adoRepository.ExecuteNonQueryAsync(query, parameters,
                cancellationToken: cancellationToken);
            return Result<bool, DomainError>.Success(count > 0);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if action exists");
            return Result<bool, DomainError>.Failure(DomainError.Internal("ACTION_EXISTS_CODE_ERROR", ex.Message));
        }
    }

    private async Task<bool> ExistsByCodeAsync(string code, int? excludeId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var query = "SELECT COUNT(1) FROM Seguridad.Actions WHERE Code = @Code";
            var parameters = new Dictionary<string, object> { { "@Code", code } };

            if (excludeId.HasValue)
            {
                query += " AND Id != @ExcludeId";
                parameters.Add("@ExcludeId", excludeId.Value);
            }

            var count = await _adoRepository.ExecuteNonQueryAsync(query, parameters,
                cancellationToken: cancellationToken);
            return count > 0;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if action code exists");
            return false;
        }
    }

    private async Task<bool> ExistsByNameAsync(string name, int? excludeId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var query = "SELECT COUNT(1) FROM Seguridad.Actions WHERE Name = @Name";
            var parameters = new Dictionary<string, object> { { "@Name", name } };

            if (excludeId.HasValue)
            {
                query += " AND Id != @ExcludeId";
                parameters.Add("@ExcludeId", excludeId.Value);
            }

            var count = await _adoRepository.ExecuteNonQueryAsync(query, parameters,
                cancellationToken: cancellationToken);
            return count > 0;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if action name exists");
            return false;
        }
    }
}

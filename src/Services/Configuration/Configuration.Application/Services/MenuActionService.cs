namespace Configuration.Application.Services;

public class MenuActionService : IMenuActionService
{
    private readonly IRepository<Actions> _actionRepository;
    private readonly IAdoRepository _adoRepository;
    private readonly ILogger<MenuActionService> _logger;
    private readonly IRepository<MenuAction> _menuActionRepository;
    private readonly IRepository<Menu> _menuRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public MenuActionService(IUnitOfWork unitOfWork, ILogger<MenuActionService> logger, IMapper mapper)
    {
        ArgumentNullException.ThrowIfNull(unitOfWork);
        _unitOfWork = unitOfWork;
        _menuActionRepository = unitOfWork.GetRepository<MenuAction>();
        _menuRepository = unitOfWork.GetRepository<Menu>();
        _actionRepository = unitOfWork.GetRepository<Actions>();
        _adoRepository = unitOfWork.AdoRepository;
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Result<MenuAction, DomainError>> AddAsync(MenuActionCreate request,
        CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var menuAction = _mapper.Map<MenuActionCreate, MenuAction>(request);
            var menuExists = await _menuRepository.GetByIdAsync(menuAction.MenuId, cancellationToken);
            if (menuExists == null)
                return Result<MenuAction, DomainError>.Failure(DomainError.Validation("MENU_NOT_FOUND",
                    $"Menú con ID {menuAction.MenuId} no encontrado"));
            var actionExists = await _actionRepository.GetByIdAsync(menuAction.ActionId, cancellationToken);
            if (actionExists == null)
                return Result<MenuAction, DomainError>.Failure(DomainError.Validation("ACTION_NOT_FOUND",
                    $"Acción con ID {menuAction.ActionId} no encontrada"));
            var existsResponse = await ExistsAsync(menuAction.MenuId, menuAction.ActionId,
                cancellationToken: cancellationToken);
            if (existsResponse.IsSuccess && existsResponse.Value)
                return Result<MenuAction, DomainError>.Failure(DomainError.Validation("MENU_ACTION_EXISTS",
                    "Esta combinación de menú-acción ya existe"));
            await _menuActionRepository.AddAsync(menuAction, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            return Result<MenuAction, DomainError>.Success(menuAction);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error creating menu action");
            return Result<MenuAction, DomainError>.Failure(DomainError.Internal("MENU_ACTION_CREATE_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var menuAction = await _menuActionRepository.GetByIdAsync(id, cancellationToken);
            if (menuAction == null)
                return Result<bool, DomainError>.Failure(DomainError.Validation("MENU_ACTION_NOT_FOUND",
                    "MenuAction no encontrado"));

            await _menuActionRepository.DeleteAsync(menuAction, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error deleting menu action with ID {Id}", id);
            return Result<bool, DomainError>.Failure(DomainError.Internal("MENU_ACTION_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<IReadOnlyList<MenuAction>, DomainError>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        try
        {
            var menuActions = await _menuActionRepository.GetAllAsync(cancellationToken);
            return Result<IReadOnlyList<MenuAction>, DomainError>.Success(menuActions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving menu actions");
            return Result<IReadOnlyList<MenuAction>, DomainError>.Failure(
                DomainError.Internal("MENU_ACTION_GETALL_ERROR", ex.Message));
        }
    }

    public async Task<Result<IReadOnlyList<MenuAction>, DomainError>> GetAllWithIncludesAsync(
        CancellationToken cancellationToken = default)
    {
        try
        {
            var menuActions = await _menuActionRepository.GetAllAsync(
                cancellationToken,
                MenuActionIncludes.MenuAndAction);
            return Result<IReadOnlyList<MenuAction>, DomainError>.Success(menuActions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving menu actions with includes");
            return Result<IReadOnlyList<MenuAction>, DomainError>.Failure(
                DomainError.Internal("MENU_ACTION_GETALL_INCLUDES_ERROR", ex.Message));
        }
    }

    public async Task<Result<MenuAction, DomainError>> GetByIdAsync(int id,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var menuAction = await _menuActionRepository.GetByIdAsync(id, cancellationToken);
            return menuAction == null
                ? Result<MenuAction, DomainError>.Failure(DomainError.Validation("MENU_ACTION_NOT_FOUND",
                    "Acción del menú no encontrada"))
                : Result<MenuAction, DomainError>.Success(menuAction);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving menu action with ID {Id}", id);
            return Result<MenuAction, DomainError>.Failure(
                DomainError.Internal("MENU_ACTION_GETBYID_ERROR", ex.Message));
        }
    }

    public async Task<Result<MenuAction, DomainError>> GetByIdWithIncludesAsync(int id,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var menuAction = await _menuActionRepository.GetByIdAsync(id, cancellationToken);
            return menuAction == null
                ? Result<MenuAction, DomainError>.Failure(DomainError.Validation("MENU_ACTION_NOT_FOUND",
                    "Acción del menú no encontrada"))
                : Result<MenuAction, DomainError>.Success(menuAction);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving menu action with includes and ID {Id}", id);
            return Result<MenuAction, DomainError>.Failure(DomainError.Internal("MENU_ACTION_GETBYID_INCLUDES_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<MenuAction, DomainError>> UpdateAsync(int id, MenuActionUpdate request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var menuActionFound = await _menuActionRepository.GetByIdAsync(id, cancellationToken);
            if (menuActionFound == null)
                return Result<MenuAction, DomainError>.Failure(DomainError.Validation("MENU_ACTION_NOT_FOUND",
                    "Acción del menú no encontrada"));
            _mapper.Map(request, menuActionFound);
            var menuExists = await _menuRepository.GetByIdAsync(menuActionFound.MenuId, cancellationToken);
            if (menuExists == null)
                return Result<MenuAction, DomainError>.Failure(DomainError.Validation("MENU_NOT_FOUND",
                    $"Menú con ID {menuActionFound.MenuId} no encontrado"));
            var actionExists = await _actionRepository.GetByIdAsync(menuActionFound.ActionId, cancellationToken);
            if (actionExists == null)
                return Result<MenuAction, DomainError>.Failure(DomainError.Validation("ACTION_NOT_FOUND",
                    $"Acción con ID {menuActionFound.ActionId} no encontrada"));
            var existsResponse = await ExistsAsync(menuActionFound.MenuId, menuActionFound.ActionId, id, cancellationToken);
            if (existsResponse.IsSuccess && existsResponse.Value)
                return Result<MenuAction, DomainError>.Failure(DomainError.Validation("MENU_ACTION_EXISTS",
                    "Esta combinación de menú-acción ya existe"));
            await _menuActionRepository.UpdateAsync(menuActionFound, cancellationToken);
            return Result<MenuAction, DomainError>.Success(menuActionFound);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating menu action with ID {Id}", id);
            return Result<MenuAction, DomainError>.Failure(DomainError.Internal("MENU_ACTION_UPDATE_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> ExistsAsync(int menuId, int actionId, int? excludeId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var query = "SELECT COUNT(1) FROM MenuActions WHERE MenuId = @MenuId AND ActionId = @ActionId";
            if (excludeId.HasValue) query += " AND Id != @ExcludeId";
            var parameters = new Dictionary<string, object>
            {
                { "@MenuId", menuId },
                { "@ActionId", actionId }
            };
            if (excludeId.HasValue) parameters.Add("@ExcludeId", excludeId.Value);
            var count = await _adoRepository.ExecuteNonQueryAsync(query, parameters,
                cancellationToken: cancellationToken);
            return Result<bool, DomainError>.Success(count > 0);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if menu action exists");
            return Result<bool, DomainError>.Failure(DomainError.Internal("MENU_ACTION_EXISTS_ERROR", ex.Message));
        }
    }
}
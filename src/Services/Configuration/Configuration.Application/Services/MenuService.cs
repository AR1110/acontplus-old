namespace Configuration.Application.Services;

public class MenuService : IMenuService
{
    private readonly IAdoRepository _adoRepository;
    private readonly ILogger<MenuService> _logger;
    private readonly IRepository<Menu> _menuRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public MenuService(IUnitOfWork unitOfWork, ILogger<MenuService> logger, IMapper mapper)
    {
        ArgumentNullException.ThrowIfNull(unitOfWork);
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _menuRepository = unitOfWork.GetRepository<Menu>();
        _adoRepository = unitOfWork.AdoRepository;
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Result<Menu, DomainError>> AddAsync(MenuCreate request, CancellationToken cancellationToken)
    {
        var menu = _mapper.Map<MenuCreate, Menu>(request);
        // Validate business rules
        var validationResult = await ValidateMenuForCreationAsync(menu, cancellationToken);
        if (validationResult.IsFailure)
            return Result<Menu, DomainError>.Failure(validationResult.Error);

        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            // Check if code already exists within the same application
            var existingMenu = await _menuRepository.GetFirstOrDefaultAsync(
                x => x.Code == menu.Code && x.ApplicationId == menu.ApplicationId,
                cancellationToken);

            if (existingMenu?.Id > 0)
                return Result<Menu, DomainError>.Failure(DomainError.Conflict("MENU_CODE_EXISTS",
                    $"Menu with code '{menu.Code}' already exists in the specified application"));

            // Validate parent menu exists and belongs to the same application
            if (menu.ParentId.HasValue)
            {
                var parentMenu = await _menuRepository.GetByIdAsync(menu.ParentId.Value, cancellationToken);
                if (parentMenu == null)
                    return Result<Menu, DomainError>.Failure(DomainError.NotFound("PARENT_MENU_NOT_FOUND",
                        $"Parent menu with ID {menu.ParentId.Value} not found"));

                if (parentMenu.ApplicationId != menu.ApplicationId)
                    return Result<Menu, DomainError>.Failure(DomainError.Validation("INVALID_PARENT_MENU",
                        "Parent menu must belong to the same application"));
            }

            // Set creation metadata
            menu.CreatedAt = DateTime.UtcNow;
            menu.IsActive = true;

            await _menuRepository.AddAsync(menu, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            _logger.LogInformation("Menu '{MenuName}' with code '{MenuCode}' created successfully by user {UserId}",
                menu.Name, menu.Code, menu.CreatedByUserId);

            return Result<Menu, DomainError>.Success(menu);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error creating menu '{MenuName}' with code '{MenuCode}'", menu.Name, menu.Code);
            return Result<Menu, DomainError>.Failure(DomainError.Internal("MENU_CREATE_ERROR",
                "An error occurred while creating the menu. Please try again."));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var menu = await _menuRepository.GetByIdAsync(id, cancellationToken);
            if (menu == null)
                return Result<bool, DomainError>.Failure(DomainError.NotFound("MENU_NOT_FOUND",
                    $"Menu with ID {id} not found"));

            // Check if menu has children
            var hasChildren = await _menuRepository.GetFirstOrDefaultAsync(x => x.ParentId == id, cancellationToken);
            if (hasChildren?.Id > 0)
                return Result<bool, DomainError>.Failure(DomainError.Validation("MENU_HAS_CHILDREN",
                    "Cannot delete menu that has child menus. Please delete child menus first."));

            // Check if menu is referenced by other entities (e.g., user manuals, menu actions)
            // This would require additional repository methods to check references
            // For now, we'll proceed with deletion

            await _menuRepository.DeleteAsync(menu, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            _logger.LogInformation("Menu '{MenuName}' with ID {MenuId} deleted successfully", menu.Name, menu.Id);
            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error deleting menu with ID {Id}", id);
            return Result<bool, DomainError>.Failure(DomainError.Internal("MENU_DELETE_ERROR",
                "An error occurred while deleting the menu. Please try again."));
        }
    }

    public async Task<Result<IReadOnlyList<Menu>, DomainError>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        try
        {
            var menus = await _menuRepository.GetAllAsync(cancellationToken);
            _logger.LogDebug("Retrieved {Count} menus", menus.Count);
            return Result<IReadOnlyList<Menu>, DomainError>.Success(menus);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all menus");
            return Result<IReadOnlyList<Menu>, DomainError>.Failure(DomainError.Internal("MENU_RETRIEVE_ERROR",
                "An error occurred while retrieving menus. Please try again."));
        }
    }

    public async Task<Result<IReadOnlyList<Menu>, DomainError>> GetAllWithApplicationAsync(
        CancellationToken cancellationToken = default)
    {
        try
        {
            var menus = await _menuRepository.GetAllAsync(
                cancellationToken,
                MenuIncludes.Application);

            _logger.LogDebug("Retrieved {Count} menus with application information", menus.Count);
            return Result<IReadOnlyList<Menu>, DomainError>.Success(menus);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving menus with application information");
            return Result<IReadOnlyList<Menu>, DomainError>.Failure(DomainError.Internal("MENU_RETRIEVE_ERROR",
                "An error occurred while retrieving menus with application information. Please try again."));
        }
    }

    public async Task<Result<Menu, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var menu = await _menuRepository.GetByIdAsync(id, cancellationToken);
            if (menu == null)
            {
                _logger.LogWarning("Menu with ID {MenuId} not found", id);
                return Result<Menu, DomainError>.Failure(DomainError.NotFound("MENU_NOT_FOUND",
                    $"Menu with ID {id} not found"));
            }

            _logger.LogDebug("Retrieved menu '{MenuName}' with ID {MenuId}", menu.Name, menu.Id);
            return Result<Menu, DomainError>.Success(menu);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving menu with ID {MenuId}", id);
            return Result<Menu, DomainError>.Failure(DomainError.Internal("MENU_RETRIEVE_ERROR",
                "An error occurred while retrieving the menu. Please try again."));
        }
    }

    public async Task<Result<Menu, DomainError>> UpdateAsync(int id, MenuUpdate request, CancellationToken cancellationToken)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var menuFound = await _menuRepository.GetByIdAsync(id, cancellationToken);
            if (menuFound == null)
                return Result<Menu, DomainError>.Failure(DomainError.NotFound("MENU_NOT_FOUND",
                    $"Menu with ID {id} not found"));

            _mapper.Map(request, menuFound);

            // Validate business rules
            var validationResult = await ValidateMenuForUpdateAsync(menuFound, menuFound, cancellationToken);
            if (validationResult.IsFailure)
                return Result<Menu, DomainError>.Failure(validationResult.Error);

            // Check if code already exists within the same application (excluding current menu)
            var existingMenu = await _menuRepository.GetFirstOrDefaultAsync(
                x => x.Code == menuFound.Code && x.ApplicationId == menuFound.ApplicationId && x.Id != id,
                cancellationToken);

            if (existingMenu?.Id > 0)
                return Result<Menu, DomainError>.Failure(DomainError.Conflict("MENU_CODE_EXISTS",
                    $"Menu with code '{menuFound.Code}' already exists in the specified application"));

            // Validate parent menu exists and belongs to the same application
            if (menuFound.ParentId.HasValue)
            {
                if (menuFound.ParentId.Value == id)
                    return Result<Menu, DomainError>.Failure(DomainError.Validation("INVALID_PARENT_MENU",
                        "A menu cannot be its own parent"));

                var parentMenu = await _menuRepository.GetByIdAsync(menuFound.ParentId.Value, cancellationToken);
                if (parentMenu == null)
                    return Result<Menu, DomainError>.Failure(DomainError.NotFound("PARENT_MENU_NOT_FOUND",
                        $"Parent menu with ID {menuFound.ParentId.Value} not found"));

                if (parentMenu.ApplicationId != menuFound.ApplicationId)
                    return Result<Menu, DomainError>.Failure(DomainError.Validation("INVALID_PARENT_MENU",
                        "Parent menu must belong to the same application"));

                // Check for circular references
                if (await HasCircularReferenceAsync(id, menuFound.ParentId.Value, cancellationToken))
                    return Result<Menu, DomainError>.Failure(DomainError.Validation("CIRCULAR_REFERENCE",
                        "Cannot set parent menu as it would create a circular reference"));
            }

            menuFound.UpdatedAt = DateTime.UtcNow;

            await _menuRepository.UpdateAsync(menuFound, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            _logger.LogInformation("Menu '{MenuName}' with ID {MenuId} updated successfully by user {UserId}",
                menuFound.Name, menuFound.Id, menuFound.UpdatedByUserId);

            return Result<Menu, DomainError>.Success(menuFound);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error updating menu with ID {MenuId}", id);
            return Result<Menu, DomainError>.Failure(DomainError.Internal("MENU_UPDATE_ERROR",
                "An error occurred while updating the menu. Please try again."));
        }
    }

    private Task<Result<Menu, DomainError>> ValidateMenuForCreationAsync(Menu menu,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(menu.Code))
            return Task.FromResult(Result<Menu, DomainError>.Failure(DomainError.Validation("INVALID_CODE", "Menu code is required")));

        if (string.IsNullOrWhiteSpace(menu.Name))
            return Task.FromResult(Result<Menu, DomainError>.Failure(DomainError.Validation("INVALID_NAME", "Menu name is required")));

        return string.IsNullOrWhiteSpace(menu.Url)
            ? Task.FromResult(Result<Menu, DomainError>.Failure(DomainError.Validation("INVALID_URL", "Menu URL is required")))
            : menu.Order < 0
            ? Task.FromResult(Result<Menu, DomainError>.Failure(DomainError.Validation("INVALID_ORDER",
                "Menu order must be non-negative")))
            : menu.ApplicationId <= 0
            ? Task.FromResult(Result<Menu, DomainError>.Failure(DomainError.Validation("INVALID_APPLICATION",
                "Valid application ID is required")))
            : Task.FromResult(Result<Menu, DomainError>.Success(menu));
    }

    private Task<Result<Menu, DomainError>> ValidateMenuForUpdateAsync(Menu existingMenu, Menu updatedMenu,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(updatedMenu.Code))
            return Task.FromResult(Result<Menu, DomainError>.Failure(DomainError.Validation("INVALID_CODE", "Menu code is required")));

        if (string.IsNullOrWhiteSpace(updatedMenu.Name))
            return Task.FromResult(Result<Menu, DomainError>.Failure(DomainError.Validation("INVALID_NAME", "Menu name is required")));

        return string.IsNullOrWhiteSpace(updatedMenu.Url)
            ? Task.FromResult(Result<Menu, DomainError>.Failure(DomainError.Validation("INVALID_URL", "Menu URL is required")))
            : updatedMenu.Order < 0
            ? Task.FromResult(Result<Menu, DomainError>.Failure(DomainError.Validation("INVALID_ORDER",
                "Menu order must be non-negative")))
            : updatedMenu.ApplicationId <= 0
            ? Task.FromResult(Result<Menu, DomainError>.Failure(DomainError.Validation("INVALID_APPLICATION",
                "Valid application ID is required")))
            : Task.FromResult(Result<Menu, DomainError>.Success(updatedMenu));
    }

    private async Task<bool> HasCircularReferenceAsync(int menuId, int parentId, CancellationToken cancellationToken)
    {
        var currentParentId = (int?)parentId;
        var visitedMenus = new HashSet<int> { menuId };

        while (currentParentId.HasValue && currentParentId.Value > 0)
        {
            if (visitedMenus.Contains(currentParentId.Value))
                return true;

            visitedMenus.Add(currentParentId.Value);
            var parentMenu = await _menuRepository.GetByIdAsync(currentParentId.Value, cancellationToken);
            currentParentId = parentMenu?.ParentId;
        }

        return false;
    }
}

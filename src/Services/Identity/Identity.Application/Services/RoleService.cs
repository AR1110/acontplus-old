using MapsterMapper;

namespace Identity.Application.Services;

public class RoleService(IUnitOfWork unitOfWork, IMapper mapper) : IRoleService
{
    private readonly IRepository<Role> _roleRepository = unitOfWork.GetRepository<Role>();
    private readonly IMapper _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));

    public async Task<Result<IReadOnlyList<RoleItem>, DomainError>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var roles = await _roleRepository.GetAllAsync();
        var items = _mapper.Map<IReadOnlyList<RoleItem>>(roles.Where(r => !r.IsDeleted).ToList());
        return Result<IReadOnlyList<RoleItem>, DomainError>.Success(items);
    }

    public async Task<Result<RoleItem, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var role = await _roleRepository.GetByIdAsync(id);
        if (role == null || role.IsDeleted)
            return Result<RoleItem, DomainError>.Failure(DomainError.NotFound("ROLE_NOT_FOUND", "Role not found"));

        var item = _mapper.Map<RoleItem>(role);
        return Result<RoleItem, DomainError>.Success(item);
    }

    public async Task<Result<RoleCreatedResponse, DomainError>> AddAsync(RoleCreate request, int createdByUserId, CancellationToken cancellationToken = default)
    {
        var existingRoles = await _roleRepository.GetAllAsync();
        if (existingRoles.Any(r => r.Code == request.Code && !r.IsDeleted))
            return Result<RoleCreatedResponse, DomainError>.Failure(DomainError.Validation("DUPLICATE_CODE", "A role with this code already exists"));

        var role = _mapper.Map<Role>(request);
        role.CreatedByUserId = createdByUserId;

        await _roleRepository.AddAsync(role);
        await unitOfWork.SaveChangesAsync();

        var response = _mapper.Map<RoleCreatedResponse>(role);
        return Result<RoleCreatedResponse, DomainError>.Success(response);
    }

    public async Task<Result<RoleItem, DomainError>> UpdateAsync(int id, RoleUpdate request, int updatedByUserId, CancellationToken cancellationToken = default)
    {
        var role = await _roleRepository.GetByIdAsync(id);
        if (role == null || role.IsDeleted)
            return Result<RoleItem, DomainError>.Failure(DomainError.NotFound("ROLE_NOT_FOUND", "Role not found"));

        var existingRoles = await _roleRepository.GetAllAsync();
        if (existingRoles.Any(r => r.Code == request.Code && r.Id != id && !r.IsDeleted))
            return Result<RoleItem, DomainError>.Failure(DomainError.Validation("DUPLICATE_CODE", "A role with this code already exists"));

        _mapper.Map(request, role);
        role.UpdatedByUserId = updatedByUserId;

        await _roleRepository.UpdateAsync(role);
        await unitOfWork.SaveChangesAsync();

        var item = _mapper.Map<RoleItem>(role);
        return Result<RoleItem, DomainError>.Success(item);
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var role = await _roleRepository.GetByIdAsync(id);
        if (role == null || role.IsDeleted)
            return Result<bool, DomainError>.Failure(DomainError.NotFound("ROLE_NOT_FOUND", "Role not found"));

        role.IsDeleted = true;
        role.DeletedAt = DateTime.UtcNow;
        await _roleRepository.UpdateAsync(role);
        await unitOfWork.SaveChangesAsync();

        return Result<bool, DomainError>.Success(true);
    }
}

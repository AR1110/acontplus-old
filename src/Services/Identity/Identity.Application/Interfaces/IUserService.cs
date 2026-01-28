namespace Identity.Application.Interfaces;

/// <summary>
/// User management service interface
/// </summary>
public interface IUserService
{
    /// <summary>
    /// Get users with pagination using structured query
    /// </summary>
    Task<Result<PagedResult<UserResponse>, DomainError>> GetPaginatedAsync(PaginationRequest query, CancellationToken cancellationToken = default);

    /// <summary>
    /// Add user with result handling
    /// </summary>
    Task<Result<SpResponse, DomainError>> AddUserAsync(Dictionary<string, object> data);

    /// <summary>
    /// Update user with result handling
    /// </summary>
    Task<Result<SpResponse, DomainError>> UpdateUserAsync(Dictionary<string, object> data);

    /// <summary>
    /// Update user password
    /// </summary>
    Task<Result<SpResponse, DomainError>> UpdatePasswordAsync(Dictionary<string, object> parameters);

    /// <summary>
    /// Delete user
    /// </summary>
    Task<Result<SpResponse, DomainError>> DeleteAsync(Dictionary<string, object> data);

    /// <summary>
    /// Update user status
    /// </summary>
    Task<Result<SpResponse, DomainError>> UpdateStatus(int userId, int id, bool estado);
}

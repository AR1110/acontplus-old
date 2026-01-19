namespace Identity.Application.Services;

/// <summary>
/// User management service
/// </summary>
public class UserService(IUnitOfWork unitOfWork, ILogger<UserService> logger) : IUserService
{
    private readonly IAdoRepository _repository = unitOfWork.AdoRepository;
    private readonly ILogger<UserService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    /// <summary>
    /// Get users with pagination using structured query
    /// </summary>
    public async Task<Result<PagedResult<UserResponse>, DomainError>> GetPaginatedAsync(PaginationRequest query, CancellationToken cancellationToken = default)
    {
        try
        {
            var json = new
            {
                pageIndex = query.PageIndex,
                pageSize = query.PageSize,
                searchTerm = query.SearchTerm,
                sortBy = query.SortBy,
                sortDirection = query.SortDirection.ToString().ToLower()
            };

            var parameters = new Dictionary<string, object>
            {
                { "json", System.Text.Json.JsonSerializer.Serialize(json) }
            };

            var ds = await _repository.GetDataSetAsync("Config.GetUsers", parameters);
            if (DataValidation.DataSetIsNull(ds))
                return Result<PagedResult<UserResponse>, DomainError>.Failure(DomainError.NotFound("USER_NOT_FOUND", "No user data found"));

            var table = ds.Tables[0];
            var items = new List<UserResponse>();
            int totalRecords = 0;

            foreach (DataRow row in table.Rows)
            {
                if (totalRecords == 0)
                    totalRecords = Convert.ToInt32(row["TotalRecords"]);

                items.Add(new UserResponse(
                    Id: Convert.ToInt32(row["Id"]),
                    IdCard: Convert.ToString(row["IdCard"]),
                    Username: Convert.ToString(row["Username"]) ?? "",
                    Email: Convert.ToString(row["Email"]) ?? "",
                    Fullname: Convert.ToString(row["Fullname"]),
                    Estado: Convert.ToBoolean(row["estado"]),
                    FirstName: Convert.ToString(row["firstName"]),
                    LastName: Convert.ToString(row["lastName"])
                ));
            }

            var result = new PagedResult<UserResponse>(items, query.PageIndex, query.PageSize, totalRecords);
            return Result<PagedResult<UserResponse>, DomainError>.Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user data");
            return Result<PagedResult<UserResponse>, DomainError>.Failure(DomainError.Internal("USER_GET_ERROR", ex.Message));
        }
    }

    /// <summary>
    /// Add user with result handling
    /// </summary>
    public async Task<Result<SpResponse, DomainError>> AddUserAsync(Dictionary<string, object> parameters)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var result = await _repository.QuerySingleOrDefaultAsync<SpResponse>("Config.User_Insert", parameters);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<SpResponse, DomainError>.Success(result ?? new SpResponse { Code = "50000", Message = "No response from database" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error adding user");
            return Result<SpResponse, DomainError>.Failure(DomainError.Internal("USER_ADD_ERROR", ex.Message));
        }
    }

    /// <summary>
    /// Update user with result handling
    /// </summary>
    public async Task<Result<SpResponse, DomainError>> UpdateUserAsync(Dictionary<string, object> parameters)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var result = await _repository.QuerySingleOrDefaultAsync<SpResponse>("Config.User_Update", parameters);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<SpResponse, DomainError>.Success(result ?? new SpResponse { Code = "50000", Message = "No response from database" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error updating user");
            return Result<SpResponse, DomainError>.Failure(DomainError.Internal("USER_UPDATE_ERROR", ex.Message));
        }
    }

    /// <summary>
    /// Update user password
    /// </summary>
    public async Task<Result<SpResponse, DomainError>> UpdatePasswordAsync(Dictionary<string, object> parameters)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var result = await _repository.QuerySingleOrDefaultAsync<SpResponse>("Config.User_Password_Reset", parameters);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<SpResponse, DomainError>.Success(result ?? new SpResponse { Code = "50000", Message = "No response from database" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error updating user password");
            return Result<SpResponse, DomainError>.Failure(DomainError.Internal("USER_UPDATE_PASSWORD_ERROR", ex.Message));
        }
    }

    /// <summary>
    /// Delete user
    /// </summary>
    public async Task<Result<SpResponse, DomainError>> DeleteAsync(Dictionary<string, object> data)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var result = await _repository.QuerySingleOrDefaultAsync<SpResponse>("Config.User_Delete", data);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<SpResponse, DomainError>.Success(result ?? new SpResponse { Code = "50000", Message = "No response from database" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error deleting user");
            return Result<SpResponse, DomainError>.Failure(DomainError.Internal("USER_DELETE_ERROR", ex.Message));
        }
    }

    /// <summary>
    /// Update user status
    /// </summary>
    public async Task<Result<SpResponse, DomainError>> UpdateStatus(int userId, int id, bool estado)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var query = @"UPDATE Acontplus.App.UsuarioRol SET estado = @estado WHERE idUsuario = @id
                         UPDATE Acontplus.dbo.Usuario SET estado = @estado WHERE idUsuario = @id";
            var options = new CommandOptionsDto
            {
                CommandType = CommandType.Text
            };
            var rowsAffected = await _repository.ExecuteNonQueryAsync(query,
                new Dictionary<string, object> { { "@id", id }, { "@estado", estado } }, options);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            var response = rowsAffected > 0
                ? new SpResponse { Code = "0", Message = "Actualizado exitosamente " }
                : new SpResponse { Code = "50001", Message = "No se puedo " };
            return Result<SpResponse, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error updating user status for ID {Id}", id);
            return Result<SpResponse, DomainError>.Failure(DomainError.Internal("USER_UPDATE_STATUS_ERROR", ex.Message));
        }
    }
}

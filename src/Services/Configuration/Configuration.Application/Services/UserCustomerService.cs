using Acontplus.Core.Dtos.Requests;

namespace Configuration.Application.Services;

public class UserCustomerService(IUnitOfWork unitOfWork, ILogger<UserCustomerService> logger) : IUserCustomerService
{
    private readonly IAdoRepository _repository = unitOfWork.AdoRepository;
    private readonly ILogger<UserCustomerService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    public async Task<Result<PagedResult<UserCustomerResponse>, DomainError>> GetAsync(PaginationRequest query, CancellationToken cancellationToken = default)
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
                return Result<PagedResult<UserCustomerResponse>, DomainError>.Failure(DomainError.NotFound("USER_CUSTOMER_NOT_FOUND", "No user customer data found"));

            var table = ds.Tables[0];
            var items = new List<UserCustomerResponse>();
            int totalRecords = 0;

            foreach (DataRow row in table.Rows)
            {
                if (totalRecords == 0)
                    totalRecords = Convert.ToInt32(row["TotalRecords"]);

                items.Add(new UserCustomerResponse(
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

            var result = new PagedResult<UserCustomerResponse>(items, query.PageIndex, query.PageSize, totalRecords);
            return Result<PagedResult<UserCustomerResponse>, DomainError>.Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user customer data");
            return Result<PagedResult<UserCustomerResponse>, DomainError>.Failure(DomainError.Internal("USER_CUSTOMER_GET_ERROR", ex.Message));
        }
    }

    public async Task<Result<SpResponse, DomainError>> AddAsync(Dictionary<string, object> parameters)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var result = await _repository.QuerySingleOrDefaultAsync<SpResponse>("Config.UserCustomer_Insert", parameters);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<SpResponse, DomainError>.Success(result ?? new SpResponse { Code = "50000", Message = "No response from database" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error adding user customer");
            return Result<SpResponse, DomainError>.Failure(DomainError.Internal("USER_CUSTOMER_ADD_ERROR", ex.Message));
        }
    }

    public async Task<Result<SpResponse, DomainError>> UpdateAsync(Dictionary<string, object> parameters)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var result = await _repository.QuerySingleOrDefaultAsync<SpResponse>("Config.UserCustomer_Update", parameters);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<SpResponse, DomainError>.Success(result ?? new SpResponse { Code = "50000", Message = "No response from database" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error updating user customer");
            return Result<SpResponse, DomainError>.Failure(DomainError.Internal("USER_CUSTOMER_UPDATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<SpResponse, DomainError>> DeleteAsync(Dictionary<string, object> parameters)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var result = await _repository.QuerySingleOrDefaultAsync<SpResponse>("Config.UserCustomer_Delete", parameters);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<SpResponse, DomainError>.Success(result ?? new SpResponse { Code = "50000", Message = "No response from database" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error deleting user customer");
            return Result<SpResponse, DomainError>.Failure(DomainError.Internal("USER_CUSTOMER_DELETE_ERROR", ex.Message));
        }
    }

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
            _logger.LogError(ex, "Error updating user customer status for ID {Id}", id);
            return Result<SpResponse, DomainError>.Failure(DomainError.Internal("USER_CUSTOMER_UPDATE_STATUS_ERROR", ex.Message));
        }
    }

    public async Task<Result<SpResponse, DomainError>> UpdatePasswordAsync(Dictionary<string, object> parameters)
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            var result = await _repository.QuerySingleOrDefaultAsync<SpResponse>("Config.UserCustomer_Password_Reset", parameters);
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<SpResponse, DomainError>.Success(result ?? new SpResponse { Code = "50000", Message = "No response from database" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error updating user customer password");
            return Result<SpResponse, DomainError>.Failure(DomainError.Internal("USER_CUSTOMER_UPDATE_PASSWORD_ERROR", ex.Message));
        }
    }
}

namespace Common.Application.Services;

public class BugsService(IUnitOfWork unitOfWork, ILogger<BugsService> logger) : IBugsService
{
    private readonly IAdoRepository _adoSqlServer = unitOfWork.AdoRepository;
    private readonly ILogger<BugsService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    public async Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters)
    {
        try
        {
            var ds = await _adoSqlServer.GetDataSetAsync("Common.Bugs_Get", parameters);
            return DataValidation.DataSetIsNull(ds)
                ? Result<dynamic, DomainError>.Failure(DomainError.NotFound("BUGS_NOT_FOUND", "No bugs data found"))
                : Result<dynamic, DomainError>.Success(DataConverters.DataSetToJson(ds));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving bugs data");
            return Result<dynamic, DomainError>.Failure(DomainError.Internal("BUGS_GET_ERROR", ex.Message));
        }
    }
}

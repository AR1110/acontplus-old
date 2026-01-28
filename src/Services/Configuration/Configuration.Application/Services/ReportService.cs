namespace Configuration.Application.Services;

public class ReportService : IReportService
{
    private readonly IAdoRepository _adoRepository;
    private readonly ILogger<ReportService> _logger;
    private readonly IMapper _mapper;

    public ReportService(IUnitOfWork unitOfWork, ILogger<ReportService> logger, IMapper mapper)
    {
        ArgumentNullException.ThrowIfNull(unitOfWork);
        _adoRepository = unitOfWork.AdoRepository;
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Result<dynamic, DomainError>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var parameters = new Dictionary<string, object>
            {
                { "userId", 0 },
                { "json", "{}" }
            };

            var ds = await _adoRepository.GetDataSetAsync("Config.GetReports", parameters);

            return DataValidation.DataSetIsNull(ds)
                ? Result<dynamic, DomainError>.Failure(
                    DomainError.NotFound("REPORTS_NOT_FOUND", "Reports not found"))
                : Result<dynamic, DomainError>.Success(DataConverters.DataSetToJson(ds));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all reports");
            return Result<dynamic, DomainError>.Failure(
                DomainError.Internal("REPORTS_RETRIEVAL_ERROR", "Error retrieving reports"));
        }
    }

    public async Task<Result<dynamic, DomainError>> AddAsync(ReportCreate request, CancellationToken cancellationToken = default)
    {
        try
        {
            var report = _mapper.Map<ReportCreate, Report>(request);
            var parameters = new Dictionary<string, object>
            {
                { "userId", report.CreatedByUserId ?? 0 },
                { "json", DataConverters.SerializeObjectCustom<object>(report) }
            };

            var response = await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Config.InsertReport", parameters);

            if (response == null)
                return Result<dynamic, DomainError>.Failure(
                    DomainError.Internal("REPORT_CREATION_ERROR", "No response from database"));

            return !response.IsSuccess
                ? Result<dynamic, DomainError>.Failure(
                    DomainError.Validation("REPORT_CREATION_ERROR", response.Message ?? "Unknown error"))
                : Result<dynamic, DomainError>.Success(response.Message ?? "Success");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating report");
            return Result<dynamic, DomainError>.Failure(
                DomainError.Internal("REPORT_CREATION_ERROR", "Error creating report"));
        }
    }

    public async Task<Result<dynamic, DomainError>> UpdateAsync(int id, ReportUpdate request, CancellationToken cancellationToken = default)
    {
        try
        {
            var report = _mapper.Map<ReportUpdate, Report>(request);
            var parameters = new Dictionary<string, object>
            {
                { "userId", report.UpdatedByUserId ?? 0 },
                { "id", id },
                { "json", DataConverters.SerializeObjectCustom<object>(report) }
            };

            var response = await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Config.UpdateReport", parameters);

            if (response == null)
                return Result<dynamic, DomainError>.Failure(
                    DomainError.Internal("REPORT_UPDATE_ERROR", "No response from database"));

            if (!response.IsSuccess)
                return Result<dynamic, DomainError>.Failure(
                    DomainError.Validation("REPORT_UPDATE_ERROR", response.Message ?? "Unknown error"));

            // For now, return a mock response since we need to parse the JSON structure
            return Result<dynamic, DomainError>.Success(response.Message ?? "Success");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating report with ID {ReportId}", id);
            return Result<dynamic, DomainError>.Failure(
                DomainError.Internal("REPORT_UPDATE_ERROR", "Error updating report"));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var parameters = new Dictionary<string, object>
            {
                { "userId", 0 },
                { "id", id }
            };

            var response = await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Config.DeleteReport", parameters);

            if (response == null)
                return Result<bool, DomainError>.Failure(
                    DomainError.Internal("REPORT_DELETE_ERROR", "No response from database"));

            return !response.IsSuccess
                ? Result<bool, DomainError>.Failure(
                    DomainError.Validation("REPORT_DELETE_ERROR", response.Message ?? "Unknown error"))
                : Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting report with ID {ReportId}", id);
            return Result<bool, DomainError>.Failure(
                DomainError.Internal("REPORT_DELETE_ERROR", "Error deleting report"));
        }
    }
}

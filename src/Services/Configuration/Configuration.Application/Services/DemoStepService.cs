using Acontplus.Core.Abstractions.Context;
using Configuration.Application.Interfaces;

namespace Configuration.Application.Services;

public class DemoStepService : Interfaces.IDemoStepService
{
    private readonly IRepository<DemoStep> _demoStepRepository;
    private readonly ILogger<DemoStepService> _logger;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public DemoStepService(IUnitOfWork unitOfWork, ILogger<DemoStepService> logger, IMapper mapper)
    {
        ArgumentNullException.ThrowIfNull(unitOfWork);
        _unitOfWork = unitOfWork;
        _demoStepRepository = _unitOfWork.GetRepository<DemoStep>();
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Result<DemoStepItem, DomainError>> AddAsync(DemoStepCreate request, IUserContext userContext,
        CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var demoStep = _mapper.Map<DemoStepCreate, DemoStep>(request);
            demoStep.CreatedByUserId = userContext.GetUserId();

            var existsResponse = await ExistsByCodeAsync(demoStep.Code, cancellationToken: cancellationToken);
            if (existsResponse.IsSuccess && existsResponse.Value)
                return Result<DemoStepItem, DomainError>.Failure(DomainError.Validation("DEMOSTEP_CODE_EXISTS",
                    "El código ya existe"));
            await _demoStepRepository.AddAsync(demoStep, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            var response = _mapper.Map<DemoStep, DemoStepItem>(demoStep);
            return Result<DemoStepItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error creating demo step");
            return Result<DemoStepItem, DomainError>.Failure(DomainError.Internal("DEMOSTEP_CREATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var demoStep = await _demoStepRepository.GetByIdAsync(id, cancellationToken);
            if (demoStep == null)
                return Result<bool, DomainError>.Failure(DomainError.Validation("DEMOSTEP_NOT_FOUND",
                    "DemoStep no encontrado"));
            await _demoStepRepository.DeleteAsync(demoStep, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error deleting demo step with ID {Id}", id);
            return Result<bool, DomainError>.Failure(DomainError.Internal("DEMOSTEP_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<IReadOnlyList<DemoStepItem>, DomainError>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        try
        {
            var demoSteps = await _demoStepRepository.GetAllAsync(cancellationToken);
            var responses = _mapper.Map<IReadOnlyList<DemoStep>, IReadOnlyList<DemoStepItem>>(demoSteps);
            return Result<IReadOnlyList<DemoStepItem>, DomainError>.Success(responses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving demo steps");
            return Result<IReadOnlyList<DemoStepItem>, DomainError>.Failure(DomainError.Internal("DEMOSTEP_GETALL_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<DemoStepItem, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var demoStep = await _demoStepRepository.GetByIdAsync(id, cancellationToken);
            if (demoStep == null)
                return Result<DemoStepItem, DomainError>.Failure(DomainError.Validation("DEMOSTEP_NOT_FOUND",
                    "DemoStep no encontrado"));

            var response = _mapper.Map<DemoStep, DemoStepItem>(demoStep);
            return Result<DemoStepItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving demo step with ID {Id}", id);
            return Result<DemoStepItem, DomainError>.Failure(DomainError.Internal("DEMOSTEP_GETBYID_ERROR", ex.Message));
        }
    }

    public async Task<Result<DemoStepItem, DomainError>> UpdateAsync(int id, DemoStepUpdate request, IUserContext userContext,
        CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var demoStepFound = await _demoStepRepository.GetByIdAsync(id, cancellationToken);
            if (demoStepFound == null)
                return Result<DemoStepItem, DomainError>.Failure(DomainError.Validation("DEMOSTEP_NOT_FOUND",
                    "DemoStep no encontrado"));
            var existsResponse = await ExistsByCodeAsync(request.Code, id, cancellationToken);
            if (existsResponse.IsSuccess && existsResponse.Value)
                return Result<DemoStepItem, DomainError>.Failure(DomainError.Validation("DEMOSTEP_CODE_EXISTS",
                    "El código ya existe"));
            demoStepFound.Code = request.Code;
            demoStepFound.Name = request.Name;
            demoStepFound.Description = request.Description;
            demoStepFound.Mandatory = request.Mandatory;
            demoStepFound.UpdatedByUserId = userContext.GetUserId();
            await _demoStepRepository.UpdateAsync(demoStepFound, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            var response = _mapper.Map<DemoStep, DemoStepItem>(demoStepFound);
            return Result<DemoStepItem, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error updating demo step with ID {Id}", id);
            return Result<DemoStepItem, DomainError>.Failure(DomainError.Internal("DEMOSTEP_UPDATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> ExistsByCodeAsync(string code, int? excludeId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var all = await _demoStepRepository.GetAllAsync(cancellationToken);
            var exists = all.Any(x => x.Code == code && (!excludeId.HasValue || x.Id != excludeId.Value));
            return Result<bool, DomainError>.Success(exists);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if demo step code exists");
            return Result<bool, DomainError>.Failure(DomainError.Internal("DEMOSTEP_EXISTS_ERROR", ex.Message));
        }
    }
}

using Acontplus.Notifications.Entities;

namespace Configuration.Application.Services;

public class WhatsappUsageService : IWhatsappUsageService
{
    private readonly ILogger<WhatsappUsageService> _logger;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<WhatsAppUsage> _whatsappUsageRepository;
    private readonly IMapper _mapper;

    public WhatsappUsageService(IUnitOfWork unitOfWork, ILogger<WhatsappUsageService> logger, IMapper mapper)
    {
        ArgumentNullException.ThrowIfNull(unitOfWork);
        _unitOfWork = unitOfWork;
        _whatsappUsageRepository = _unitOfWork.GetRepository<WhatsAppUsage>();
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<Result<WhatsAppUsageItem, DomainError>> AddAsync(WhatsAppUsageItem WhatsAppUsageItem,
        CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var existsResponse = await GetByCompanyIdAsync(WhatsAppUsageItem.CompanyId, cancellationToken);
            if (existsResponse.IsSuccess)
                return Result<WhatsAppUsageItem, DomainError>.Failure(DomainError.Validation(
                    "WHATSAPP_USAGE_COMPANY_EXISTS", "Ya existe una configuración de WhatsApp para esta empresa"));

            var whatsAppUsage = _mapper.Map<WhatsAppUsageItem, WhatsAppUsage>(WhatsAppUsageItem);
            await _whatsappUsageRepository.AddAsync(whatsAppUsage, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            return Result<WhatsAppUsageItem, DomainError>.Success(WhatsAppUsageItem);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error creating WhatsApp usage");
            return Result<WhatsAppUsageItem, DomainError>.Failure(DomainError.Internal("WHATSAPP_USAGE_CREATE_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await _unitOfWork.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        try
        {
            var whatsAppUsage = await _whatsappUsageRepository.GetByIdAsync(id, cancellationToken);
            if (whatsAppUsage == null)
                return Result<bool, DomainError>.Failure(DomainError.Validation("WHATSAPP_USAGE_NOT_FOUND",
                    "WhatsApp usage not found"));

            await _whatsappUsageRepository.DeleteAsync(whatsAppUsage, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            return Result<bool, DomainError>.Success(true);
        }
        catch (Exception ex)
        {
            if (!transaction.IsCompleted) await transaction.RollbackAsync(cancellationToken);

            _logger.LogError(ex, "Error deleting WhatsApp usage with ID {Id}", id);
            return Result<bool, DomainError>.Failure(DomainError.Internal("WHATSAPP_USAGE_DELETE_ERROR", ex.Message));
        }
    }

    public async Task<Result<IReadOnlyList<WhatsAppUsageItem>, DomainError>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        try
        {
            var whatsAppUsages = await _whatsappUsageRepository.GetAllAsync(cancellationToken);
            var whatsAppUsagesDto =
                _mapper.Map<IReadOnlyList<WhatsAppUsage>, IReadOnlyList<WhatsAppUsageItem>>(whatsAppUsages);
            return Result<IReadOnlyList<WhatsAppUsageItem>, DomainError>.Success(whatsAppUsagesDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving WhatsApp usages");
            return Result<IReadOnlyList<WhatsAppUsageItem>, DomainError>.Failure(
                DomainError.Internal("WHATSAPP_USAGE_GETALL_ERROR", ex.Message));
        }
    }

    public async Task<Result<WhatsAppUsageItem, DomainError>> GetByIdAsync(int id,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var whatsAppUsage = await _whatsappUsageRepository.GetByIdAsync(id, cancellationToken);
            if (whatsAppUsage == null)
                return Result<WhatsAppUsageItem, DomainError>.Failure(DomainError.Validation("WHATSAPP_USAGE_NOT_FOUND",
                    "Configuración de WhatsApp no encontrada"));

            var WhatsAppUsageItem = _mapper.Map<WhatsAppUsage, WhatsAppUsageItem>(whatsAppUsage);

            return Result<WhatsAppUsageItem, DomainError>.Success(WhatsAppUsageItem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving WhatsApp usage with ID {Id}", id);
            return Result<WhatsAppUsageItem, DomainError>.Failure(DomainError.Internal("WHATSAPP_USAGE_GETBYID_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<WhatsAppUsageItem, DomainError>> UpdateAsync(int id, WhatsAppUsageItem WhatsAppUsageItem,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var whatsAppUsageFound = await _whatsappUsageRepository.GetByIdAsync(id, cancellationToken);
            if (whatsAppUsageFound == null)
                return Result<WhatsAppUsageItem, DomainError>.Failure(DomainError.Validation("WHATSAPP_USAGE_NOT_FOUND",
                    "Configuración de WhatsApp no encontrada"));

            // Check if another record exists for the same company (excluding current record)
            var allUsages = await _whatsappUsageRepository.GetAllAsync(cancellationToken);
            var existsForCompany = allUsages.Any(x => x.CompanyId == WhatsAppUsageItem.CompanyId && x.Id != id);
            if (existsForCompany)
                return Result<WhatsAppUsageItem, DomainError>.Failure(DomainError.Validation(
                    "WHATSAPP_USAGE_COMPANY_EXISTS", "Ya existe una configuración de WhatsApp para esta empresa"));

            whatsAppUsageFound.CompanyId = WhatsAppUsageItem.CompanyId;
            whatsAppUsageFound.StartDate = WhatsAppUsageItem.StartDate;
            whatsAppUsageFound.EndDate = WhatsAppUsageItem.EndDate;
            whatsAppUsageFound.UpdatedByUserId = WhatsAppUsageItem.UpdatedByUserId ?? 0;

            await _whatsappUsageRepository.UpdateAsync(whatsAppUsageFound, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result<WhatsAppUsageItem, DomainError>.Success(WhatsAppUsageItem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating WhatsApp usage with ID {Id}", id);
            return Result<WhatsAppUsageItem, DomainError>.Failure(DomainError.Internal("WHATSAPP_USAGE_UPDATE_ERROR",
                ex.Message));
        }
    }

    public async Task<Result<WhatsAppUsageItem, DomainError>> GetByCompanyIdAsync(int companyId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var allUsages = await _whatsappUsageRepository.GetAllAsync(cancellationToken);
            var whatsAppUsage = allUsages.FirstOrDefault(x => x.CompanyId == companyId);

            if (whatsAppUsage == null)
                return Result<WhatsAppUsageItem, DomainError>.Failure(DomainError.Validation("WHATSAPP_USAGE_NOT_FOUND",
                    "Configuración de WhatsApp no encontrada para esta empresa"));

            var WhatsAppUsageItem = _mapper.Map<WhatsAppUsage, WhatsAppUsageItem>(whatsAppUsage);
            return Result<WhatsAppUsageItem, DomainError>.Success(WhatsAppUsageItem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving WhatsApp usage for company ID {CompanyId}", companyId);
            return Result<WhatsAppUsageItem, DomainError>.Failure(DomainError.Internal(
                "WHATSAPP_USAGE_GETBYCOMPANY_ERROR",
                ex.Message));
        }
    }
}

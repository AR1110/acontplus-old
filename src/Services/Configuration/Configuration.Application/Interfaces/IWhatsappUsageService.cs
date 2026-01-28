namespace Configuration.Application.Interfaces;

public interface IWhatsappUsageService
{
    Task<Result<WhatsAppUsageItem, DomainError>> AddAsync(WhatsAppUsageItem WhatsAppUsageItem,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<WhatsAppUsageItem>, DomainError>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<Result<WhatsAppUsageItem, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<WhatsAppUsageItem, DomainError>> UpdateAsync(int id, WhatsAppUsageItem WhatsAppUsageItem,
        CancellationToken cancellationToken = default);

    Task<Result<WhatsAppUsageItem, DomainError>> GetByCompanyIdAsync(int companyId,
        CancellationToken cancellationToken = default);
}
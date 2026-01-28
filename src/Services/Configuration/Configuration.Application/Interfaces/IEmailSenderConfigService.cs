namespace Configuration.Application.Interfaces;

public interface IEmailSenderConfigService
{
    Task<Result<EmailSenderConfigItem, DomainError>> AddAsync(EmailSenderConfigCreate request, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<EmailSenderConfigItem>, DomainError>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Result<EmailSenderConfigItem, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Result<EmailSenderConfigItem, DomainError>> UpdateAsync(int id, EmailSenderConfigUpdate request, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> ExistsByCompanyAsync(int companyId, CancellationToken cancellationToken = default);
}

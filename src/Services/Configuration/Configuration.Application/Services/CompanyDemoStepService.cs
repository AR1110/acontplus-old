using Configuration.Application.Interfaces;

namespace Configuration.Application.Services;

public class CompanyDemoStepService(IUnitOfWork unitOfWork)
    : Interfaces.ICompanyDemoStepService
{
    private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;

    public async Task<Result<dynamic, DomainError>> CompleteStepsAsync()
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);
        try
        {
            await _adoRepository.ExecuteNonQueryAsync("Config.CompanyDemoStep_Complete_Steps");
            await unitOfWork.SaveChangesAsync();
            await transaction.CommitAsync();
            return Result<dynamic, DomainError>.Success("Pasos completados exitosamente");
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return Result<dynamic, DomainError>.Failure(DomainError.Internal("COMPLETE_STEPS_ERROR", ex.Message));
        }
    }
}

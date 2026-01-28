namespace Configuration.Application.Interfaces;

public interface ICompanyDemoStepService
{
    Task<Result<dynamic, DomainError>> CompleteStepsAsync();
}
using Acontplus.Core.Abstractions.Context;

namespace Configuration.Application.Interfaces;

public interface IEc2InstanceService
{
    Task<Result<Ec2InstanceItem, DomainError>> AddAsync(Ec2InstanceCreate request, IUserContext userContext, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<Ec2Instance>, DomainError>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Result<Ec2Instance, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Result<Ec2InstanceItem, DomainError>> UpdateAsync(int id, Ec2InstanceUpdate request, IUserContext userContext, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> UpdateExternalAsync(List<Ec2InstanceItem> instances, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> ExistsAsync(string instanceId, int? excludeId = null, CancellationToken cancellationToken = default);
}

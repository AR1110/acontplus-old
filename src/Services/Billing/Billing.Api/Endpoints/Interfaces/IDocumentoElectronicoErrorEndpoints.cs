namespace Billing.Api.Endpoints.Interfaces;

public interface IDocumentoElectronicoErrorEndpoints
{
    Task<IResult> GetDocumentoElectronicoErrorByIdAsync(int id);
}

namespace Billing.API.Endpoints.Interfaces;

public interface IDocumentoElectronicoErrorEndpoints
{
    Task<IResult> GetDocumentoElectronicoErrorByIdAsync(int id);
}

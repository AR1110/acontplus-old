namespace Contabilidad.API.Endpoints.Interfaces
{
    public interface ICuotaPorCobrarEndpoints
    {
        Task<IResult> UpdateAsync(CuotaPorCobrarUpdateDto param);
    }
}

namespace ApiConfig.Interfaces
{
    public interface IEstablecimientoAsignacionService
    {
        Task<string> GetAsync(Dictionary<string, object> parameters);
    }
}

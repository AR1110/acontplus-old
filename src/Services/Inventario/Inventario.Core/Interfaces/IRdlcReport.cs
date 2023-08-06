namespace Inventario.Core.Interfaces
{
    public interface IRdlcReport
    {
        public Task<byte[]> Create(string spparams, string spname, string filename, string format);
    }
}
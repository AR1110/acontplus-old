namespace Common.Core.Interfaces
{
    public interface ITransaccionService
    {
        public void Process(Dictionary<string, object> parameters);
    }
}

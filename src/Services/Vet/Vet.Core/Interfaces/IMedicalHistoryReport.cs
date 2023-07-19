namespace Vet.Core.Interfaces
{
    public interface IMedicalHistoryReport
    {
        public Task<byte[]> GetAsync(int id);
    }
}

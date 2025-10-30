namespace Purchases.Application.Interfaces;

public interface IFileTextService
{
    Task<DataTable> GetDocsAsync(byte[] fileTxt);
}

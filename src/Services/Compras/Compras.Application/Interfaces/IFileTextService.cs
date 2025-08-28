using System.Data;

namespace Compras.Application.Interfaces;

public interface IFileTextService
{
    Task<DataTable> GetDocsAsync(byte[] fileTxt);
}

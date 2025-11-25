namespace Configuration.Api.Helpers;

public class FileUpload
{
    public async Task<bool> Upload(string _path, string fileName, byte[] content)
    {
        var path = Path.Combine(_path, fileName);
        if (File.Exists(path)) File.Delete(path);

        await File.WriteAllBytesAsync(path, content);
        return File.Exists(path);
    }
}
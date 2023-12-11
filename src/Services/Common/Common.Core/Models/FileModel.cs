namespace Common.Core.Models
{
    public class FileModel
    {
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public byte[] Content { get; set; }
        public string Base64 { get; set; }
        public void Create(byte[] content, string contentType, string fileName = null)
        {
            Content = content;
            ContentType = contentType;
            FileName = fileName;
            Base64 = Convert.ToBase64String(content, 0, content.Length);
        }
    }
}

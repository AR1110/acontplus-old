namespace NotifierWS
{
    public class FileModel
    {
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public byte[] Content { get; set; }
        public void Create(byte[] content, string contentType, string fileName = null)
        {
            this.Content = content;
            this.ContentType = contentType;
            this.FileName = fileName;
        }
    }
}

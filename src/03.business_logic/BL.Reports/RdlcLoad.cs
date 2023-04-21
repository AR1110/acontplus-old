namespace BL.Reports
{
    public static class RdlcLoad
    {
        public static MemoryStream LoadReportDefinition(string filePath)
        {
            MemoryStream memoryStream = new MemoryStream();
            using (FileStream fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
            {
                fileStream.CopyTo(memoryStream);
            }
            memoryStream.Seek(0, SeekOrigin.Begin);
            return memoryStream;
        }
    }
}

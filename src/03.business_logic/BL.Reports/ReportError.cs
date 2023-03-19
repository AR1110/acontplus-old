using HelpersNS20.Dtos;

namespace BL.Reports
{
    public static class ReportError
    {
        public static FileModelDto ReportNotFound(FileModelDto file)
        {
            string errorFilePath = "C:\\Acontplus\\ApiReports\\Reports\\NotFound.pdf";
            byte[] bytes = File.ReadAllBytes(errorFilePath);
            file.Create(bytes, "application/pdf", "NotFound.pdf");
            return file;
        }
    }
}

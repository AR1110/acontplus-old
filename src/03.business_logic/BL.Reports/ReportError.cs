using Domain.Models;

namespace BL.Reports
{
    public static class ReportError
    {
        public static FileModel ReportNotFound(FileModel file)
        {
            string errorFilePath = "C:\\Acontplus\\Services\\ApiReports\\Reports\\NotFound.pdf";
            byte[] bytes = File.ReadAllBytes(errorFilePath);
            file.Create(bytes, "application/pdf", "NotFound.pdf");
            return file;
        }
    }
}

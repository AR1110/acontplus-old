
using HelpersNS20.Dtos;

namespace ApiReports.Utils
{
    public static class ApiError
    {
        public static FileModelDto ReportNotFound(FileModelDto file)
        {
            string errorFilePath = System.Web.Hosting.HostingEnvironment.MapPath("~/Reports/" + "NotFound.pdf");
            byte[] bytes = System.IO.File.ReadAllBytes(errorFilePath);
            file.Create(bytes, "application/pdf", "NotFound.pdf");
            return file;
        }
    }
}
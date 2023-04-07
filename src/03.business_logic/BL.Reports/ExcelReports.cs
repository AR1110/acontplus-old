using ClosedXML.Excel; 
using System.Data;

namespace BL.Reports
{
    public static class ExcelReports
    {
        public static byte[] Export(DataTable dt, string worksheetName = null)
        {
            byte[] report;
            var workbook = new XLWorkbook();

            // Add the DataTable to a new worksheet in the workbook
            var worksheet = workbook.Worksheets.Add(dt, worksheetName ?? "MyWorksheet");

            // Save the workbook to a file or a stream
            using (var stream = new MemoryStream())
            {
                workbook.SaveAs(stream);
                report = stream.ToArray();
                
            }
            return report;
        }
    }
}

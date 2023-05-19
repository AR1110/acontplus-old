using ClosedXML.Excel;
using System.Data;

namespace BL.ExcelReports
{
    public static class ExcelReports
    {
        public static byte[] Export(DataSet ds, string worksheetName = null)
        {
            byte[] report;
            var workbook = new XLWorkbook();

            // Add the DataTable to a new worksheet in the workbook
            var i = 1;
            foreach (DataTable dt in ds.Tables)
            {
                if (dt.Rows.Count > 0)
                {
                    var worksheet = workbook.Worksheets.Add(dt, "Hoja - " + Convert.ToString(i));
                }
                i++;
            }

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

using iTextSharp.text;
using iTextSharp.text.pdf;
using System.Text;

namespace BL.PdfReports
{
    public class Example
    {
        public byte[] PdfExample()
        {
            MemoryStream workStream = new MemoryStream();
            StringBuilder status = new StringBuilder("");
            DateTime dTime = DateTime.Now;
            string strPDFFileName = string.Format("CustomerDetailPdf" + dTime.ToString("yyyyMMdd") + "-" + ".pdf");
            Document doc = new Document();
            doc.SetMargins(0, 0, 0, 0);
            PdfPTable tableLayout = new PdfPTable(4);
            doc.SetMargins(10, 10, 10, 0);
            PdfWriter.GetInstance(doc, workStream).CloseStream = false;
            doc.Open();
            BaseFont bf = BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
            iTextSharp.text.Font fontInvoice = new iTextSharp.text.Font(bf, 20, iTextSharp.text.Font.NORMAL);
            Paragraph paragraph = new Paragraph("Customers Detail", fontInvoice);
            paragraph.Alignment = Element.ALIGN_CENTER;
            doc.Add(paragraph);
            Paragraph p3 = new Paragraph();
            p3.SpacingAfter = 6;
            doc.Add(p3);
            doc.Add(Add_Content_To_PDF(tableLayout));
            doc.Close();
            return workStream.ToArray();
            //workStream.Write(byteInfo, 0, byteInfo.Length);
            //workStream.Position = 0;
            //return File(workStream, "application/pdf", strPDFFileName);
        }
        protected PdfPTable Add_Content_To_PDF(PdfPTable tableLayout)
        {
            float[] headers = { 50, 24, 45, 35 }; //Header Widths  
            tableLayout.SetWidths(headers); //Set the pdf headers  
            tableLayout.WidthPercentage = 100; //Set the PDF File witdh percentage  
            tableLayout.HeaderRows = 1;
            var count = 1;
            //Add header  
            AddCellToHeader(tableLayout, "CustomerName");
            AddCellToHeader(tableLayout, "Address");
            AddCellToHeader(tableLayout, "Email");
            AddCellToHeader(tableLayout, "ZipCode");

            foreach (var cust in customerData())
            {
                if (count >= 1)
                {
                    //Add body  
                    AddCellToBody(tableLayout, cust.CustomerName.ToString(), count);
                    AddCellToBody(tableLayout, cust.Address.ToString(), count);
                    AddCellToBody(tableLayout, cust.Email.ToString(), count);
                    AddCellToBody(tableLayout, cust.ZipCode.ToString(), count);
                    count++;
                }
            }
            return tableLayout;
        }
        private static void AddCellToHeader(PdfPTable tableLayout, string cellText)
        {
            tableLayout.AddCell(new PdfPCell(new Phrase(cellText, new Font(Font.HELVETICA, 8, 1, BaseColor.Black)))
            {
                HorizontalAlignment = Element.ALIGN_LEFT,
                Padding = 8,
                BackgroundColor = new iTextSharp.text.BaseColor(255, 255, 255)
            });
        }
        private static void AddCellToBody(PdfPTable tableLayout, string cellText, int count)
        {
            if (count % 2 == 0)
            {
                tableLayout.AddCell(new PdfPCell(new Phrase(cellText, new Font(Font.HELVETICA, 8, 1, iTextSharp.text.BaseColor.Black)))
                {
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    Padding = 8,
                    BackgroundColor = new iTextSharp.text.BaseColor(255, 255, 255)
                });
            }
            else
            {
                tableLayout.AddCell(new PdfPCell(new Phrase(cellText, new Font(Font.HELVETICA, 8, 1, iTextSharp.text.BaseColor.Black)))
                {
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    Padding = 8,
                    BackgroundColor = new iTextSharp.text.BaseColor(211, 211, 211)
                });
            }
        }
        public List<Customer> customerData()
        {
            List<Customer> customers = new List<Customer>()
            {
                new Customer(){ CustomerName="Gnanavel Sekar",Address="Surat",Email="GnanavelSekar@gmail.com",ZipCode="395003" },
                new Customer(){ CustomerName="Subash S",Address="Ahemdabad",Email="SubashS@gmail.com",ZipCode="395006" },
                new Customer(){ CustomerName="Robert A",Address="Surat",Email="RobertA@gmail.com",ZipCode="395005" },
                new Customer(){ CustomerName="Ammaiyappan",Address="Vadodara",Email="Ammaiyappan@gmail.com",ZipCode="395004" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" },
                new Customer(){ CustomerName="Huijoyan",Address="Surat",Email="Huijoyan@gmail.com",ZipCode="395008" }
            };
            return customers;
        }
    }
}

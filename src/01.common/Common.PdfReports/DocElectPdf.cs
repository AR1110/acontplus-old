using Domain.FactElect;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.Text;

namespace Common.PdfReports
{
    public class Customer
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string ZipCode { get; set; }
    }
    public class DocElectPdf
    {
        public byte[] PdfData(ComprobanteElectronico data)
        {

            MemoryStream workStream = new MemoryStream();
            StringBuilder status = new StringBuilder("");
            DateTime dTime = DateTime.Now;
            string strPDFFileName = string.Format("CustomerDetailPdf" + dTime.ToString("yyyyMMdd") + "-" + ".pdf");
            Document doc = new Document(PageSize.A4);
            doc.SetMargins(0, 0, 0, 0);
            PdfPTable tableLayout = new PdfPTable(4);
            doc.SetMargins(10, 10, 10, 0);
            PdfWriter writer = PdfWriter.GetInstance(doc, workStream);
            writer.CloseStream = false;
            doc.Open();


            PdfPTable pdfTable = new PdfPTable(3);
            pdfTable.DefaultCell.Padding = 2;
            pdfTable.WidthPercentage = 100;
            pdfTable.HorizontalAlignment = Element.ALIGN_LEFT;
            pdfTable.DefaultCell.BorderWidth = 1;
            pdfTable.SetWidths(new float[] { 0.1f, 0.01f, 0.1f });
            BaseFont bfCalibri = BaseFont.CreateFont("c:\\windows\\fonts\\calibri.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            iTextSharp.text.Font calibri = new iTextSharp.text.Font(bfCalibri, 12);
            iTextSharp.text.Font calibri6 = new iTextSharp.text.Font(bfCalibri, 10);
            iTextSharp.text.Font boldStyle = new iTextSharp.text.Font(bfCalibri, 10, Font.BOLD);

            //int[,] arry = new int [1,2];
            //Adding DataRow  
            //foreach (DataGridViewRow row in ListDataGridView.Rows)
            //{

            RoundRectangle rr1 = new RoundRectangle();

            PdfPCell pdfCell = new PdfPCell();
            pdfCell.CellEvent = rr1;
            pdfCell.Border = Rectangle.NO_BORDER;
            PdfPTable tmpTable = new PdfPTable(1);
            tmpTable.WidthPercentage = 100;
            PdfPCell tmpCell = new PdfPCell();
            tmpCell.FixedHeight = 60;
            tmpCell.HorizontalAlignment = Element.ALIGN_CENTER;
            tmpCell.VerticalAlignment = Element.ALIGN_MIDDLE;
            tmpCell.BorderWidth = 1;
            tmpCell.PaddingRight = 2;
            //tmpTable.AddCell(tmpCell);  
            tmpTable.DefaultCell.BorderWidth = 0;
            tmpTable.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
            tmpTable.DefaultCell.HorizontalAlignment = Element.ALIGN_CENTER;
            tmpTable.AddCell(new Paragraph("test", calibri));
            pdfCell.AddElement(tmpTable);
            pdfTable.AddCell(pdfCell);




            PdfPCell pdfCellBlank = new PdfPCell();
            PdfPTable tmpTableBlank = new PdfPTable(1);
            tmpTableBlank.WidthPercentage = 1;
            PdfPCell tmpCellBlank = new PdfPCell();
            tmpCellBlank.FixedHeight = 1;
            tmpCellBlank.HorizontalAlignment = Element.ALIGN_CENTER;
            tmpCellBlank.VerticalAlignment = Element.ALIGN_MIDDLE;
            tmpCellBlank.BorderWidth = 1;
            //tmpTable.AddCell(tmpCell);  
            tmpTableBlank.DefaultCell.BorderWidth = 0;
            tmpTableBlank.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
            tmpTableBlank.DefaultCell.HorizontalAlignment = Element.ALIGN_CENTER;
            //tmpTableBlank.AddCell(new Paragraph("test 2", calibri));
            tmpCellBlank.AddElement(tmpTableBlank);
            pdfCellBlank.Border = Rectangle.NO_BORDER;
            pdfTable.AddCell(pdfCellBlank);


            iTextSharp.text.pdf.Barcode128 bc = new Barcode128();
            bc.TextAlignment = Element.ALIGN_CENTER;
            bc.Code = data.numeroAutorizacion;
            bc.StartStopText = false;
            bc.CodeType = iTextSharp.text.pdf.Barcode128.CODE128;
            bc.Extended = true;
            //bc.Font = null;

            PdfContentByte cb = writer.DirectContent;

            iTextSharp.text.Image PatImage1 = bc.CreateImageWithBarcode(cb, Color.BLACK, Color.BLACK);
            PatImage1.ScaleToFit(250, 40);

            PdfPTable p_detail1 = new PdfPTable(1);
            p_detail1.WidthPercentage = 100;

            PdfPCell barcideimage = new PdfPCell(PatImage1);
            //barcideimage.Colspan = 2;
            barcideimage.HorizontalAlignment = 2;
            barcideimage.Border = 0;
            barcideimage.HorizontalAlignment = Element.ALIGN_CENTER;
            p_detail1.AddCell(barcideimage);


            RoundRectangle rr = new RoundRectangle();
            
            PdfPCell pdfCell2 = new PdfPCell();
            pdfCell2.CellEvent = rr;
            pdfCell2.Border = Rectangle.NO_BORDER;
            PdfPTable tmpTable2 = new PdfPTable(1);
            tmpTable2.WidthPercentage = 100;
            PdfPCell tmpCell2 = new PdfPCell();
            tmpCell2.FixedHeight = 60;
            tmpCell2.HorizontalAlignment = Element.ALIGN_CENTER;
            tmpCell2.VerticalAlignment = Element.ALIGN_MIDDLE;
            tmpCell2.BorderWidth = 1;
            //tmpTable.AddCell(tmpCell);  
            //tmpTable2.DefaultCell.CellEvent = new CellSpacingEvent(2);
            tmpTable2.DefaultCell.Padding = 4;
            tmpTable2.DefaultCell.BorderWidth = 0;
            tmpTable2.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
            tmpTable2.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;

            Chunk chunkAddress = new Chunk("RUC:  ", boldStyle);
            Chunk ChunkAddressDetails = new Chunk(data.infoTributaria.ruc);

            Phrase phrase = new Phrase();
            phrase.Add(chunkAddress);
            phrase.Add(ChunkAddressDetails);

            Paragraph paragraph = new Paragraph();
            paragraph.Add(phrase);

            //Paragraph p = new Paragraph("RUC: " , boldStyle);
            //p.Add(new Chunk(data.infoTributaria.ruc, calibri));

            //tmpTable2.AddCell(p);
            tmpTable2.AddCell(paragraph);
            tmpTable2.AddCell(new Paragraph("FACTURA", calibri));
            tmpTable2.AddCell(new Paragraph("No.: " + data.infoTributaria.estab + "-" + data.infoTributaria.ptoEmi + "-" + data.infoTributaria.secuencial, calibri));
            tmpTable2.AddCell(new Paragraph("NÚMERO DE AUTORIZACIÓN: " + data.numeroAutorizacion, calibri));
            tmpTable2.AddCell(new Paragraph("FECHA Y HORA DE AUTORIZACIÓN: " + data.fechaAutorizacion, calibri));
            tmpTable2.AddCell(new Paragraph("AMBIENTE: " + data.infoTributaria.ambiente, calibri));
            tmpTable2.AddCell(new Paragraph("CLAVE DE ACCESSO: ", calibri));
            tmpTable2.AddCell(barcideimage);
            pdfCell2.AddElement(tmpTable2);
            pdfTable.AddCell(pdfCell2);



            // }
           




            BaseFont bf = BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
            iTextSharp.text.Font fontInvoice = new iTextSharp.text.Font(bf, 20, iTextSharp.text.Font.NORMAL);
            //Paragraph paragraph = new Paragraph("Customers Detail", fontInvoice);
            //paragraph.Alignment = Element.ALIGN_CENTER;
            //doc.Add(paragraph);
            Paragraph p3 = new Paragraph();
            p3.SpacingAfter = 6;
            doc.Add(p3);
            doc.Add(pdfTable);
            //doc.Add(Add_Content_To_PDF(tableLayout));
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
            tableLayout.AddCell(new PdfPCell(new Phrase(cellText, new Font(Font.HELVETICA, 8, 1, Color.BLACK)))
            {
                HorizontalAlignment = Element.ALIGN_LEFT,
                Padding = 8,
                BackgroundColor = new iTextSharp.text.Color(255, 255, 255)
            });
        }
        private static void AddCellToBody(PdfPTable tableLayout, string cellText, int count)
        {
            if (count % 2 == 0)
            {
                tableLayout.AddCell(new PdfPCell(new Phrase(cellText, new Font(Font.HELVETICA, 8, 1, iTextSharp.text.Color.BLACK)))
                {
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    Padding = 8,
                    BackgroundColor = new iTextSharp.text.Color(255, 255, 255)
                });
            }
            else
            {
                tableLayout.AddCell(new PdfPCell(new Phrase(cellText, new Font(Font.HELVETICA, 8, 1, iTextSharp.text.Color.BLACK)))
                {
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    Padding = 8,
                    BackgroundColor = new iTextSharp.text.Color(211, 211, 211)
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
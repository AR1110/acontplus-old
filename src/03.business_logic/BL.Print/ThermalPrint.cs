using BL.Reports;
using Domain.Config.Dtos;
using System.Drawing;
using System.Drawing.Printing;

namespace BL.Print
{
    public class ThermalPrint
    {
        private PrintDocument _printDoc;
        private Graphics _graphics;
        private int initialHeight = 360;
        private ApiPrintRequestDto _data;
        public ThermalPrint()
        {
            _data = new ApiPrintRequestDto();
        }
        public bool Print(ApiPrintRequestDto data)
        {
            bool response = false;
            _data = data;
            _printDoc = new PrintDocument();

            List<PrinterDto> incomePrinters = _data.rdlcProps.Select(d => new PrinterDto
            {
                machine = d["computerName"],
                name = d["printerName"],
                isThermal = Convert.ToBoolean(d["isThermal"])
            }).ToList();

            if (incomePrinters.Any(p => p.machine == Environment.MachineName))
            {
                var foundedPrinters = new List<PrinterDto>();
                new Printer().Get(ref foundedPrinters);

                string machine = string.Empty, incomePrinter = string.Empty, printerToPrint = string.Empty;
                bool isThermal = false;

                machine = incomePrinters.Find(p => p.machine == Environment.MachineName).machine;

                if (foundedPrinters != null && foundedPrinters.Count > 0)
                {
                    incomePrinter = incomePrinters.Find(p => p.machine == machine).name;
                    printerToPrint = foundedPrinters.Find(p => p.machine == machine && p.name == incomePrinter).name;
                    isThermal = incomePrinters.Find(p => p.machine == machine && p.name == printerToPrint).isThermal;

                    if (!string.IsNullOrEmpty(printerToPrint) && isThermal)
                    {
                        _printDoc.PrinterSettings.PrinterName = printerToPrint;
                        _printDoc.PrintPage += new PrintPageEventHandler(FormatPage);
                        _printDoc.Print();
                        response = true;
                    }
                    //using report viewer
                    if (!string.IsNullOrEmpty(printerToPrint) && !isThermal)
                    {
                        response = Reports.Reports.DynamicPrint(_data, printerToPrint);
                    }
                }
                else
                {
                    incomePrinter = incomePrinters.Find(p => p.machine == machine).name;
                    isThermal = incomePrinters.Find(p => p.machine == machine && p.name == incomePrinter).isThermal;

                    if (!string.IsNullOrEmpty(printerToPrint) && isThermal)
                    {
                        _printDoc.PrinterSettings.PrinterName = printerToPrint;
                        _printDoc.PrintPage += new PrintPageEventHandler(FormatPage);
                        _printDoc.Print();
                        response = true;
                    }
                    //using report viewer
                    if (!string.IsNullOrEmpty(printerToPrint) && !isThermal)
                    {
                        response = Reports.Reports.DynamicPrint(_data, printerToPrint);
                    }
                }

            }
            return response;
        }

        void DrawTitle(string text, Font font, int offset, string label = null)
        {
            int startX = 10;
            int startY = 5;
            if (!string.IsNullOrEmpty(label))
            {
                int labelLength = 30 + label.Length;
                if (label.Length > 11)
                {
                    labelLength += 50;
                }
                _graphics.DrawString(label, new Font("Arial", 6, FontStyle.Bold), new SolidBrush(Color.Black), startX, startY + offset);
                _graphics.DrawString(string.Join("", text.Select((c, i) => i > 0 && i % 80 == 0 ? string.Format(Environment.NewLine + c) : c.ToString())), font, new SolidBrush(Color.Black), new Point(startX + labelLength, startY + offset));
            }
            else
            {
                _graphics.DrawString(string.Join("", text.Select((c, i) => i > 0 && i % 80 == 0 ? string.Format(Environment.NewLine + c) : c.ToString())), font, new SolidBrush(Color.Black), new Point(startX, startY + offset));
            }
        }

        void DrawTotals(string label, string value, int offset)
        {
            int startX = 10;
            int startY = 5;
            _graphics.DrawString(label, new Font("Arial", 5, FontStyle.Bold), new SolidBrush(Color.Black), startX + 150, startY + offset);
            _graphics.DrawString(value, new Font("Arial", 5), new SolidBrush(Color.Black), startX + 250, startY + offset);
        }

        void DrawLine(string text, int offset, int xoffset)
        {
            int startX = 10;
            int startY = 5;
            _graphics.DrawString(text, new Font("Arial", 10, FontStyle.Bold), new SolidBrush(Color.Black), startX + xoffset, startY + offset);
        }
        void InsertHeaderStyleItem(string description, string quatity, string valor, string total, int offset)
        {
            Font minifont = new Font("Arial", 5, FontStyle.Bold);
            int startX = 10;
            int startY = 7;

            _graphics.DrawString(description, minifont,
                         new SolidBrush(Color.Black), startX + 5, startY + offset);

            _graphics.DrawString(quatity, minifont,
                     new SolidBrush(Color.Black), startX + 150, startY + offset);

            _graphics.DrawString(valor, minifont,
                        new SolidBrush(Color.Black), startX + 200, startY + offset);

            _graphics.DrawString(total, minifont,
                     new SolidBrush(Color.Black), startX + 250, startY + offset);
        }
        public string GetPrintReadyString(string originalString)
        {
            string result = "";
            for (var i = 0; i < originalString.Length; i += 22)
                result += (originalString.Substring(i, Math.Min(22, originalString.Length - i)) + Environment.NewLine);
            return result;
        }
        void InsertItem(string description, string quatity, string valor, string total, int offset)
        {
            Font minifont = new Font("Arial", 5);
            int startX = 10;
            int startY = 7;
            //_graphics.DrawString(description, minifont,
            //             new SolidBrush(Color.Black), startX + 5, startY + offset);

            //StringFormat format1 = new StringFormat();
            //format1.Trimming = StringTrimming.EllipsisWord;
            //var txtLength = description.Trim().Length;
            //string s = string.Empty;
            //_graphics.TextRenderingHint = System.Drawing.Text.TextRenderingHint.AntiAliasGridFit;
            ////string LongText = "This is a really long text that should be automatically wrapped to a certain rectangle.";
            ////Rectangle DestinationRectangle = new Rectangle(10, 10, 100, 150);
            ////_graphics.DrawRectangle(Pens.Red, DestinationRectangle);
            //using (StringFormat sf = new StringFormat())
            //{
            //    _graphics.DrawString(description, minifont, Brushes.Black, new RectangleF(startX, startY + offset, 120F, 600), sf);
            //}
            ////_graphics.DrawString(s, minifont, Brushes.Black, new RectangleF(startX, startY + offset, 500F, 500F), format1);
            int textLength = description.Length;
            if (textLength > 60)
            {
                description = description.Substring(0, 60);
            }
            _graphics.DrawString(string.Join("", description.Select((c, i) => i > 0 && i % 32 == 0 ? string.Format(Environment.NewLine + c) : c.ToString())), minifont,
                         new SolidBrush(Color.Black), new Point(startX, startY + offset));

            //_graphics.DrawString(GetPrintReadyString(description), minifont,
            //       new SolidBrush(Color.Black), new Point(startX, startY + offset));

            _graphics.DrawString(quatity, minifont,
                     new SolidBrush(Color.Black), startX + 150, startY + offset);

            _graphics.DrawString(valor, minifont,
                        new SolidBrush(Color.Black), startX + 200, startY + offset);

            _graphics.DrawString(total, minifont,
                     new SolidBrush(Color.Black), startX + 250, startY + offset);
        }
        private void FormatPage(object sender, PrintPageEventArgs e)
        {
            _graphics = e.Graphics;
            Font minifont = new Font("Arial", 5);
            Font itemfont = new Font("Arial", 6);
            Font smallFont = new Font("Arial", 5);
            Font mediumFont = new Font("Arial", 6);
            Font largeFont = new Font("Arial", 7);
            Font drawFontBold = new Font("Arial", 6, FontStyle.Bold);


            int offsset = 10;
            int smallinc = 10, mediuminc = 12, largeinc = 15;

            //Image image = new Image();
            //e.Graphics.DrawImage(image, 50, 100, 30);

            offsset = offsset + largeinc + 10;

            string underLine = "-------------------------------------------------------------------------------";
            DrawLine(underLine, offsset, 0);
            offsset = offsset + mediuminc;

            var data = _data.dataSources.First(x => x.Key == "encabezadoDs").Value;

            DrawTitle(data[0]["razonSocial"], drawFontBold, offsset);
            offsset = offsset + mediuminc;

            string nombreComercial = "";
            data[0].TryGetValue("nombreComercial", out nombreComercial);
            if (!string.IsNullOrEmpty(nombreComercial))
            {
                DrawTitle(nombreComercial, drawFontBold, offsset);
                offsset = offsset + mediuminc;
            }

            DrawTitle(data[0]["ruc"], mediumFont, offsset, "RUC: ");
            offsset = offsset + mediuminc;

            string regimen = "";
            data[0].TryGetValue("regimen", out regimen);
            if (!string.IsNullOrEmpty(regimen))
            {
                DrawTitle(regimen, drawFontBold, offsset);
                offsset = offsset + mediuminc;
            }
            string telefono = string.Empty;
            data[0].TryGetValue("telefonoEntidad", out telefono);
            if (!string.IsNullOrEmpty(telefono))
            {
                DrawTitle(telefono, mediumFont, offsset, "Teléfono: ");
                offsset = offsset + mediuminc;
            }

            data[0].TryGetValue("telefono", out telefono);
            if (!string.IsNullOrEmpty(telefono))
            {
                DrawTitle(telefono, mediumFont, offsset, "Teléfono: ");
                offsset = offsset + mediuminc;
            }

            string dirMatriz = "";
            data[0].TryGetValue("dirMatriz", out dirMatriz);
            if (!string.IsNullOrEmpty(dirMatriz))
            {
                DrawTitle(dirMatriz, mediumFont, offsset, "Dirección: ");
                offsset += mediuminc;
            }

            if (string.IsNullOrEmpty(dirMatriz))
            {
                data[0].TryGetValue("direccion", out dirMatriz);
                if (!string.IsNullOrEmpty(dirMatriz))
                {
                    DrawTitle(dirMatriz, mediumFont, offsset, "Dirección: ");
                    offsset += mediuminc;
                }
            }

            string labelNroDoc = string.Empty;
            data[0].TryGetValue("labelNroDoc", out labelNroDoc);
 

            string nroFactura = "";
            data[0].TryGetValue("nroFactura", out nroFactura);
            if (!string.IsNullOrEmpty(nroFactura))
            {
                DrawTitle(nroFactura, mediumFont, offsset, labelNroDoc);
                offsset += mediuminc;
            }

            string nroDoc = "";
            data[0].TryGetValue("nroDoc", out nroDoc);
            if (!string.IsNullOrEmpty(nroDoc))
            {
                DrawTitle(nroDoc, mediumFont, offsset, labelNroDoc);
                offsset += mediuminc;
            }

            DrawLine(underLine, offsset, 0);
            offsset = offsset + largeinc;

            string cliente = string.Empty;
            data[0].TryGetValue("cliente", out cliente);
            if (!string.IsNullOrEmpty(cliente))
            {
                DrawTitle(cliente, mediumFont, offsset, "Cliente: ");
                offsset += mediuminc;
            }

            data[0].TryGetValue("razonSocialComprador", out cliente);
            if (!string.IsNullOrEmpty(cliente))
            {
                DrawTitle(cliente, mediumFont, offsset, "Cliente: ");
                offsset += mediuminc;
            }

            DrawTitle(data[0]["nroIdentificacion"], mediumFont, offsset, "RUC/CI: ");
            offsset += mediuminc;

            string direccionComprador = "";
            data[0].TryGetValue("direccionComprador", out direccionComprador);
            if (!string.IsNullOrEmpty(direccionComprador))
            {
                DrawTitle(direccionComprador, mediumFont, offsset, "Direcc: ");
                offsset += mediuminc;
            }

            data[0].TryGetValue("direccionCliente", out direccionComprador);
            if (!string.IsNullOrEmpty(direccionComprador))
            {
                DrawTitle(direccionComprador, mediumFont, offsset, "Direcc: ");
                offsset += mediuminc;
            }

            DrawTitle(data[0]["fechaEmision"], mediumFont, offsset, "Fecha: ");
            offsset = offsset + smallinc;

            DrawLine(underLine, offsset, 0);
            offsset = offsset + largeinc;

            InsertHeaderStyleItem("Descripción ", "Cantidad ", " P.U.", "Total", offsset);
            offsset = offsset + largeinc;

            var details = _data.dataSources.First(x => x.Key == "detalleDs").Value;

            foreach (var source in details)
            {
                InsertItem(source.FirstOrDefault(x => x.Key == "descripcion").Value,
                    source.FirstOrDefault(x => x.Key == "cantidad").Value,
                    source.FirstOrDefault(x => x.Key == "precioUnitario").Value,
                    source.FirstOrDefault(x => x.Key == "precioTotal").Value,
                    offsset);

                offsset = offsset + 30;
            }

            offsset = offsset + smallinc;
            string porcentajeIva = "", subtotalIva12 = "";
            data[0].TryGetValue("porcentajeIva", out porcentajeIva);
            data[0].TryGetValue("subTotalIva12", out subtotalIva12);
            DrawTotals(porcentajeIva, subtotalIva12, offsset);
            offsset = offsset + smallinc;

            string subtotalIva0 = "";
            data[0].TryGetValue("subTotalIva0", out subtotalIva0);
            if (!string.IsNullOrEmpty(subtotalIva0))
            {
                DrawTotals("Subtotal 0", subtotalIva0, offsset);
                offsset = offsset + smallinc;
            }

            string subtotalNoObjetoIva = "";
            data[0].TryGetValue("subTotalNoObjetoIva", out subtotalNoObjetoIva);
            if (!string.IsNullOrEmpty(subtotalNoObjetoIva))
            {
                DrawTotals("Subtotal No Obj. Iva", subtotalNoObjetoIva, offsset);
                offsset = offsset + smallinc;
            }

            string subtotalExcentoIva = "";
            data[0].TryGetValue("subtotalExcentoIva", out subtotalExcentoIva);
            if (!string.IsNullOrEmpty(subtotalExcentoIva))
            {
                DrawTotals("Subtotal Exc. Iva", subtotalExcentoIva, offsset);
                offsset = offsset + smallinc;
            }

            string subtotalSinImpuestos = "";
            data[0].TryGetValue("subTotalSinImpuestos", out subtotalSinImpuestos);
            if (!string.IsNullOrEmpty(subtotalSinImpuestos))
            {
                DrawTotals("Subtotal sin Imp.", subtotalSinImpuestos, offsset);
                offsset = offsset + smallinc;
            }

            string totalDescuentos = "";
            data[0].TryGetValue("totalDescuentos", out totalDescuentos);
            if (!string.IsNullOrEmpty(totalDescuentos))
            {
                DrawTotals("Descuento", totalDescuentos, offsset);
                offsset = offsset + smallinc;
            }

            string ice = "";
            data[0].TryGetValue("ice", out ice);
            if (!string.IsNullOrEmpty(ice))
            {
                DrawTotals("Ice", ice, offsset);
                offsset = offsset + smallinc;
            }

            string tipoIva = "", iva12 = "";
            data[0].TryGetValue("tipoIva", out tipoIva);
            data[0].TryGetValue("iva12", out iva12);
            DrawTotals(tipoIva, iva12, offsset);
            offsset = offsset + smallinc;

            string valorTotal = "";
            data[0].TryGetValue("valorTotal", out valorTotal);

            DrawTotals("TOTAL", valorTotal, offsset);

            offsset = offsset + smallinc;
            string formaPago = "", pago = "";
            data[0].TryGetValue("formaPago", out formaPago);
            data[0].TryGetValue("pago", out pago);
            if (!string.IsNullOrEmpty(formaPago))
            {
                DrawTotals(formaPago, pago, offsset);
                offsset = offsset + smallinc;
            }

            string cambio = "";
            data[0].TryGetValue("cambio", out cambio);
            if (!string.IsNullOrEmpty(cambio))
            {
                DrawTotals("Cambio", cambio, offsset);
                offsset = offsset + smallinc;
            }


            string claveAcceso = "";
            data[0].TryGetValue("codigoAutorizacion", out claveAcceso);

            if (!string.IsNullOrEmpty(claveAcceso))
            {
                DrawTitle("CLAVE ACCESO ", drawFontBold, offsset);
                offsset = offsset + smallinc;

                DrawTitle(claveAcceso, drawFontBold, offsset);
                offsset = offsset + smallinc;
            }

            string usuario = "";
            data[0].TryGetValue("usuario", out usuario);
            if (!string.IsNullOrEmpty(usuario))
            {
                DrawTitle("Usuario:     " + usuario, drawFontBold, offsset);
                offsset = offsset + smallinc;
            }

        }
    }
}

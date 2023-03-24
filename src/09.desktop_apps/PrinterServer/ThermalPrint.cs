using PrinterServer.Models;
using System;
using System.Drawing;
using System.Drawing.Printing;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Security;
using System.Text;

namespace PrinterServer
{
    public class ThermalPrint
    {
        private PrintDocument _printDoc;
        private Graphics _graphics;
        private int initialHeight = 360;
        private ApiPrintRequest _data;
        public ThermalPrint()
        {
            _data = new ApiPrintRequest();
        }
        public bool Print(ApiPrintRequest data)
        {
            _data = data;
            _printDoc = new PrintDocument();
            string printerName = _data.rdlcProps.FirstOrDefault(x => x.Key == "printerName").Value;
            //_printDoc.PrinterSettings.PrinterName = printerName;
            //_printDoc.PrinterSettings.PrinterName = "BSC10";
            _printDoc.PrinterSettings.PrinterName = "POS-80C";
            _printDoc.PrintPage += new PrintPageEventHandler(FormatPage);
            _printDoc.Print();
            return true;
        }

        void DrawTitle(string text, Font font, int offset)
        {
            int startX = 10;
            int startY = 5;
            _graphics.DrawString(string.Join("", text.Select((c, i) => i > 0 && i % 80 == 0 ? string.Format(Environment.NewLine + c) : c.ToString())), font, new SolidBrush(Color.Black), new Point(startX, startY + offset));
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

            DrawTitle("RUC: " + data[0]["ruc"], drawFontBold, offsset);
            offsset = offsset + mediuminc;

            string regimen = "";
            data[0].TryGetValue("regimen", out regimen);
            if (!string.IsNullOrEmpty(regimen))
            {
                DrawTitle(regimen, drawFontBold, offsset);
                offsset = offsset + mediuminc;
            }

            DrawTitle("Teléfono: " + data[0]["telefonoEntidad"], drawFontBold, offsset);
            offsset = offsset + mediuminc;

            string dirMatriz = "";
            data[0].TryGetValue("dirMatriz", out dirMatriz);
            if (!string.IsNullOrEmpty(dirMatriz))
            {
                DrawTitle("Dirección: " + dirMatriz, drawFontBold, offsset);
                offsset += mediuminc;
            }

            string nroFactura = "";
            data[0].TryGetValue("nroFactura", out nroFactura);
            if (!string.IsNullOrEmpty(nroFactura))
            {
                DrawTitle("FACTURA NRO: " + nroFactura, drawFontBold, offsset);
                offsset += mediuminc;
            }

            DrawTitle("RUC/CI: " + data[0]["nroIdentificacion"], drawFontBold, offsset);
            offsset += mediuminc;

            string direccionComprador = "";
            data[0].TryGetValue("direccionComprador", out direccionComprador);
            if (!string.IsNullOrEmpty(direccionComprador))
            {
                DrawTitle("Direcc: " + direccionComprador, drawFontBold, offsset);
                offsset += mediuminc;
            }

            DrawTitle("Fecha: " + data[0]["fechaEmision"], drawFontBold, offsset);
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

            string subtotalIva0 = "" ;
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
            
            DrawTitle("CLAVE ACCESO ", drawFontBold, offsset);
            offsset = offsset + smallinc;
            string claveAcceso = "";
            data[0].TryGetValue("codigoAutorizacion", out claveAcceso);
            DrawTitle(claveAcceso, drawFontBold, offsset);

            offsset = offsset + smallinc;
            string usuario = "";
            data[0].TryGetValue("usuario", out usuario);
            if (!string.IsNullOrEmpty(usuario))
            {
                DrawTitle("Usuario:     " + usuario, drawFontBold, offsset);
                offsset = offsset + smallinc;
            }

        }
        public static bool PrintNetwork(ApiPrintRequest data)
        {
            SocketPermission socketPermission1 = new SocketPermission(System.Security.Permissions.PermissionState.Unrestricted);
            SocketPermission socketPermission2 = new SocketPermission(System.Security.Permissions.PermissionState.None);
            SecurityElement securityElement1 = socketPermission2.ToXml();
            SecurityElement securityElement2 = new SecurityElement("ConnectAccess");
            SecurityElement securityElement4 = new SecurityElement("URI", "");

            securityElement2.AddChild(securityElement4);

            securityElement1.AddChild(securityElement2);

            socketPermission2.FromXml(securityElement1);

            socketPermission2.FromXml(securityElement2);

            Socket clientSock = new Socket(
                AddressFamily.InterNetwork,
                SocketType.Stream,
                ProtocolType.Tcp
                );

            IPAddress ip = IPAddress.Parse("");
            IPEndPoint remoteIP = new IPEndPoint(ip, 4730);

            clientSock.Connect(remoteIP);

            if (!clientSock.Connected)
            {
                return false;
            }

            Encoding encoding = Encoding.UTF8;

            string GS = Convert.ToString((char)29);
            string ESC = Convert.ToString((char)27);
            string COMMAND = "";
            COMMAND = ESC + "@";
            COMMAND += GS + "V" + (char)1;

            char[] bse = COMMAND.ToCharArray();
            byte[] paperCut = encoding.GetBytes(bse);

            byte[] bEsc = new byte[4];

            //SEND ESC/POS COMMAND TO PRINT TO CUT PAPER

            string t = ("          " + "THIS IS A TEST PRINT" + "\r\n");
            t = t + ("-----------------------------------\r\n");

            t = t + ("\r\n");
            t = t + ("\r\n");
            t = t + ("\r\n");
            t = t + ("\r\n");
            t = t + ("\r\n");
            t = t + ("\r\n");
            t = t + ("\r\n");

            char[] array = t.ToCharArray();
            byte[] byteData = encoding.GetBytes(array);

            clientSock.Send(byteData);
            clientSock.Send(paperCut);
            clientSock.Close();
            return true;
        }
    }
}

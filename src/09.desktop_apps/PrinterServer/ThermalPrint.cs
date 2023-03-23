using Microsoft.Reporting.Map.WebForms.BingMaps;
using Newtonsoft.Json.Linq;
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
            _printDoc.PrinterSettings.PrinterName = "POS-80C";
            _printDoc.PrintPage += new PrintPageEventHandler(FormatPage);
            _printDoc.Print();
            return true;
        }

        void DrawStart(string text, Font font, int offset)
        {
            int startX = 10;
            int startY = 5;
            //Font minifont = new Font("Arial", 5);

            _graphics.DrawString(text, font, new SolidBrush(Color.Black), startX + 5, startY + offset);
        }

        void DrawLine(string text, Font font, int offset, int xoffset)
        {
            int startX = 10;
            int startY = 5;
            _graphics.DrawString(text, font, new SolidBrush(Color.Black), startX + xoffset, startY + offset);
        }
        void InsertHeaderStyleItem(string description, string quatity, string valor, string total, int offset)
        {
            Font minifont = new Font("Arial", 5);
            int startX = 10;
            int startY = 7;

            _graphics.DrawString(description, minifont,
                         new SolidBrush(Color.Black), startX + 5, startY + offset);

            _graphics.DrawString(quatity, minifont,
                     new SolidBrush(Color.Black), startX + 130, startY + offset);

            _graphics.DrawString(valor, minifont,
                        new SolidBrush(Color.Black), startX + 165, startY + offset);

            _graphics.DrawString(total, minifont,
                     new SolidBrush(Color.Black), startX + 200, startY + offset);
        }
        void InsertItem(string description, string quatity, string valor, string total, int offset)
        {
            Font minifont = new Font("Arial", 5);
            int startX = 10;
            int startY = 5;

            _graphics.DrawString(description, minifont,
                         new SolidBrush(Color.Black), startX + 5, startY + offset);

            _graphics.DrawString(quatity, minifont,
                     new SolidBrush(Color.Black), startX + 130, startY + offset);

            _graphics.DrawString(valor, minifont,
                        new SolidBrush(Color.Black), startX + 165, startY + offset);

            _graphics.DrawString(total, minifont,
                     new SolidBrush(Color.Black), startX + 200, startY + offset);
        }
        private void FormatPage(object sender, PrintPageEventArgs e)
        {
            _graphics = e.Graphics;
            Font minifont = new Font("Arial", 5);
            Font itemfont = new Font("Arial", 6);
            Font smallFont = new Font("Arial", 5);
            Font mediumFont = new Font("Arial", 6);
            Font largeFont = new Font("Arial", 7);
            Font drawFontBold = new Font("Arial", 7, FontStyle.Bold);


            int offsset = 10;
            int smallinc = 10, mediuminc = 12, largeinc = 12;

            //Image image = new Image();
            //e.Graphics.DrawImage(image, 50, 100, 30);

            offsset = offsset + largeinc + 10;

            string underLine = "--------------------------------------------------";
            DrawLine(underLine, largeFont, offsset, 0);

            offsset = offsset + mediuminc;
            var data = _data.dataSources.First(x => x.Key == "encabezadoDs").Value;
            DrawStart(data[0]["razonSocial"], drawFontBold, offsset);

            offsset = offsset + mediuminc;
            DrawStart(data[0]["nombreComercial"], drawFontBold, offsset);

            offsset = offsset + mediuminc;
            DrawStart("RUC: " + data[0]["ruc"], drawFontBold, offsset);

            offsset = offsset + mediuminc;
            DrawStart(data[0]["regimen"], drawFontBold, offsset);

            offsset = offsset + mediuminc;
            DrawStart("Teléfono: " + data[0]["telefonoEntidad"], drawFontBold, offsset);

            offsset = offsset + mediuminc;
            DrawStart("Dirección: " + data[0]["dirMatriz"], drawFontBold, offsset);

            offsset += mediuminc;
            DrawStart("FACTURA NRO: " + data[0]["nroFactura"], drawFontBold, offsset);

            offsset += mediuminc;
            DrawStart("RUC/CI: " + data[0]["nroIdentificacion"], drawFontBold, offsset);

            offsset += mediuminc;
            DrawStart("Direcc: " + data[0]["direccionComprador"], drawFontBold, offsset);

            offsset += mediuminc;
            DrawStart("Fecha: " + data[0]["fechaEmision"], drawFontBold, offsset);

            offsset = offsset + smallinc;
            underLine = "--------------------------------------------------";
            DrawLine(underLine, largeFont, offsset, 0);

            offsset = offsset + largeinc;
            InsertHeaderStyleItem("Descripción ", "Cantidad ", " P.U.", "Total", offsset);


            offsset = offsset + largeinc;
            var details = _data.dataSources.First(x => x.Key == "detalleDs").Value;

            foreach (var source in details)
            {
                InsertItem(source.FirstOrDefault(x=> x.Key=="descripcion").Value,
                    source.FirstOrDefault(x => x.Key == "cantidad").Value,
                    source.FirstOrDefault(x => x.Key == "precioUnitario").Value,
                    source.FirstOrDefault(x => x.Key == "precioTotal").Value,
                    offsset);
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

using iTextSharp.text;
using iTextSharp.text.pdf;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.Reports
{
    public class RoundRectangle : IPdfPCellEvent
    {
        public void CellLayout(
          PdfPCell cell, Rectangle rect, PdfContentByte[] canvas
        )
        {
            PdfContentByte cb = canvas[PdfPTable.LINECANVAS];
            cb.RoundRectangle(
              rect.Left,
              rect.Bottom,
              rect.Width,
              rect.Height,
              4 // change to adjust how "round" corner is displayed
            );
            cb.SetLineWidth(1f);
            cb.SetCmykColorStrokeF(0f, 0f, 0f, 1f);
            cb.Stroke();
        }
    }
}

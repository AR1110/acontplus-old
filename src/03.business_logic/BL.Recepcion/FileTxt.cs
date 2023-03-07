using System.Data;
using System.Text;

namespace BL.Recepcion
{
    public class FileTxt
    {
        public bool GetDocs(byte[] fileTxt, ref DataTable dt)
        {
            dt.Columns.Add("id", typeof(int));
            dt.Columns.Add("uniqueId", typeof(string));
            dt.Columns.Add("comprobante", typeof(string));
            dt.Columns.Add("serieComprobante", typeof(string));
            dt.Columns.Add("rucEmisor", typeof(string));
            dt.Columns.Add("razonSocialEmisior", typeof(string));
            dt.Columns.Add("fechaEmision", typeof(string));
            dt.Columns.Add("fechaAutorizacion", typeof(string));
            dt.Columns.Add("tipoEmision", typeof(string));
            dt.Columns.Add("identificacionReceptor", typeof(string));
            dt.Columns.Add("claveAcceso", typeof(string));
            dt.Columns.Add("numeroAutorizacion", typeof(string));
            dt.Columns.Add("importeTotal", typeof(string));

            string line;

            StreamReader reader = new StreamReader(new MemoryStream(fileTxt), Encoding.GetEncoding("iso-8859-1"), true);
            DataRow row;
            int positionDr = 0;
            while ((line = reader.ReadLine()) != null)
            {
                string[] items = line.Split('\t');
                if (items.Length > 10)
                {
                    row = dt.NewRow();
                    row["id"] = positionDr;
                    row["uniqueId"] = Guid.NewGuid();
                    row["comprobante"] = items[0];
                    row["serieComprobante"] = items[1];
                    row["rucEmisor"] = items[2];
                    row["razonSocialEmisior"] = items[3];
                    row["fechaEmision"] = items[4];
                    row["fechaAutorizacion"] = items[5];
                    row["tipoEmision"] = items[6];
                    row["identificacionReceptor"] = items[8];
                    row["claveAcceso"] = items[9];
                    row["numeroAutorizacion"] = items[10];
                    dt.Rows.Add(row);
                    positionDr++;
                }
                if (items.Length == 1 && items[0] != "IMPORTE_TOTAL") //
                {
                    dt.Rows[positionDr - 1]["importeTotal"] = items[0];
                }
            }
            reader.Close();
            reader.Dispose();
            if (dt.Rows.Count > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}

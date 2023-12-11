using System.Data;
using System.Text;

namespace Compras.API.Services
{
    public sealed class FileTxt
    {
        public async Task<DataTable> GetDocs(byte[] fileTxt)
        {
            var dt = new DataTable();
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

            var reader = new StreamReader(new MemoryStream(fileTxt), Encoding.GetEncoding("iso-8859-1"), true);
            DataRow row;
            var positionDr = 0;
            var index = 0;
            while ((line = await reader.ReadLineAsync()) != null)
            {
                var items = line.Split('\t');
                if (index > 0 && items.Length > 1)
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
                if (items.Length == 12)
                {
                    if (dt.Rows.Count == 1)
                    {
                        dt.Rows[0]["importeTotal"] = items[11];
                    }
                    if (dt.Rows.Count > 1)
                    {
                        dt.Rows[positionDr - 1]["importeTotal"] = items[11];
                    }
                }
                else
                if (items.Length == 1 && items[0] != "IMPORTE_TOTAL") //
                {
                    dt.Rows[positionDr - 1]["importeTotal"] = items[0];
                }
                index++;
            }
            reader.Close();
            reader.Dispose();
            if (dt.Rows.Count > 0)
            {
                return dt;
            }
            else
            {
                return null;
            }
        }
    }
}

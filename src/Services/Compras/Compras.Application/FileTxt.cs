using DataAccess;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Text;

namespace Compras.Application
{
    public sealed class FileTxt
    {
        private readonly IConfiguration _configuration;
        public FileTxt(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<DataTable> GetDocs(byte[] fileTxt)
        {
            DataTable dt = new DataTable();
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
            int index = 0;
            while ((line = await reader.ReadLineAsync()) != null)
            {
                string[] items = line.Split('\t');
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
        public async Task<bool> exists(string claveAcceso)
        {
            DbAccess _db = new DbAccess(_configuration);
            int exists = 0;
            await _db.QueryExecute("SELECT COUNT(1) FROM Recepcion.DocumentoRecibido WITH (NOLOCK) WHERE claveAcceso = @claveAcceso");
            _db.AddDynamicParam("claveAcceso", claveAcceso);
            exists = (int)_db.ExecuteScalar();
            _db.Close();
            if (exists == 1)
            {
                return true;
            }
            return false;
        }
    }
}

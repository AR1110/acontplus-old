namespace Purchases.Application.Services;

public class FileTextService : IFileTextService
{
    public async Task<DataTable> GetDocsAsync(byte[] fileTxt)
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

        var reader = new StreamReader(new MemoryStream(fileTxt), Encoding.GetEncoding("iso-8859-1"), true);
        var positionDr = 0;
        var index = 0;
        while (await reader.ReadLineAsync() is { } line)
        {
            var items = line.Split('\t');
            if (index > 0 && items.Length > 1)
            {
                var row = dt.NewRow();
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

            switch (items.Length)
            {
                case 12:
                    {
                        switch (dt.Rows.Count)
                        {
                            case 1:
                                dt.Rows[0]["importeTotal"] = items[11];
                                break;
                            case > 1:
                                dt.Rows[positionDr - 1]["importeTotal"] = items[11];
                                break;
                        }

                        break;
                    }
                //
                case 1 when items[0] != "IMPORTE_TOTAL":
                    dt.Rows[positionDr - 1]["importeTotal"] = items[0];
                    break;
            }

            index++;
        }

        reader.Close();
        reader.Dispose();
        return dt.Rows.Count > 0 ? dt : null;
    }
}

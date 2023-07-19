using Newtonsoft.Json;
using System.Collections;
using System.Data;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Unicode;
using System.Xml;

namespace Helpers
{
    public static class DataHelper
    {
        public static object ToDBNullOrDefault(this object obj)
        {
            return obj ?? DBNull.Value;
        }
        public static string DataTableToJSON(DataTable table)
        {
            string JSONString = JsonConvert.SerializeObject(table);
            return JSONString;
        }
        public static bool DataTableIsNull(DataTable dt)
        {
            bool isNull = true;
            if (dt != null && dt.Rows.Count > 0)
            {
                isNull = false;
            }
            return isNull;
        }

        public static object DataSetToJSON(DataSet ds)
        {
            ArrayList root = new ArrayList();
            List<Dictionary<string, object>> table;
            Dictionary<string, object> data;

            foreach (DataTable dt in ds.Tables)
            {
                table = new List<Dictionary<string, object>>();
                foreach (DataRow dr in dt.Rows)
                {
                    data = new Dictionary<string, object>();
                    foreach (DataColumn col in dt.Columns)
                    {
                        data.Add(col.ColumnName, dr[col]);
                    }
                    table.Add(data);
                }
                root.Add(table);
            }

            return JsonConvert.SerializeObject(root);
        }
        //use Foo foo = BindData<Foo>(dt);
        public static T BindData<T>(DataTable dt)
        {
            DataRow dr = dt.Rows[0];

            // Get all columns' name
            List<string> columns = new List<string>();
            foreach (DataColumn dc in dt.Columns)
            {
                columns.Add(dc.ColumnName);
            }

            // Create object
            var ob = Activator.CreateInstance<T>();

            // Get all fields
            var fields = typeof(T).GetFields();
            foreach (var fieldInfo in fields)
            {
                if (columns.Contains(fieldInfo.Name))
                {
                    // Fill the data into the field
                    fieldInfo.SetValue(ob, dr[fieldInfo.Name]);
                }
            }

            // Get all properties
            var properties = typeof(T).GetProperties();
            foreach (var propertyInfo in properties)
            {
                if (columns.Contains(propertyInfo.Name))
                {
                    // Fill the data into the property
                    propertyInfo.SetValue(ob, dr[propertyInfo.Name]);
                }
            }

            return ob;
        }
        //use List<Foo> lst = BindDataList<Foo>(dt);
        public static List<T> BindDataList<T>(DataTable dt)
        {
            List<string> columns = new List<string>();
            foreach (DataColumn dc in dt.Columns)
            {
                columns.Add(dc.ColumnName);
            }

            var fields = typeof(T).GetFields();
            var properties = typeof(T).GetProperties();

            List<T> lst = new List<T>();

            foreach (DataRow dr in dt.Rows)
            {
                var ob = Activator.CreateInstance<T>();

                foreach (var fieldInfo in fields)
                {
                    if (columns.Contains(fieldInfo.Name))
                    {
                        fieldInfo.SetValue(ob, dr[fieldInfo.Name]);
                    }
                }

                foreach (var propertyInfo in properties)
                {
                    if (columns.Contains(propertyInfo.Name))
                    {
                        propertyInfo.SetValue(ob, dr[propertyInfo.Name]);
                    }
                }

                lst.Add(ob);
            }

            return lst;
        }

        public static string StoredProcedureDynamic(object cod)
        {
            string storedProcedure = "";
            switch (cod)
            {
                case "AR":
                    storedProcedure = "Importaciones.Articulo";
                    break;
                case "AF":
                    storedProcedure = "Importaciones.Fraccionado";
                    break;
                case "SF":
                    storedProcedure = "Importaciones.SubFamilia";
                    break;
                case "ME":
                    storedProcedure = "Importaciones.Medida";
                    break;
                case "MA":
                    storedProcedure = "Importaciones.Marca";
                    break;
                case "MO":
                    storedProcedure = "Importaciones.Modelo";
                    break;
                case "CL":
                    storedProcedure = "Importaciones.Cliente";
                    break;
                case "PR":
                    storedProcedure = "Importaciones.Proveedor";
                    break;
            }
            return storedProcedure;
        }
        public static DataTable JsonToDataTable(string json)
        {
            DataTable dt = (DataTable)JsonConvert.DeserializeObject(json, (typeof(DataTable)));
            return dt;
        }

        public static bool IsXml(string input)
        {
            try
            {
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(input);
                return true;
            }
            catch
            {
                return false;
            }
        }
        public static string SerializeDictionary(Dictionary<string, object> data)
        {
            
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.Create(UnicodeRanges.BasicLatin, UnicodeRanges.Cyrillic),
                WriteIndented = true // Optional: makes the output formatted for readability
            };
            var result = System.Text.Json.JsonSerializer.Serialize(data, options);
            return result;
        }
    }
}

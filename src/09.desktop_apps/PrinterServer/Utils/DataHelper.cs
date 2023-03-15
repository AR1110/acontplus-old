using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;

namespace PrinterServer
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
        public static DataTable JsonToDataTable(string json)
        {
            DataTable dt = (DataTable)JsonConvert.DeserializeObject(json, (typeof(DataTable)));
            return dt;
        }
    }
}

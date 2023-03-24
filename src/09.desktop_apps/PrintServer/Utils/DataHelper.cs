using Newtonsoft.Json;
using System.Data;

namespace PrintServer
{
    public static class DataHelper
    {
        public static DataTable JsonToDataTable(string json)
        {
            DataTable dt = (DataTable)JsonConvert.DeserializeObject(json, (typeof(DataTable)));
            return dt;
        }
    }
}

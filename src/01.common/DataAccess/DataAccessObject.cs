using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess
{
    public class DataAccessObject
    {
        private readonly IConfiguration _config;
        public DataAccessObject(IConfiguration config)
        {
            _config = config;
        }

        public async Task<DataTable> GetDataTableAsync(string spName, Dictionary<string, object> parameters = null)
        {
            DataTable dt = null;
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute(spName);
                if (parameters != null)
                {
                    foreach (var item in parameters)
                    {
                        db.AddDynamicParam(item.Key, item.Value);
                    }
                }
                dt = db.GetDataTable();
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
            return dt;
        }
    }
}

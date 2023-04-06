using Helpers;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DataAccess
{
    public class DAO
    {
        private readonly IConfiguration _config;
        public DAO(IConfiguration configuration) => (_config) = (configuration);
        public async Task<GenericResponse> Default(string spName, Dictionary<string, object> parameters = null)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess dbAccess = new DbAccess(_config);
            await dbAccess.SPExecute(spName);
            if (parameters != null)
            {
                foreach (var item in parameters)
                {
                    dbAccess.AddDynamicParam(item.Key, item.Value);
                }
            }
            DataTable dt = dbAccess.GetDataTable();

            if (dt.Columns.Contains("code") && dt.Rows[0]["code"].ToString() == "-1")
            {
                _response.Create(code: "0", message: dt.Rows[0]["message"].ToString(), payload: dt.Rows[0]["payload"].ToString());
            }
            else
            {
                _response = DataHelper.BindData<GenericResponse>(dt);
            }
            return _response;
        }
    }
}

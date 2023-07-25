using Config.Core.Interfaces;
using Config.Infrastructure.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace Config.Infrastructure.Repositories
{
    public class ADORepository : IADORepository
    {
        private readonly ConfigContext _context;
        public ADORepository(ConfigContext context)
        {
            _context = context;
        }
        public async Task<DataTable> GetDataTableAsync(string spName, Dictionary<string, object> parameters)
        {
            DataTable dt = null;
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = spName;
                if (parameters.Count > 0)
                {
                    foreach (var parameter in parameters)
                    {
                        //AddSqlParameter(parameter.Key, parameter.Value);
                        if (!string.IsNullOrEmpty(parameter.Key) && parameter.Value != null)
                        {
                            SqlParameter sqlParam = new SqlParameter();
                            sqlParam.ParameterName = parameter.Key;
                            sqlParam.SqlDbType = GetDbType(parameter.Value);
                            sqlParam.Value = parameter.Value ?? DBNull.Value;
                            command.Parameters.Add(sqlParam);
                        }
                    }
                }

                command.CommandType = CommandType.StoredProcedure;
                await _context.Database.OpenConnectionAsync();
                using (SqlDataAdapter adapter = new SqlDataAdapter())
                {
                    adapter.SelectCommand = (SqlCommand)command;
                    dt = new DataTable();
                    adapter.Fill(dt);
                }
            }
            return dt;
        }
        public async Task<DataSet> GetDataSetAsync(string spName, Dictionary<string, object> parameters)
        {
            DataSet ds = null;
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = spName;
                if (parameters.Count > 0)
                {
                    foreach (var parameter in parameters)
                    {
                        if (!string.IsNullOrEmpty(parameter.Key) && parameter.Value != null)
                        {
                            SqlParameter sqlParam = new SqlParameter();
                            sqlParam.ParameterName = parameter.Key;
                            sqlParam.SqlDbType = GetDbType(parameter.Value);
                            sqlParam.Value = parameter.Value ?? DBNull.Value;
                            command.Parameters.Add(sqlParam);
                        }
                    }
                }
                command.CommandType = CommandType.StoredProcedure;
                await _context.Database.OpenConnectionAsync();
                using (SqlDataAdapter adapter = new SqlDataAdapter())
                {
                    adapter.SelectCommand = (SqlCommand)command;
                    ds = new DataSet();
                    adapter.Fill(ds);
                }
            }
            return ds;
        }
        private List<SqlParameter> AddSqlParameter(string paramName, object paramValue)
        {
            List<SqlParameter> parameters = new List<SqlParameter>();
            if (!string.IsNullOrEmpty(paramName) && paramValue != null)
            {
                SqlParameter sqlParam = new SqlParameter();
                sqlParam.ParameterName = paramName;
                sqlParam.SqlDbType = GetDbType(paramValue);
                sqlParam.Direction = ParameterDirection.Output;
                parameters.Add(sqlParam);
            }
            return parameters;
        }
        //https://ajaxhispano.com/ask/alguien-tiene-una-funcion-c-que-mapee-el-tipo-de-datos-sql-de-una-columna-a-su-equivalente-clr-58667/
        public static SqlDbType GetDbType(object obj)
        {
            Type type = obj.GetType();
            switch (type.Name)
            {
                case "Int32":
                    return SqlDbType.Int;
                case "Int64":
                    return SqlDbType.BigInt;
                case "String":
                    return SqlDbType.VarChar;
                case "Boolean":
                    return SqlDbType.Bit;
                case "Decimal":
                    return SqlDbType.Decimal;
                case "Guid":
                    return SqlDbType.UniqueIdentifier;
                case "XmlDocument":
                    return SqlDbType.Xml;
                case "Byte[]":
                    return SqlDbType.VarBinary;
                default:
                    return SqlDbType.Variant;
            }
        }
    }
}

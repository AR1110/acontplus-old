using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data; 
using Vet.Core.Interfaces;
using Vet.Infrastructure.Data;

namespace Vet.Infrastructure.Repositories
{
    public class GenericRepository : IGenericRepository
    {
        private readonly VetContext _context;
        public GenericRepository(VetContext context)
        {
            _context = context;
        }
        public async Task<DataTable> GetDataTable(string spName, Dictionary<string, object> parameters)
        {
            DataTable dt = null;
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = spName;
                foreach (var parameter in parameters)
                {
                    //AddSqlParameter(parameter.Key, parameter.Value);
                    if (!string.IsNullOrEmpty(parameter.Key) && parameter.Value != null)
                    {
                        SqlParameter sqlParam = new SqlParameter();
                        sqlParam.ParameterName = parameter.Key;
                        sqlParam.SqlDbType = GetDbType(parameter.Value);
                        sqlParam.Value = parameter.Value ?? (object)DBNull.Value;
                        command.Parameters.Add(sqlParam);
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
        public async Task<DataSet> GetDataSet(string spName, Dictionary<string, object> parameters)
        {
            DataSet ds = null;
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = spName;
                foreach (var parameter in parameters)
                {
                    //AddSqlParameter((SqlCommand)command, parameter.Key, parameter.Value);
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

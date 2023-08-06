using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Restaurant.Core.Interfaces;
using Restaurant.Infrastructure.Data;
using System.Data;
using System.Data.Common;

namespace Restaurant.Infrastructure.Repositories
{
    public class ADORepository : IADORepository
    {
        private readonly RestaurantContext _context;
        public ADORepository(RestaurantContext context)
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
                            AddSqlParameter(command, parameter.Key, parameter.Value);
                        }
                    }
                }

                string outParam = "@tableNames";
                AddSqlParameterOut(command, outParam, SqlDbType.VarChar, 500);

                command.CommandType = CommandType.StoredProcedure;
                await _context.Database.OpenConnectionAsync();
                using (SqlDataAdapter adapter = new SqlDataAdapter())
                {
                    adapter.SelectCommand = (SqlCommand)command;
                    ds = new DataSet();
                    adapter.Fill(ds);
                }

                string[] tableNames = GetParameter(command, outParam).ToString().Split(',');

                for (int i = 0; i < tableNames.Length; i++)
                {
                    ds.Tables[i].TableName = tableNames[i];
                }
            }
            return ds;
        }

        public async Task<string> SPExecuteAsync(string spName, Dictionary<string, object> parameters)
        {
            string response = string.Empty;
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = spName;
                if (parameters.Count > 0)
                {
                    foreach (var parameter in parameters)
                    {
                        if (!string.IsNullOrEmpty(parameter.Key) && parameter.Value != null)
                        {
                            AddSqlParameter(command, parameter.Key, parameter.Value);
                        }
                    }
                }
                command.CommandType = CommandType.StoredProcedure;
                await _context.Database.OpenConnectionAsync();
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    response = reader.GetString(0);
                }
            }
            return response;
        }

        public static object GetParameter(DbCommand command, string parameterName)
        {
            return command.Parameters[parameterName].Value;
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

        private static void AddSqlParameter(DbCommand cmd, string name, object value)
        {
            SqlParameter sqlParam = new SqlParameter();
            sqlParam.ParameterName = name;
            sqlParam.SqlDbType = GetDbType(value);
            sqlParam.Value = value ?? DBNull.Value;
            cmd.Parameters.Add(sqlParam);
        }
        private static void AddSqlParameterOut(DbCommand cmd, string parameterName, SqlDbType sqlDbType, int size)
        {
            SqlParameter sqlParam = new SqlParameter();
            sqlParam.ParameterName = parameterName;
            sqlParam.SqlDbType = sqlDbType;
            sqlParam.Size = size;
            sqlParam.Direction = ParameterDirection.Output;
            cmd.Parameters.Add(sqlParam);
        }
    }
}

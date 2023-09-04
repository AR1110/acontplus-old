using System.Data.Common;
using System.Data;
using Microsoft.Data.SqlClient;
using Common.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Common.Infrastructure.Repository
{
    public class ADORepository : IADORepository
    {
        DbContextFactory _contexts;
        public ADORepository(DbContextFactory contexts)
        {
            _contexts = contexts;
        }

        public async Task<DataTable> GetDataTableAsync(string contextName, string spName, Dictionary<string, object> parameters)
        {
            DataTable dt = null;
            var _context = _contexts.GetContext(contextName);
            using (var cmd = _context.Database.GetDbConnection().CreateCommand())
            {
                bool wasOpen = cmd.Connection.State == ConnectionState.Open;
                try
                {
                    cmd.CommandText = spName;
                    if (parameters.Count > 0)
                    {
                        foreach (var parameter in parameters)
                        {
                            if (!string.IsNullOrEmpty(parameter.Key) && parameter.Value != null)
                            {
                                AddSqlParameter(cmd, parameter.Key, parameter.Value);
                            }
                        }
                    }

                    cmd.CommandType = CommandType.StoredProcedure;
                    if (!wasOpen) await _context.Database.OpenConnectionAsync();
                    using (SqlDataAdapter adapter = new SqlDataAdapter())
                    {
                        adapter.SelectCommand = (SqlCommand)cmd;
                        dt = new DataTable();
                        adapter.Fill(dt);
                    }
                }
                finally
                {
                    if (!wasOpen) cmd.Connection.Close();
                }

            }
            return dt;
        }

        public async Task<DataSet> GetDataSetAsync(string contextName, string spName, Dictionary<string, object> parameters)
        {
            DataSet ds = null;
            var _context = _contexts.GetContext(contextName);
            using (var cmd = _context.Database.GetDbConnection().CreateCommand())
            {
                bool wasOpen = cmd.Connection.State == ConnectionState.Open;
                try
                {
                    cmd.CommandText = spName;
                    if (parameters.Count > 0)
                    {
                        foreach (var parameter in parameters)
                        {
                            if (!string.IsNullOrEmpty(parameter.Key) && parameter.Value != null)
                            {
                                AddSqlParameter(cmd, parameter.Key, parameter.Value);
                            }
                        }
                    }

                    string outParam = "@tableNames";
                    AddSqlParameterOut(cmd, outParam, SqlDbType.VarChar, 500);

                    cmd.CommandType = CommandType.StoredProcedure;
                    if (!wasOpen) await _context.Database.OpenConnectionAsync();
                    using (SqlDataAdapter adapter = new SqlDataAdapter())
                    {
                        adapter.SelectCommand = (SqlCommand)cmd;
                        ds = new DataSet();
                        adapter.Fill(ds);
                    }

                    string[] tableNames = GetParameter(cmd, outParam).ToString().Split(',');

                    for (int i = 0; i < tableNames.Length; i++)
                    {
                        ds.Tables[i].TableName = tableNames[i];
                    }
                }
                finally
                {
                    if (!wasOpen) cmd.Connection.Close();
                }
            }
            return ds;
        }

        public async Task<string> SPExecuteAsync(string contextName, string spName, Dictionary<string, object> parameters)
        {
            string response = string.Empty;
            var _context = _contexts.GetContext(contextName);
            using (var cmd = _context.Database.GetDbConnection().CreateCommand())
            {
                bool wasOpen = cmd.Connection.State == ConnectionState.Open;
                try
                {
                    cmd.CommandText = spName;
                    if (parameters.Count > 0)
                    {
                        foreach (var parameter in parameters)
                        {
                            if (!string.IsNullOrEmpty(parameter.Key) && parameter.Value != null)
                            {
                                AddSqlParameter(cmd, parameter.Key, parameter.Value);
                            }
                        }
                    }
                    cmd.CommandType = CommandType.StoredProcedure;
                    if (!wasOpen) await _context.Database.OpenConnectionAsync();
                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        response = reader.GetString(0);
                    }
                }
                finally
                {
                    if (!wasOpen) cmd.Connection.Close();
                }
            }
            return response;
        }
        private static void AddSqlParameter(DbCommand cmd, string name, object value)
        {
            SqlParameter sqlParam = new SqlParameter();
            sqlParam.ParameterName = name;
            sqlParam.SqlDbType = SqlTypes.GetDbType(value);
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
        public static object GetParameter(DbCommand command, string parameterName)
        {
            return command.Parameters[parameterName].Value;
        }
    }
}

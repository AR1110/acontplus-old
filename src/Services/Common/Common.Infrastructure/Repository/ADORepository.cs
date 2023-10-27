using System.Data;
using System.Data.Common;
using Common.Core.Interfaces;
using Common.Infrastructure.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Common.Infrastructure.Repository
{
    public class ADORepository : IADORepository
    {
        DbContextFactory _contexts;
        private readonly IConfiguration _configuration;
        public ADORepository(DbContextFactory contexts, IConfiguration configuration)
        {
            _contexts = contexts;
            _configuration = configuration;
        }

        public async Task<DataTable> GetDataTableAsync(string spName, Dictionary<string, object> parameters)
        {
            DataTable dt = null;
            var _context = _contexts.GetContext(_configuration["ContextName"]);
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

        public async Task<DataSet> GetDataSetAsync(string spName, Dictionary<string, object> parameters, bool oldSp)
        {
            DataSet ds = null;
            var _context = _contexts.GetContext(_configuration["ContextName"]);
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
                    if (!oldSp)
                    {
                        AddSqlParameterOut(cmd, outParam, SqlDbType.VarChar, 500);
                    }

                    cmd.CommandType = CommandType.StoredProcedure;
                    if (!wasOpen) await _context.Database.OpenConnectionAsync();
                    using (SqlDataAdapter adapter = new SqlDataAdapter())
                    {
                        adapter.SelectCommand = (SqlCommand)cmd;
                        ds = new DataSet();
                        adapter.Fill(ds);
                    }

                    if (!oldSp)
                    {
                        string[] tableNames = GetParameter(cmd, outParam).ToString().Split(',');

                        for (int i = 0; i < tableNames.Length; i++)
                        {
                            ds.Tables[i].TableName = tableNames[i];
                        }
                    }
                }
                finally
                {
                    if (!wasOpen) cmd.Connection.Close();
                }
            }
            return ds;
        }

        public async Task<string> SPExecuteAsync(string spName, Dictionary<string, object> parameters)
        {
            string response = string.Empty;
            var _context = _contexts.GetContext(_configuration["ContextName"]);
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

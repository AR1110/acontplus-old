using System.Data;
using System.Data.Common;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Mechanical.Core.Interfaces;
using Mechanical.Infrastructure.Data;
using Lib.Common.DbUtils;

namespace Mechanical.Infrastructure.Repositories
{
    public class ADORepository : IADORepository
    {
        private readonly MechanicalContext _context;
        public ADORepository(MechanicalContext context)
        {
            _context = context;
        }

        public async Task<DataTable> GetDataTableAsync(string spName, Dictionary<string, object> parameters)
        {
            DataTable dt = null;
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                bool wasOpen = command.Connection.State == ConnectionState.Open;
                try
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
                                sqlParam.SqlDbType = SqlTypes.GetDbType(parameter.Value);
                                sqlParam.Value = parameter.Value ?? DBNull.Value;
                                command.Parameters.Add(sqlParam);
                            }
                        }
                    }

                    command.CommandType = CommandType.StoredProcedure;
                    if (!wasOpen) await _context.Database.OpenConnectionAsync();
                    using (SqlDataAdapter adapter = new SqlDataAdapter())
                    {
                        adapter.SelectCommand = (SqlCommand)command;
                        dt = new DataTable();
                        adapter.Fill(dt);
                    }
                }
                finally
                {
                    if (!wasOpen) command.Connection.Close();
                }
            }
            return dt;
        }

        public async Task<DataSet> GetDataSetAsync(string spName, Dictionary<string, object> parameters)
        {
            DataSet ds = null;
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                bool wasOpen = command.Connection.State == ConnectionState.Open;
                try
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
                    if (!wasOpen) await _context.Database.OpenConnectionAsync();
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
                finally
                {
                    if (!wasOpen) command.Connection.Close();
                }
            }
            return ds;
        }

        public async Task<string> SPExecuteAsync(string spName, Dictionary<string, object> parameters)
        {
            string response = string.Empty;
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                bool wasOpen = command.Connection.State == ConnectionState.Open;
                try
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
                    if (!wasOpen) await _context.Database.OpenConnectionAsync();
                    var reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        response = reader.GetString(0);
                    }
                }
                finally
                {
                    if (!wasOpen) command.Connection.Close();
                }
            }
            return response;
        }

        public static object GetParameter(DbCommand command, string parameterName)
        {
            return command.Parameters[parameterName].Value;
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
    }
}

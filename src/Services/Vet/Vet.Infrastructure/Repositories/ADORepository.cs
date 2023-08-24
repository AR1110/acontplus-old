using System.Data;
using System.Data.Common;
using Lib.Common.DbUtils;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Vet.Core.Interfaces;
using Vet.Infrastructure.Data;

namespace Vet.Infrastructure.Repositories
{
    public class ADORepository : IADORepository
    {
        private readonly VetContext _context;
        public ADORepository(VetContext context)
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
                            if (!string.IsNullOrEmpty(parameter.Key) && parameter.Value != null)
                            {
                                AddSqlParameter(command, parameter.Key, parameter.Value);
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
                    command.CommandType = CommandType.StoredProcedure;
                    if (!wasOpen) await _context.Database.OpenConnectionAsync();
                    using (SqlDataAdapter adapter = new SqlDataAdapter())
                    {
                        adapter.SelectCommand = (SqlCommand)command;
                        ds = new DataSet();
                        adapter.Fill(ds);
                    }
                }
                finally
                {
                    if (!wasOpen) command.Connection.Close();
                }
            }
            return ds;
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

using System.Data;
using Config.Core.Interfaces;
using Config.Infrastructure.Data;
using Lib.Common.DbUtils;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

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
    }
}

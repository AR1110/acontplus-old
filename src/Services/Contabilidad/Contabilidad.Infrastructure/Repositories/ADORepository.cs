using System.Data;
using Contabilidad.Core.Interfaces;
using Contabilidad.Infrastructure.Data;
using Lib.Common.DbUtils;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Contabilidad.Infrastructure.Repositories
{
    public class ADORepository : IADORepository
    {
        private readonly ContabilidadContext _context;
        public ADORepository(ContabilidadContext context)
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
        public async Task<int> ExecuteScalarAsync(string spName, Dictionary<string, object> parameters)
        {
            int id = 0;
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
                    id = (int)command.ExecuteScalar();
                }
                finally
                {
                    if (!wasOpen) command.Connection.Close();
                }
            }
            return id;
        }
    }
}

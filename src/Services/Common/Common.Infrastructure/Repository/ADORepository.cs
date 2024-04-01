using System.Data;
using System.Globalization;
using System.Text;
using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Infrastructure.Data;
using Common.Infrastructure.Utils;
using FastMember;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Common.Infrastructure.Repository
{
    public class ADORepository : IADORepository
    {
        private readonly DbContextFactory _contexts;
        private readonly IConfiguration _configuration;
        public ADORepository(DbContextFactory contexts, IConfiguration configuration)
        {
            _contexts = contexts;
            _configuration = configuration;
        }
        public async Task<List<T>> DynamicListAsync<T>(string spName, Dictionary<string, object> parameters)
        {
            List<T> response = new List<T>();
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
                                ParametersUtils.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                            }
                        }
                    }
                    cmd.CommandType = CommandType.StoredProcedure;
                    if (!wasOpen) await _context.Database.OpenConnectionAsync();
                    var reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        response = new DbDataReaderMapper().ToList<T>(reader);
                    }
                }
                finally
                {
                    if (!wasOpen) await cmd.Connection.CloseAsync();
                }
            }
            return response;
        }
        public async Task<T> DinamycObjectAsync<T>(string spName, Dictionary<string, object> parameters) where T : class, new()
        {
            var _context = _contexts.GetContext(_configuration["ContextName"]);
            var mappedObject = new T();
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
                                ParametersUtils.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                            }
                        }
                    }
                    cmd.CommandType = CommandType.StoredProcedure;
                    if (!wasOpen) await _context.Database.OpenConnectionAsync();
                    var rd = await cmd.ExecuteReaderAsync();
                    if (!rd.HasRows) return mappedObject;
                    var accessor = TypeAccessor.Create(typeof(T));
                    var members = accessor.GetMembers();
                    if (!await rd.ReadAsync()) return mappedObject;
                    for (var i = 0; i < rd.FieldCount; i++)
                    {
                        var columnNameFromDataTable = rd.GetName(i);
                        var columnValueFromDataTable = rd.GetValue(i);

                        var splits = columnNameFromDataTable.Split('_');
                        var columnName = new StringBuilder("");
                        foreach (var split in splits)
                        {
                            columnName.Append(CultureInfo.InvariantCulture.TextInfo.ToLower(split.ToLower())); //invariant should be to TitleCase
                        }

                        var mappedColumnName = members.FirstOrDefault(x =>
                            string.Equals(x.Name, columnName.ToString(), StringComparison.OrdinalIgnoreCase));

                        if (mappedColumnName == null) continue;
                        var columnType = mappedColumnName.Type;

                        if (columnValueFromDataTable != DBNull.Value)
                        {
                            accessor[mappedObject, columnName.ToString()] = Convert.ChangeType(columnValueFromDataTable, columnType);
                        }
                    }
                }
                catch (Exception)
                {
                    throw;
                }
                finally
                {
                    if (!wasOpen) await cmd.Connection.CloseAsync();
                }
                return mappedObject;
            }
        }
        public async Task<DataSet> GetDataSetAsync(string spName, Dictionary<string, object> parameters, bool oldSp)
        {
            DataSet ds = null;
            using (var _context = _contexts.GetContext(_configuration["ContextName"]))
            {
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
                                    ParametersUtils.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                                }
                            }
                        }

                        string outParam = "@tableNames";
                        if (!oldSp)
                        {
                            ParametersUtils.AddSqlParameterOut(cmd, outParam, SqlDbType.VarChar, 500);
                        }

                        cmd.CommandType = CommandType.StoredProcedure;
                        if (!wasOpen) await _context.Database.OpenConnectionAsync();
                        using (SqlDataAdapter adapter = new SqlDataAdapter())
                        {
                            adapter.SelectCommand = (SqlCommand)cmd;
                            ds = new DataSet();
                            await Task.Run(() => adapter.Fill(ds));
                        }

                        if (!oldSp)
                        {
                            string[] tableNames = ParametersUtils.GetParameter(cmd, outParam).ToString().Split(',');

                            //for (int i = 0; i < tableNames.Length; i++)
                            //{
                            //    if (!string.IsNullOrEmpty(tableNames[i]))
                            //    {
                            //        ds.Tables[i].TableName = tableNames[i];
                            //    }
                            //}
                            await Task.Run(() =>
                            {
                                Parallel.ForEach(tableNames, (tableName, state, index) =>
                                {
                                    if (!string.IsNullOrEmpty(tableName))
                                    {
                                        ds.Tables[(int)index].TableName = tableName;
                                    }
                                });
                            });

                        }
                    }
                    finally
                    {
                        if (!wasOpen) await cmd.Connection.CloseAsync();
                    }
                }
            }

            return ds;
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
                                ParametersUtils.AddSqlParameter(cmd, parameter.Key, parameter.Value);
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
                    if (!wasOpen) await cmd.Connection.CloseAsync();
                }

            }
            return dt;
        }
        public async Task<int> OnlyExecute(string spName, Dictionary<string, object> parameters)
        {
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
                                ParametersUtils.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                            }
                        }
                    }
                    cmd.CommandType = CommandType.StoredProcedure;
                    if (!wasOpen) await _context.Database.OpenConnectionAsync();
                   return await cmd.ExecuteNonQueryAsync();
                }
                finally
                {
                    if (!wasOpen) await cmd.Connection.CloseAsync();
                }
            }
        }
        public async Task<string> SPExecuteDeprecatedAsync(string spName, Dictionary<string, object> parameters, bool timeout)
        {
            string response = string.Empty;
            using (var _context = _contexts.GetContext(_configuration["ContextName"]))
            {
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
                                    ParametersUtils.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                                }
                            }
                        }
                        cmd.CommandType = CommandType.StoredProcedure;
                        if (!timeout)
                        {
                            cmd.CommandTimeout = 0;
                        }
                        if (!wasOpen) await _context.Database.OpenConnectionAsync();
                        using var reader = await cmd.ExecuteReaderAsync();
                        if (await reader.ReadAsync())
                        {
                            response = reader.GetString(0);
                        }
                    }
                    finally
                    {
                        if (!wasOpen) await cmd.Connection.CloseAsync();
                    }
                }
            }
            return response;
        }
        public async Task<ApiResponse> SPExecuteAsync(string spName, Dictionary<string, object> parameters, bool timeout)
        {
            var response = new ApiResponse();
            using (var _context = _contexts.GetContext(_configuration["ContextName"]))
            {
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
                                    ParametersUtils.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                                }
                            }
                        }
                        cmd.CommandType = CommandType.StoredProcedure;
                        if (!timeout)
                        {
                            cmd.CommandTimeout = 0;
                        }
                        if (!wasOpen) await _context.Database.OpenConnectionAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                var schemaTable = reader.GetSchemaTable();
                                response.code = reader.IsDBNull(0) ? null : reader.GetString(0);
                                // Check if the schema table contains the "message" column
                                var columnExists = schemaTable != null && schemaTable.Rows.Cast<DataRow>().Any(row => row["ColumnName"].ToString().Equals("message", StringComparison.OrdinalIgnoreCase));
                                if (columnExists)
                                {
                                    var indexMessage = reader.GetOrdinal("message");
                                    if (indexMessage != -1 && !reader.IsDBNull(indexMessage))
                                    {
                                        response.message = reader.GetString(indexMessage);
                                    }
                                }

                                var payloadExists = schemaTable != null && schemaTable.Rows.Cast<DataRow>().Any(row => row["ColumnName"].ToString().Equals("payload", StringComparison.OrdinalIgnoreCase));
                                if (payloadExists)
                                {
                                    var indexPayload = reader.GetOrdinal("payload");
                                    if (indexPayload != -1 && !reader.IsDBNull(indexPayload))
                                    {
                                        response.payload = reader.GetString(indexPayload);
                                    }
                                }
                            }
                        }
                    }
                    finally
                    {
                        if (!wasOpen) await cmd.Connection.CloseAsync();
                    }
                }
            }
            return response;
        }
    }
}

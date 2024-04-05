using System.Data;
using System.Globalization;
using System.Text;
using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Infrastructure.Utils;
using FastMember;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Common.Infrastructure.Repository
{
    public class ADOSqlServer : IADOSqlServer
    {
        private readonly IConfiguration _configuration;
        public ADOSqlServer(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<List<T>> DynamicListAsync<T>(string spname, Dictionary<string, object> parameters)
        {
            List<T> response = new List<T>();
            var _conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            using (var cmd = new SqlCommand(spname, _conn))
            {
                bool wasOpen = cmd.Connection.State == ConnectionState.Open;
                try
                {

                    if (parameters.Count > 0)
                    {
                        foreach (var parameter in parameters)
                        {
                            if (!string.IsNullOrEmpty(parameter.Key) && parameter.Value != null)
                            {
                                ParametersUtilsSqlServer.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                            }
                        }
                    }
                    cmd.CommandType = CommandType.StoredProcedure;
                    if (!wasOpen) await _conn.OpenAsync();
                    var reader = cmd.ExecuteReader();
                    while (reader.Read())
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
        public async Task<T> DinamycObjectAsync<T>(string spname, Dictionary<string, object> parameters) where T : class, new()
        {
            var _conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            var mappedObject = new T();
            using (var cmd = new SqlCommand(spname, _conn))
            {
                bool wasOpen = cmd.Connection.State == ConnectionState.Open;
                try
                {

                    if (parameters.Count > 0)
                    {
                        foreach (var parameter in parameters)
                        {
                            if (!string.IsNullOrEmpty(parameter.Key) && parameter.Value != null)
                            {
                                ParametersUtilsSqlServer.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                            }
                        }
                    }
                    cmd.CommandType = CommandType.StoredProcedure;
                    if (!wasOpen) await _conn.OpenAsync();
                    var rd = cmd.ExecuteReader();
                    if (!rd.HasRows) return mappedObject;
                    var accessor = TypeAccessor.Create(typeof(T));
                    var members = accessor.GetMembers();
                    if (!rd.Read()) return mappedObject;
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
        public async Task<DataSet> GetDataSetAsync(string spname, Dictionary<string, object> parameters, bool oldSp)
        {
            DataSet ds = null;
            using (var _conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                using (var cmd = new SqlCommand(spname, _conn))
                {
                    bool wasOpen = cmd.Connection.State == ConnectionState.Open;
                    try
                    {

                        if (parameters.Count > 0)
                        {
                            foreach (var parameter in parameters)
                            {
                                if (!string.IsNullOrEmpty(parameter.Key) && parameter.Value != null)
                                {
                                    ParametersUtilsSqlServer.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                                }
                            }
                        }

                        string outParam = "@tableNames";
                        if (!oldSp)
                        {
                            ParametersUtilsSqlServer.AddSqlParameterOut(cmd, outParam, SqlDbType.VarChar, 500);
                        }

                        cmd.CommandType = CommandType.StoredProcedure;
                        if (!wasOpen) await _conn.OpenAsync();
                        using (SqlDataAdapter adapter = new SqlDataAdapter())
                        {
                            adapter.SelectCommand = (SqlCommand)cmd;
                            ds = new DataSet();
                            await Task.Run(() => adapter.Fill(ds));
                        }

                        if (!oldSp)
                        {
                            string[] tableNames = ParametersUtilsSqlServer.GetParameter(cmd, outParam).ToString().Split(',');
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
        public async Task<DataTable> GetDataTableAsync(string spname, Dictionary<string, object> parameters)
        {
            DataTable dt = null;
            var _conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            using (var cmd = new SqlCommand(spname, _conn))
            {
                bool wasOpen = cmd.Connection.State == ConnectionState.Open;
                try
                {

                    if (parameters.Count > 0)
                    {
                        foreach (var parameter in parameters)
                        {
                            if (!string.IsNullOrEmpty(parameter.Key) && parameter.Value != null)
                            {
                                ParametersUtilsSqlServer.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                            }
                        }
                    }

                    cmd.CommandType = CommandType.StoredProcedure;
                    if (!wasOpen) await _conn.OpenAsync();
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
        public async Task<int> OnlyExecuteAsync(string query, Dictionary<string, object> parameters, bool useStoredProcedure)
        {
            var _conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            using (var cmd = new SqlCommand(query, _conn))
            {
                bool wasOpen = cmd.Connection.State == ConnectionState.Open;
                try
                {
                    if (parameters.Count > 0)
                    {
                        foreach (var parameter in parameters)
                        {
                            if (!string.IsNullOrEmpty(parameter.Key) && parameter.Value != null)
                            {
                                ParametersUtilsSqlServer.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                            }
                        }
                    }
                    if (useStoredProcedure)
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                    }
                    else
                    {
                        cmd.CommandType = CommandType.Text;
                    }
                    if (!wasOpen) await _conn.OpenAsync();
                    return await cmd.ExecuteNonQueryAsync();
                }
                finally
                {
                    if (!wasOpen) await cmd.Connection.CloseAsync();
                }
            }
        }
        public async Task<ApiResponse> SPExecuteAsync(string spname, Dictionary<string, object> parameters)
        {
            var response = new ApiResponse();
            var _conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            using (var cmd = new SqlCommand(spname, _conn))
            {
                bool wasOpen = cmd.Connection.State == ConnectionState.Open;
                try
                {

                    if (parameters.Count > 0)
                    {
                        foreach (var parameter in parameters)
                        {
                            if (!string.IsNullOrEmpty(parameter.Key) && parameter.Value != null)
                            {
                                ParametersUtilsSqlServer.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                            }
                        }
                    }
                    cmd.CommandType = CommandType.StoredProcedure;
                    if (!wasOpen) await _conn.OpenAsync();
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
            return response;
        }
    }

}

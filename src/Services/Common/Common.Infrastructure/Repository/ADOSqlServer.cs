using System.Data;
using System.Globalization;
using System.Text;
using Common.Core.Interfaces;
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
        public async Task<List<T>> DynamicListAsync<T>(string spName, Dictionary<string, object> parameters)
        {
            List<T> response = new List<T>();
            var _conn =new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            using (var cmd = new SqlCommand(spName, _conn))
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
                    if (!wasOpen) cmd.Connection.Close();
                }
            }
            return response;
        }
        public async Task<T> DinamycObjectAsync<T>(string spName, Dictionary<string, object> parameters) where T : class, new()
        {
            var _conn =new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            var mappedObject = new T();
            using (var cmd = new SqlCommand(spName, _conn))
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
                    if (!wasOpen) cmd.Connection.Close();
                }
                return mappedObject;
            }
        }
        public async Task<DataSet> GetDataSetAsync(string spName, Dictionary<string, object> parameters, bool oldSp)
        {
            DataSet ds = null;
            using (var _conn =new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                using (var cmd = new SqlCommand(spName, _conn))
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
                        if (!wasOpen) cmd.Connection.Close();
                    }
                }
            }

            return ds;
        }
        public async Task<DataTable> GetDataTableAsync(string spName, Dictionary<string, object> parameters)
        {
            DataTable dt = null;
            var _conn =new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            using (var cmd = new SqlCommand(spName, _conn))
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
                    if (!wasOpen) cmd.Connection.Close();
                }

            }
            return dt;
        }
        public async Task OnlyExecute(string spName, Dictionary<string, object> parameters)
        {
            var _conn =new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            using (var cmd = new SqlCommand(spName, _conn))
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
                                ParametersUtilsSqlServer.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                            }
                        }
                    }
                    cmd.CommandType = CommandType.StoredProcedure;
                    if (!wasOpen) await _conn.OpenAsync();
                    cmd.ExecuteNonQuery();
                }
                finally
                {
                    if (!wasOpen) cmd.Connection.Close();
                }
            }
        }
        public async Task<string> SPExecuteAsync(string spName, Dictionary<string, object> parameters)
        {
            string response = string.Empty;
            var _conn =new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            using (var cmd = new SqlCommand(spName, _conn))
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
                                ParametersUtilsSqlServer.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                            }
                        }
                    }
                    cmd.CommandType = CommandType.StoredProcedure;
                    if (!wasOpen) await _conn.OpenAsync();
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
    }

}

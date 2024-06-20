namespace Common.Infrastructure.Repository;

public class AdoSqlServer(IConfiguration configuration) : IAdoSqlServer
{
    public async Task<List<T>> DynamicListAsync<T>(string spname, Dictionary<string, object> parameters)
    {
        var response = new List<T>();
        var conn = new SqlConnection(configuration.GetConnectionString("DefaultConnection"));
        await using var cmd = new SqlCommand(spname, conn);
        var wasOpen = cmd.Connection.State == ConnectionState.Open;
        try
        {
            if (parameters.Count > 0)
            {
                foreach (var parameter in parameters.Where(parameter =>
                             !string.IsNullOrEmpty(parameter.Key) && parameter.Value != null))
                {
                    ParametersUtilsSqlServer.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                }
            }

            cmd.CommandType = CommandType.StoredProcedure;
            if (!wasOpen)
            {
                await conn.OpenAsync();
            }

            var reader = await cmd.ExecuteReaderAsync();
            while (reader.Read())
            {
                response = DbDataReaderMapper.ToList<T>(reader);
            }
        }
        finally
        {
            if (!wasOpen)
            {
                await cmd.Connection.CloseAsync();
            }
        }

        return response;
    }

    public async Task<T> DinamycObjectAsync<T>(string spname, Dictionary<string, object> parameters)
        where T : class, new()
    {
        var conn = new SqlConnection(configuration.GetConnectionString("DefaultConnection"));
        var mappedObject = new T();
        await using var cmd = new SqlCommand(spname, conn);
        var wasOpen = cmd.Connection.State == ConnectionState.Open;
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
            if (!wasOpen)
            {
                await conn.OpenAsync();
            }

            var rd = await cmd.ExecuteReaderAsync();
            if (!rd.HasRows)
            {
                return mappedObject;
            }

            var accessor = TypeAccessor.Create(typeof(T));
            var members = accessor.GetMembers();
            if (!rd.Read())
            {
                return mappedObject;
            }

            for (var i = 0; i < rd.FieldCount; i++)
            {
                var columnNameFromDataTable = rd.GetName(i);
                var columnValueFromDataTable = rd.GetValue(i);

                var splits = columnNameFromDataTable.Split('_');
                var columnName = new StringBuilder("");
                foreach (var split in splits)
                {
                    columnName.Append(
                        CultureInfo.InvariantCulture.TextInfo
                            .ToLower(split.ToLower())); //invariant should be to TitleCase
                }

                var mappedColumnName = members.FirstOrDefault(x =>
                    string.Equals(x.Name, columnName.ToString(), StringComparison.OrdinalIgnoreCase));

                if (mappedColumnName == null)
                {
                    continue;
                }

                var columnType = mappedColumnName.Type;

                if (columnValueFromDataTable != DBNull.Value)
                {
                    accessor[mappedObject, columnName.ToString()] =
                        Convert.ChangeType(columnValueFromDataTable, columnType);
                }
            }
        }
        finally
        {
            if (!wasOpen)
            {
                await cmd.Connection.CloseAsync();
            }
        }

        return mappedObject;
    }

    public async Task<DataSet> GetDataSetAsync(string spname, Dictionary<string, object> parameters, bool oldSp,
        bool timeout)
    {
        DataSet ds = null;
        await using var conn = new SqlConnection(configuration.GetConnectionString("DefaultConnection"));
        await using var cmd = new SqlCommand(spname, conn);
        var wasOpen = cmd.Connection.State == ConnectionState.Open;
        try
        {
            if (parameters.Count > 0)
            {
                foreach (var parameter in parameters.Where(parameter =>
                             !string.IsNullOrEmpty(parameter.Key) && parameter.Value != null))
                {
                    ParametersUtilsSqlServer.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                }
            }

            const string outParam = "@tableNames";
            if (!oldSp)
            {
                ParametersUtilsSqlServer.AddSqlParameterOut(cmd, outParam, SqlDbType.VarChar, 500);
            }

            if (!timeout)
            {
                cmd.CommandTimeout = 0;
            }

            cmd.CommandType = CommandType.StoredProcedure;
            if (!wasOpen)
            {
                await conn.OpenAsync();
            }

            using (var adapter = new SqlDataAdapter())
            {
                adapter.SelectCommand = cmd;
                ds = new DataSet();
                await Task.Run(() => adapter.Fill(ds));
            }

            if (!oldSp)
            {
                var tableNames = ParametersUtilsSqlServer.GetParameter(cmd, outParam).ToString()?.Split(',');
                await Task.Run(() =>
                {
                    if (tableNames != null)
                    {
                        Parallel.ForEach(tableNames, (tableName, state, index) =>
                        {
                            if (!string.IsNullOrEmpty(tableName))
                            {
                                ds.Tables[(int)index].TableName = tableName;
                            }
                        });
                    }
                });
            }
        }
        finally
        {
            if (!wasOpen)
            {
                await cmd.Connection.CloseAsync();
            }
        }

        return ds;
    }

    public async Task<DataTable> GetDataTableAsync(string spname, Dictionary<string, object> parameters)
    {
        DataTable dt = null;
        var conn = new SqlConnection(configuration.GetConnectionString("DefaultConnection"));
        await using var cmd = new SqlCommand(spname, conn);
        var wasOpen = cmd.Connection.State == ConnectionState.Open;
        try
        {
            if (parameters.Count > 0)
            {
                foreach (var parameter in parameters.Where(parameter =>
                             !string.IsNullOrEmpty(parameter.Key) && parameter.Value != null))
                {
                    ParametersUtilsSqlServer.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                }
            }

            cmd.CommandType = CommandType.StoredProcedure;
            if (!wasOpen)
            {
                await conn.OpenAsync();
            }

            using var adapter = new SqlDataAdapter();
            adapter.SelectCommand = cmd;
            dt = new DataTable();
            adapter.Fill(dt);
        }
        finally
        {
            if (!wasOpen)
            {
                await cmd.Connection.CloseAsync();
            }
        }

        return dt;
    }

    public async Task<int> OnlyExecuteAsync(string query, Dictionary<string, object> parameters,
        bool useStoredProcedure, bool timeout)
    {
        var conn = new SqlConnection(configuration.GetConnectionString("DefaultConnection"));
        await using var cmd = new SqlCommand(query, conn);
        var wasOpen = cmd.Connection.State == ConnectionState.Open;
        try
        {
            if (parameters.Count > 0)
            {
                foreach (var parameter in parameters.Where(parameter =>
                             !string.IsNullOrEmpty(parameter.Key) && parameter.Value != null))
                {
                    ParametersUtilsSqlServer.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                }
            }
            if (!timeout)
            {
                cmd.CommandTimeout = 0;
            }
            cmd.CommandType = useStoredProcedure ? CommandType.StoredProcedure : CommandType.Text;
            if (!wasOpen)
            {
                await conn.OpenAsync();
            }

            return await cmd.ExecuteNonQueryAsync();
        }
        finally
        {
            if (!wasOpen)
            {
                await cmd.Connection.CloseAsync();
            }
        }
    }

    public async Task<T> SpExecuteAsync<T>(string spname, Dictionary<string, object> parameters, bool timeout) where T : class, new()
    {
        var response = new T();
        var conn = new SqlConnection(configuration.GetConnectionString("DefaultConnection"));
        await using var cmd = new SqlCommand(spname, conn);
        var wasOpen = cmd.Connection.State == ConnectionState.Open;
        try
        {
            if (parameters.Count > 0)
            {
                foreach (var parameter in parameters.Where(parameter =>
                             !string.IsNullOrEmpty(parameter.Key) && parameter.Value != null))
                {
                    ParametersUtilsSqlServer.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                }
            }
            if (!timeout)
            {
                cmd.CommandTimeout = 0;
            }
            cmd.CommandType = CommandType.StoredProcedure;
            if (!wasOpen)
            {
                await conn.OpenAsync();
            }

            await using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                // Reflection to access properties dynamically
                var properties = typeof(T).GetProperties();
                foreach (var property in properties)
                {
                    // Check if property name matches a column name (case-insensitive)
                    var columnName = reader.GetSchemaTable().Rows.Cast<DataRow>()
                                          .Where(row => row["ColumnName"].ToString().Equals(property.Name, StringComparison.OrdinalIgnoreCase))
                                          .Select(row => row["ColumnName"].ToString())
                                          .FirstOrDefault();

                    if (columnName != null)
                    {
                        var index = reader.GetOrdinal(columnName);
                        if (index != -1 && !reader.IsDBNull(index))
                        {
                            // Set property value based on data type
                            property.SetValue(response, reader.GetValue(index));
                        }
                    }
                }
                //var schemaTable = reader.GetSchemaTable();
                //response.Code = reader.IsDBNull(0) ? null : reader.GetString(0);
                //// Check if the schema table contains the "message" column
                //var columnExists = schemaTable != null && schemaTable.Rows.Cast<DataRow>().Any(row =>
                //    row["ColumnName"].ToString().Equals("message", StringComparison.OrdinalIgnoreCase));
                //if (columnExists)
                //{
                //    var indexMessage = reader.GetOrdinal("message");
                //    if (indexMessage != -1 && !reader.IsDBNull(indexMessage))
                //    {
                //        response.Message = reader.GetString(indexMessage);
                //    }
                //}

                //var payloadExists = schemaTable != null && schemaTable.Rows.Cast<DataRow>().Any(row =>
                //    row["ColumnName"].ToString().Equals("payload", StringComparison.OrdinalIgnoreCase));
                //if (payloadExists)
                //{
                //    var indexPayload = reader.GetOrdinal("payload");
                //    if (indexPayload != -1 && !reader.IsDBNull(indexPayload))
                //    {
                //        response.Payload = reader.GetString(indexPayload);
                //    }
                //}
            }
        }
        finally
        {
            if (!wasOpen)
            {
                await cmd.Connection.CloseAsync();
            }
        }

        return response;
    }
}

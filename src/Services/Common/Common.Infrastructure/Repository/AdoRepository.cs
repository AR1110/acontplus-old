namespace Common.Infrastructure.Repository;

public class AdoRepository(DbContextFactory contexts, IConfiguration configuration) : IAdoRepository
{
    public async Task<List<T>> DynamicListAsync<T>(string spName, Dictionary<string, object> parameters)
    {
        var response = new List<T>();
        var context = contexts.GetContext(configuration["ContextName"]);
        await using var cmd = context.Database.GetDbConnection().CreateCommand();
        var wasOpen = cmd.Connection is { State: ConnectionState.Open };
        try
        {
            cmd.CommandText = spName;
            if (parameters.Count > 0)
            {
                foreach (var parameter in parameters.Where(parameter =>
                             !string.IsNullOrEmpty(parameter.Key) && parameter.Value != null))
                {
                    ParametersUtils.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                }
            }

            cmd.CommandType = CommandType.StoredProcedure;
            if (!wasOpen)
            {
                await context.Database.OpenConnectionAsync();
            }

            var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                response = DbDataReaderMapper.ToList<T>(reader);
            }
        }
        finally
        {
            if (!wasOpen)
            {
                if (cmd.Connection != null)
                {
                    await cmd.Connection.CloseAsync();
                }
            }
        }

        return response;
    }

    public async Task<T> DinamycObjectAsync<T>(string spName, Dictionary<string, object> parameters)
        where T : class, new()
    {
        var context = contexts.GetContext(configuration["ContextName"]);
        var mappedObject = new T();
        await using var cmd = context.Database.GetDbConnection().CreateCommand();
        var wasOpen = cmd.Connection is { State: ConnectionState.Open };
        try
        {
            cmd.CommandText = spName;
            if (parameters.Count > 0)
            {
                foreach (var parameter in parameters.Where(parameter =>
                             !string.IsNullOrEmpty(parameter.Key) && parameter.Value != null))
                {
                    ParametersUtils.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                }
            }

            cmd.CommandType = CommandType.StoredProcedure;
            if (!wasOpen)
            {
                await context.Database.OpenConnectionAsync();
            }

            var rd = await cmd.ExecuteReaderAsync();
            if (!rd.HasRows)
            {
                return mappedObject;
            }

            var accessor = TypeAccessor.Create(typeof(T));
            var members = accessor.GetMembers();
            if (!await rd.ReadAsync())
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
                if (cmd.Connection != null)
                {
                    await cmd.Connection.CloseAsync();
                }
            }
        }

        return mappedObject;
    }

    public async Task<DataSet> GetDataSetAsync(string spName, Dictionary<string, object> parameters, bool oldSp)
    {
        DataSet ds = null;
        await using var context = contexts.GetContext(configuration["ContextName"]);
        await using var cmd = context.Database.GetDbConnection().CreateCommand();
        var wasOpen = cmd.Connection is { State: ConnectionState.Open };
        try
        {
            cmd.CommandText = spName;
            if (parameters.Count > 0)
            {
                foreach (var parameter in parameters.Where(parameter =>
                             !string.IsNullOrEmpty(parameter.Key) && parameter.Value != null))
                {
                    ParametersUtils.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                }
            }

            const string outParam = "@tableNames";
            if (!oldSp)
            {
                ParametersUtils.AddSqlParameterOut(cmd, outParam, SqlDbType.VarChar, 500);
            }

            cmd.CommandType = CommandType.StoredProcedure;
            if (!wasOpen)
            {
                await context.Database.OpenConnectionAsync();
            }

            using (var adapter = new SqlDataAdapter())
            {
                adapter.SelectCommand = (SqlCommand)cmd;
                ds = new DataSet();
                await Task.Run(() => adapter.Fill(ds));
            }

            if (!oldSp)
            {
                var tableNames = ParametersUtils.GetParameter(cmd, outParam).ToString()?.Split(',');
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
                if (cmd.Connection != null)
                {
                    await cmd.Connection.CloseAsync();
                }
            }
        }

        return ds;
    }

    public async Task<DataTable> GetDataTableAsync(string spName, Dictionary<string, object> parameters)
    {
        DataTable dt = null;
        var context = contexts.GetContext(configuration["ContextName"]);
        await using var cmd = context.Database.GetDbConnection().CreateCommand();
        var wasOpen = cmd.Connection is { State: ConnectionState.Open };
        try
        {
            cmd.CommandText = spName;
            if (parameters.Count > 0)
            {
                foreach (var parameter in parameters.Where(parameter =>
                             !string.IsNullOrEmpty(parameter.Key) && parameter.Value != null))
                {
                    ParametersUtils.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                }
            }

            cmd.CommandType = CommandType.StoredProcedure;
            if (!wasOpen)
            {
                await context.Database.OpenConnectionAsync();
            }

            using var adapter = new SqlDataAdapter();
            adapter.SelectCommand = (SqlCommand)cmd;
            dt = new DataTable();
            adapter.Fill(dt);
        }
        finally
        {
            if (!wasOpen)
            {
                if (cmd.Connection != null)
                {
                    await cmd.Connection.CloseAsync();
                }
            }
        }

        return dt;
    }

    public async Task<int> OnlyExecuteAsync(string spName, Dictionary<string, object> parameters,
        bool useStoredProcedure, bool timeout)
    {
        var context = contexts.GetContext(configuration["ContextName"]);
        await using var cmd = context.Database.GetDbConnection().CreateCommand();
        var wasOpen = cmd.Connection is { State: ConnectionState.Open };
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

            cmd.CommandType = useStoredProcedure ? CommandType.StoredProcedure : CommandType.Text;

            if (!timeout)
            {
                cmd.CommandTimeout = 0;
            }

            if (!wasOpen)
            {
                await context.Database.OpenConnectionAsync();
            }

            return await cmd.ExecuteNonQueryAsync();
        }
        finally
        {
            if (!wasOpen)
            {
                if (cmd.Connection != null)
                {
                    await cmd.Connection.CloseAsync();
                }
            }
        }
    }

    public async Task<string> SpExecuteDeprecatedAsync(string spName, Dictionary<string, object> parameters,
        bool timeout)
    {
        var response = string.Empty;
        await using var context = contexts.GetContext(configuration["ContextName"]);
        await using var cmd = context.Database.GetDbConnection().CreateCommand();
        var wasOpen = cmd.Connection is { State: ConnectionState.Open };
        try
        {
            cmd.CommandText = spName;
            if (parameters.Count > 0)
            {
                foreach (var parameter in parameters.Where(parameter =>
                             !string.IsNullOrEmpty(parameter.Key) && parameter.Value != null))
                {
                    ParametersUtils.AddSqlParameter(cmd, parameter.Key, parameter.Value);
                }
            }

            cmd.CommandType = CommandType.StoredProcedure;
            if (!timeout)
            {
                cmd.CommandTimeout = 0;
            }

            if (!wasOpen)
            {
                await context.Database.OpenConnectionAsync();
            }

            await using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                response = reader.GetString(0);
            }
        }
        finally
        {
            if (!wasOpen)
            {
                if (cmd.Connection != null)
                {
                    await cmd.Connection.CloseAsync();
                }
            }
        }

        return response;
    }

    public async Task<ApiResponse> SpExecuteAsync(string spName, Dictionary<string, object> parameters,
        bool timeout)
    {
        var response = new ApiResponse();
        await using var context = contexts.GetContext(configuration["ContextName"]);
        await using var cmd = context.Database.GetDbConnection().CreateCommand();
        var wasOpen = cmd.Connection is { State: ConnectionState.Open };
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

            if (!wasOpen)
            {
                await context.Database.OpenConnectionAsync();
            }

            await using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                var schemaTable = await reader.GetSchemaTableAsync();
                response.Code = reader.IsDBNull(0) ? null : reader.GetString(0);
                // Check if the schema table contains the "message" column
                var columnExists = schemaTable != null && schemaTable.Rows.Cast<DataRow>().Any(row =>
                    row["ColumnName"].ToString().Equals("message", StringComparison.OrdinalIgnoreCase));
                if (columnExists)
                {
                    var indexMessage = reader.GetOrdinal("message");
                    if (indexMessage != -1 && !reader.IsDBNull(indexMessage))
                    {
                        response.Message = reader.GetString(indexMessage);
                    }
                }

                var payloadExists = schemaTable != null && schemaTable.Rows.Cast<DataRow>().Any(row =>
                    row["ColumnName"].ToString().Equals("payload", StringComparison.OrdinalIgnoreCase));
                if (payloadExists)
                {
                    var indexPayload = reader.GetOrdinal("payload");
                    if (indexPayload != -1 && !reader.IsDBNull(indexPayload))
                    {
                        response.Payload = reader.GetString(indexPayload);
                    }
                }
            }
        }
        finally
        {
            if (!wasOpen)
            {
                if (cmd.Connection != null)
                {
                    await cmd.Connection.CloseAsync();
                }
            }
        }

        return response;
    }
}

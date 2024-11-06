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

            await using var reader = await cmd.ExecuteReaderAsync();
            response = DbDataReaderMapper.ToList<T>(reader);
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

    public async Task<DataSet> GetDataSetAsync(string spName, Dictionary<string, object> parameters, bool oldSp,
        bool timeout)
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

            if (!timeout)
            {
                cmd.CommandTimeout = 0;
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
        var dt = new DataTable();
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

            await using var reader = await cmd.ExecuteReaderAsync();
            dt.Load(reader);
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

    public async Task<T> SpExecuteAsync<T>(string spName, Dictionary<string, object> parameters,
        bool timeout) where T : class, new()
    {
        var response = new T();
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
                // Reflection to access properties dynamically
                var properties = typeof(T).GetProperties();
                foreach (var property in properties)
                {
                    // Check if property name matches a column name (case-insensitive)
                    var columnName = reader.GetSchemaTable().Rows.Cast<DataRow>()
                        .Where(row =>
                            row["ColumnName"].ToString().Equals(property.Name, StringComparison.OrdinalIgnoreCase))
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
                //var schemaTable = await reader.GetSchemaTableAsync();
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
                if (cmd.Connection != null)
                {
                    await cmd.Connection.CloseAsync();
                }
            }
        }

        return response;
    }
}

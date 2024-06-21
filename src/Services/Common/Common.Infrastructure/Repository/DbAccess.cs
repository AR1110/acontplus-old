namespace Common.Infrastructure.Repository;

public class DbAccess : IDisposable
{
    private readonly IConfiguration _config;
    private readonly SqlConnection _connection;
    private SqlCommand _command;

    public DbAccess(IConfiguration config)
    {
        _config = config;
        _connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    public async Task QueryExecute(string query)
    {
        if (_connection != null)
        {
            await _connection.OpenAsync();
            _command = new SqlCommand(query, _connection);
            _command.CommandType = CommandType.Text;
        }
    }

    public async Task SPExecute(string spName, bool notimeout = false)
    {
        try
        {
            if (_connection != null)
            {
                await _connection.OpenAsync();
                _command = new SqlCommand(spName, _connection);
                if (notimeout) { _command.CommandTimeout = 0; }

                _command.CommandType = CommandType.StoredProcedure;
            }
        }
        catch (Exception)
        {
            Close();
            throw;
        }
    }

    public void AddDynamicParam(string paramName, object paramValue)
    {
        try
        {
            if (!string.IsNullOrEmpty(paramName) && paramValue != null && _command != null)
            {
                var sqlParam = new SqlParameter
                {
                    ParameterName = paramName,
                    SqlDbType = SqlTypes.GetDbType(paramValue),
                    Value = paramValue ?? DBNull.Value
                };
                _command.Parameters.Add(sqlParam);
            }
        }
        catch (Exception)
        {
            Close();
            throw;
        }
    }

    public async Task<int> OnlyExecuteAsync(bool timeout = true)
    {
        if (!timeout)
        {
            _command.CommandTimeout = 0;
        }

        return await _command.ExecuteNonQueryAsync();
    }

    public DataSet GetDataSet()
    {
        var ds = new DataSet();
        var dtResp = new DataTable();
        try
        {
            if (_command != null)
            {
                using var dataAdapter = new SqlDataAdapter(_command);
                dataAdapter.Fill(ds);
                if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    if (ds.Tables.Count > 0)
                    {
                        ds = new DataSet();
                    }

                    DtWarning(ref dtResp);
                    ds.Tables.Add(dtResp);
                }
            }
        }
        catch (Exception)
        {
            if (ds.Tables.Count > 0)
            {
                ds = new DataSet();
            }

            Close();
            throw;
        }

        return ds;
    }

    public DataTable GetDataTable()
    {
        var dt = new DataTable();
        try
        {
            if (_command != null)
            {
                using var dataAdapter = new SqlDataAdapter(_command);
                dataAdapter.Fill(dt);
                if (DataValidation.DataTableIsNull(dt))
                {
                    DtWarning(ref dt);
                }
            }
        }
        catch (Exception)
        {
            Close();
            throw;
        }

        return dt;
    }

    public ApiResponseDeprecated GetDefault()
    {
        var dt = new DataTable();
        var response = new ApiResponseDeprecated();
        if (_command != null)
        {
            using var dataAdapter = new SqlDataAdapter(_command);
            dataAdapter.Fill(dt);
            if (DataValidation.DataTableIsNull(dt))
            {
                response.Create("0", "La transacción no devolvio respuesta");
            }
            else
            {
                response = DataTableMapper.BindData<ApiResponseDeprecated>(dt);
            }
        }

        return response;
    }

    public ApiResponseDeprecated GetDataTableAsync()
    {
        var dt = new DataTable();
        var response = new ApiResponseDeprecated();
        if (_command != null)
        {
            using var dataAdapter = new SqlDataAdapter(_command);
            dataAdapter.Fill(dt);
            if (DataValidation.DataTableIsNull(dt))
            {
                response.Create("0", "La transacción no devolvio respuesta");
            }
            else
            {
                response.Create("1", payload: DataConverters.DataTableToJson(dt));
            }
        }

        return response;
    }

    public ApiResponseDeprecated GetDataSetAsync()
    {
        var ds = new DataSet();
        var response = new ApiResponseDeprecated();
        if (_command != null)
        {
            using var dataAdapter = new SqlDataAdapter(_command);
            dataAdapter.Fill(ds);
            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                if (ds.Tables.Count > 0)
                {
                    ds = new DataSet();
                }

                response.Create("0", "La transacción no devolvio respuesta");
            }
            else
            {
                response.Create("1", payload: DataConverters.DataSetToJson(ds, true));
            }
        }

        return response;
    }


    //If error exists
    public void Close()
    {
        if (_connection.State == ConnectionState.Open)
        {
            _connection.Close();
            _connection.Dispose();
        }

        if (_command != null)
        {
            _command.Dispose();
            _connection.Close();
        }
    }

    private void DtColumns(ref DataTable dt)
    {
        dt.Columns.Add(new DataColumn("code", typeof(string)));
        dt.Columns.Add(new DataColumn("message", typeof(string)));
        dt.Columns.Add(new DataColumn("payload", typeof(string)));
    }

    private void DtRows(ref DataTable dt, string message, string payload = null)
    {
        var dr = dt.NewRow();
        dr["code"] = "-1";
        dr["message"] = message;
        if (payload != null)
        {
            dr["payload"] = payload;
        }

        dt.Rows.Add(dr);
    }

    private void DtWarning(ref DataTable dt)
    {
        DtColumns(ref dt);
        DtRows(ref dt, "La transacción no devolvio respuesta", "");
    }

    private void Dispose(bool disposing)
    {
        if (disposing)
        {
            if (_command != null)
            {
                _command.Dispose();
            }

            _connection.Close();
            _connection.Dispose();
        }
    }

    ~DbAccess()
    {
        Dispose(false);
    }
}

namespace Common.Infrastructure.Repository;

public class DbAccess(IConfiguration config) : IDisposable
{
    private readonly SqlConnection _connection = new(config.GetConnectionString("DefaultConnection"));
    private SqlCommand _command;

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    public async Task SpExecuteAsync(string spName, bool notimeout = false)
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
            if (string.IsNullOrEmpty(paramName) || paramValue == null || _command == null)
            {
                return;
            }

            var sqlParam = new SqlParameter
            {
                ParameterName = paramName,
                SqlDbType = SqlTypes.GetDbType(paramValue),
                Value = paramValue ?? DBNull.Value
            };
            _command.Parameters.Add(sqlParam);
        }
        catch (Exception)
        {
            Close();
            throw;
        }
    }

    public async Task<ApiResponseDeprecated> GetDefaultAsync()
    {
        var dt = new DataTable();
        var response = new ApiResponseDeprecated();
        if (_command == null)
        {
            return response;
        }

        await using var reader = await _command.ExecuteReaderAsync();
        dt.Load(reader);

        if (DataValidation.DataTableIsNull(dt))
        {
            response.Create("0", "La transacción no devolvio respuesta");
        }
        else
        {
            response = DataTableMapper.BindData<ApiResponseDeprecated>(dt);
        }

        return response;
    }

    public async Task<ApiResponseDeprecated> GetDataTableAsync()
    {
        var dt = new DataTable();
        var response = new ApiResponseDeprecated();
        if (_command == null)
        {
            return response;
        }

        await using var reader = await _command.ExecuteReaderAsync();
        dt.Load(reader);

        if (DataValidation.DataTableIsNull(dt))
        {
            response.Create("0", "La transacción no devolvio respuesta");
        }
        else
        {
            response.Create("1", payload: DataConverters.DataTableToJson(dt));
        }

        return response;
    }

    public void Close()
    {
        if (_connection.State == ConnectionState.Open)
        {
            _connection.Close();
            _connection.Dispose();
        }

        if (_command == null)
        {
            return;
        }

        _command.Dispose();
        _connection.Close();
    }

    private void Dispose(bool disposing)
    {
        if (!disposing)
        {
            return;
        }

        _command?.Dispose();

        _connection.Close();
        _connection.Dispose();
    }

    ~DbAccess()
    {
        Dispose(false);
    }
}

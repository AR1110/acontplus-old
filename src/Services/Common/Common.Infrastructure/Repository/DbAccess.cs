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

    public ApiResponseDeprecated GetDefault()
    {
        var dt = new DataTable();
        var response = new ApiResponseDeprecated();
        if (_command == null)
        {
            return response;
        }

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

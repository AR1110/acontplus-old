using System.Data;
using System.Data.SqlClient;
using Lib.Common;
using Microsoft.Extensions.Configuration;
using Services.Lib.Common;

namespace DataAccess
{
    public class DbAccess : IDisposable
    {
        private IConfiguration _config;
        private readonly SqlConnection _connection;
        private SqlCommand _command;
        public DbAccess(IConfiguration config)
        {
            _config = config;
            _connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
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
        public void AddParameter(string paramName, SqlDbType paramType, object paramValue, bool isNull = false)
        {
            try
            {
                if (_command != null)
                {
                    SqlParameter sqlParam = new SqlParameter();
                    sqlParam.ParameterName = paramName;
                    sqlParam.SqlDbType = paramType; // DbType.Get(paramValue);
                    sqlParam.Value = paramValue;
                    sqlParam.IsNullable = isNull;
                    _command.Parameters.Add(sqlParam);
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
                    SqlParameter sqlParam = new SqlParameter();
                    sqlParam.ParameterName = paramName;
                    sqlParam.SqlDbType = DbType.Get(paramValue);
                    sqlParam.Value = paramValue ?? (object)DBNull.Value;
                    _command.Parameters.Add(sqlParam);
                }
            }
            catch (Exception)
            {
                Close();
                throw;
            }
        }
        public void AddOutputParam(string paramName, object paramValue)
        {
            if (!string.IsNullOrEmpty(paramName) && paramValue != null && _command != null)
            {
                SqlParameter sqlParam = new SqlParameter();
                sqlParam.ParameterName = paramName;
                sqlParam.SqlDbType = DbType.Get(paramValue);
                sqlParam.Direction = ParameterDirection.Output;
                _command.Parameters.Add(sqlParam);
            }
        }
        public object GetOutputParam(string paramName)
        {
            return _command.Parameters[$"{paramName}"].Value;
        }
        public void OnlyExecute()
        {
            _command.ExecuteNonQuery();
        }
        public object ExecuteScalar()
        {
            return _command.ExecuteScalar();
        }
        public void ExecuteReader()
        {
            try
            {
                _command.ExecuteReader();
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                _connection.Close();
            }
        }
        public DataSet GetDataSet()
        {
            DataSet ds = new DataSet();
            DataTable dtResp = new DataTable();
            try
            {
                if (_command != null)
                {
                    using (SqlDataAdapter dataAdapter = new SqlDataAdapter(_command))
                    {
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
            DataTable dt = new DataTable();
            try
            {
                if (_command != null)
                {
                    using (SqlDataAdapter dataAdapter = new SqlDataAdapter(_command))
                    {
                        dataAdapter.Fill(dt);
                        if (DataValidation.DataTableIsNull(dt))
                        {
                            DtWarning(ref dt);
                        }
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
        public GenericResponse GetDefault()
        {
            DataTable dt = new DataTable();
            var _response = new GenericResponse();
            if (_command != null)
            {
                using (SqlDataAdapter dataAdapter = new SqlDataAdapter(_command))
                {
                    dataAdapter.Fill(dt);
                    if (DataValidation.DataTableIsNull(dt))
                    {
                        _response.Create(code: "0", "La transacción no devolvio respuesta");
                    }
                    else
                    {
                        _response = DataTableMapper.BindData<GenericResponse>(dt);
                    }
                }
            }
            return _response;
        }
        public GenericResponse GetDataTableAsync()
        {
            DataTable dt = new DataTable();
            var _response = new GenericResponse();
            if (_command != null)
            {
                using (SqlDataAdapter dataAdapter = new SqlDataAdapter(_command))
                {
                    dataAdapter.Fill(dt);
                    if (DataValidation.DataTableIsNull(dt))
                    {
                        _response.Create(code: "0", "La transacción no devolvio respuesta");
                    }
                    else
                    {
                        _response.Create(code: "1", payload: Converters.DataTableToJSON(dt));
                    }
                }
            }
            return _response;
        }
        public GenericResponse GetDataSetAsync()
        {
            DataSet ds = new DataSet();
            var _response = new GenericResponse();
            if (_command != null)
            {
                using (SqlDataAdapter dataAdapter = new SqlDataAdapter(_command))
                {
                    dataAdapter.Fill(ds);
                    if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                    {
                        if (ds.Tables.Count > 0)
                        {
                            ds = new DataSet();
                        }
                        _response.Create(code: "0", "La transacción no devolvio respuesta");
                    }
                    else
                    {
                        _response.Create(code: "1", payload: Converters.DataSetToJSON(ds, true));
                    }
                }
            }
            return _response;
        }


        //If error exists
        public void Close()
        {
            try
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
            catch (Exception)
            {
                throw;
            }
        }
        public void DtColumns(ref DataTable dt)
        {
            dt.Columns.Add(new DataColumn("code", typeof(string)));
            dt.Columns.Add(new DataColumn("message", typeof(string)));
            dt.Columns.Add(new DataColumn("payload", typeof(string)));
        }
        public void DtRows(ref DataTable dt, string message, string payload = null)
        {
            DataRow dr = dt.NewRow();
            dr["code"] = "-1";
            dr["message"] = message;
            dr["payload"] = payload;
            dt.Rows.Add(dr);
        }
        public void DtWarning(ref DataTable dt)
        {
            DtColumns(ref dt);
            DtRows(ref dt, "La transacción no devolvio respuesta", "");
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected void Dispose(bool disposing)
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
}

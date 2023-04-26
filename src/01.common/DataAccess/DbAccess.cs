using Common.Logs;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess
{
    public class DbAccess
    {
        private IConfiguration _config;
        private readonly SqlConnection _connection;
        private SqlCommand _command;
        private LogWriter _log;
        public DbAccess(IConfiguration config)
        {
            _config = config;
            _connection = new SqlConnection(Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus")));
            _log = new LogWriter(_config);
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
        public async Task SPExecute(string spName)
        {
            try
            {
                if (_connection != null)
                {
                    await _connection.OpenAsync();
                    _command = new SqlCommand(spName, _connection);
                    _command.CommandType = CommandType.StoredProcedure;
                }
            }
            catch (Exception ex)
            {
                Close();
                _log.LogError("Error in SPExecute: " + ex.ToString());
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
            catch (Exception ex)
            {
                Close();
                _log.LogError("Error in AddParameter: " + ex.ToString());
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
            catch (Exception ex)
            {
                Close();
                _log.LogError("Error in AddDynamicParam: " + ex.ToString());
            }
        }
        public void OnlyExecute()
        {
            try
            {
                _command.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                _log.LogError("Error in OnlyExecute: " + ex.ToString());
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
            catch (Exception ex)
            {
                _log.LogError("Error in GetDataSet: " + ex.ToString());
                if (ds.Tables.Count > 0)
                {
                    ds = new DataSet();
                }
                DtError(ref dtResp, ex.Message);
                ds.Tables.Add(dtResp);
            }
            finally
            {
                _command.Dispose();
                _connection.Close();
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
                        if (DataHelper.DataTableIsNull(dt))
                        {
                            DtWarning(ref dt);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _log.LogError("Error in GetDataTable: " + ex.ToString());
                DtError(ref dt, ex.ToString());
            }
            finally
            {
                _command.Dispose();
                _connection.Close();
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
                    if (DataHelper.DataTableIsNull(dt))
                    {
                        _response.Create(code: "0", "La transacción no devolvio respuesta");
                    }
                    else
                    {
                        _response = DataHelper.BindData<GenericResponse>(dt);
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
                    if (DataHelper.DataTableIsNull(dt))
                    {
                        _response.Create(code: "0", "La transacción no devolvio respuesta");
                        //DtWarning(ref dt);
                    }
                    else
                    {
                        _response.Create(code: "1", payload: DataHelper.DataTableToJSON(dt));
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
                        _response.Create(code: "1", payload: DataHelper.DataSetToJSON(ds));
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
            catch (Exception ex)
            {
                _log.LogError("Error in Close: " + ex.ToString());
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
        public void DtError(ref DataTable dt, string message)
        {
            DtColumns(ref dt);
            DtRows(ref dt, "Error al ejecutar la transacción", message);
        }
    }
}
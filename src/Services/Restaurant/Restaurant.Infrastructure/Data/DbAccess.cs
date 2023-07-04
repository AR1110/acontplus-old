using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Restaurant.Core.Common;
using Restaurant.Core.Utils;

namespace Restaurant.Infrastructure.Data
{
    public class DbAccess : IDisposable
    {
        private readonly IConfiguration _configuration;
        private SqlConnection _connection;
        private SqlCommand _command;
        public DbAccess(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task SPExecute(string spName, bool notimeout = false)
        {
            if (_connection == null)
            {
                _connection = new SqlConnection(GetConnectionString());
                await _connection.OpenAsync();
                _command = new SqlCommand(spName, _connection);
                if (notimeout) { _command.CommandTimeout = 0; }
                _command.CommandType = CommandType.StoredProcedure;
            }
        }
        public string GetConnectionString()
        {
            var connStr = string.Empty;
            if (_configuration.GetChildren().Any(item => item.Key == "KeyEncrypt"))
            {
                connStr = Encryption.DecryptString(_configuration.GetSection("KeyEncrypt").Value, _configuration.GetConnectionString("DefaultConnection"));
            }
            else
            {
                connStr = _configuration.GetConnectionString("DefaultConnection");
            }
            return connStr;
        }
        public void AddParameter(string paramName, object paramValue)
        {
            if (!string.IsNullOrEmpty(paramName) && paramValue != null && _command != null)
            {
                SqlParameter sqlParam = new SqlParameter();
                sqlParam.ParameterName = paramName;
                sqlParam.SqlDbType = DbType.Get(paramValue);
                sqlParam.Value = paramValue ?? DBNull.Value;
                _command.Parameters.Add(sqlParam);
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
            _command.ExecuteReader();
        }
        public DataSet GetDataSet()
        {
            DataSet ds = new DataSet();
            DataTable dtResp = new DataTable();
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
            return ds;
        }
        public DataTable GetDataTable()
        {
            DataTable dt = new DataTable();
            if (_command != null)
            {
                using (SqlDataAdapter dataAdapter = new SqlDataAdapter(_command))
                {
                    dataAdapter.Fill(dt);
                    if (Validators.DataTableIsNull(dt))
                    {
                        DtWarning(ref dt);
                    }
                }
            }
            return dt;
        }
        //FOR SET RESPONSE FROM BD, JSON ETC
        public StructureResponse SimpleResponse()
        {
            DataTable dt = new DataTable();
            var _response = new StructureResponse();
            if (_command != null)
            {
                using (SqlDataAdapter dataAdapter = new SqlDataAdapter(_command))
                {
                    dataAdapter.Fill(dt);
                    if (Validators.DataTableIsNull(dt))
                    {
                        _response.Create(code: "-1", "La transacción no devolvio respuesta");
                    }
                    else
                    {
                        _response = Mappers.BindData<StructureResponse>(dt);
                    }
                }
            }
            return _response;
        }
        public StructureResponse SingleList()
        {
            DataTable dt = new DataTable();
            var _response = new StructureResponse();
            if (_command != null)
            {
                using (SqlDataAdapter dataAdapter = new SqlDataAdapter(_command))
                {
                    dataAdapter.Fill(dt);
                    if (Validators.DataTableIsNull(dt))
                    {
                        _response.Create(code: "-1", "La transacción no devolvio respuesta");
                    }
                    else
                    {
                        _response.Create(code: "0", payload: Converters.DataTableToJSON(dt));
                    }
                }
            }
            return _response;
        }
        public StructureResponse MultipleLists()
        {
            DataSet ds = new DataSet();
            var _response = new StructureResponse();
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
                        _response.Create(code: "-1", "La transacción no devolvio respuesta");
                    }
                    else
                    {
                        _response.Create(code: "0", payload: Converters.DataSetToJSON(ds));
                    }
                }
            }
            return _response;
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
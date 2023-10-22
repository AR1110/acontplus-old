using System.Data;
using Lib.Common;
using Lib.Common.Api;

namespace Domain.Models
{
    public static class DbResponse
    {
        public static GenericResponse SPDefault(DataTable dt)
        {
            GenericResponse _response = new GenericResponse();
            try
            {
                //Error en backend
                if (dt.Columns.Contains("code") && dt.Rows[0]["code"].ToString() == "-1")
                {
                    string payload = string.Empty;
                    if (dt.Columns.Contains("payload"))
                    {
                        payload = dt.Rows[0]["payload"].ToString();
                    }
                    _response.Create(code: "0", message: dt.Rows[0]["message"].ToString(), payload: payload);
                }
                else
                {
                    _response = DataTableMapper.BindData<GenericResponse>(dt);
                }
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: ex.Message);
            }
            return _response;
        }
        public static GenericResponse SPDataTable(DataTable dt)
        {
            GenericResponse _response = new GenericResponse();
            try
            {
                //Error en backend
                if (dt.Columns.Contains("code") && dt.Rows[0]["code"].ToString() == "-1")
                {
                    string payload = string.Empty;
                    if (dt.Columns.Contains("payload"))
                    {
                        payload = dt.Rows[0]["payload"].ToString();
                    }
                    _response.Create(code: "0", message: dt.Rows[0]["message"].ToString(), payload: payload);
                }
                else
                {
                    _response.Create(code: "1", payload: Converters.DataTableToJSON(dt));
                }
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: ex.Message);
            }
            return _response;
        }
        public static GenericResponse SPDataSet(DataSet ds)
        {
            GenericResponse _response = new GenericResponse();
            try
            {
                DataTable dt = ds.Tables[0];
                //Error en backend
                if (dt.Columns.Contains("code") && dt.Rows[0]["code"].ToString() == "-1")
                {
                    string payload = string.Empty;
                    if (dt.Columns.Contains("payload"))
                    {
                        payload = dt.Rows[0]["payload"].ToString();
                    }
                    _response.Create(code: "0", message: dt.Rows[0]["message"].ToString(), payload: payload);
                }
                else
                {
                    _response.Create(code: "1", payload: Converters.DataSetToJSON(ds, true));
                }
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: ex.Message);
            }
            return _response;
        }
    }
}

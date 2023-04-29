using DataAccess;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace BL.Admin.Data
{
    public class AccionService
    {
        private GenericResponse _response = new();
        private readonly IConfiguration _config;
        public AccionService(IConfiguration config)
        {
            _config = config;
        }
        public async Task<GenericResponse> Get(string json)
        {
            DataTable dt = new();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("Config.Accion_Get");
                adb.AddParameter("@json", SqlDbType.NVarChar, json);
                dt = adb.GetDataTable();
                _response.Create(code: "0", message: "OK", payload: DataHelper.DataTableToJSON(dt));
            }
            catch (Exception ex)
            {
                _response.Create(code: "-1", message: "Error en el servidor: " + ex.Message);
            }
            return _response;
        }

        public async Task<GenericResponse> PostAsync(string json)
        {
            DataTable dt = new();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("Config.Accion_Insert");
                adb.AddParameter("@json", SqlDbType.NVarChar, json);
                dt = adb.GetDataTable();
                _response.Create(code: "0", message: "OK", payload: DataHelper.DataTableToJSON(dt));
            }
            catch (Exception ex)
            {
                _response.Create(code: "-1", message: "Error en el servidor: " + ex.Message);
            }
            return _response;
        }

        public async Task<GenericResponse> PutAsync(string id, string json)
        {
            DataTable dt = new();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("Config.Accion_Update");
                adb.AddParameter("@id", SqlDbType.Int, id);
                adb.AddParameter("@json", SqlDbType.NVarChar, json);
                dt = adb.GetDataTable();

                _response.Create(code: "0", message: "OK", payload: DataHelper.DataTableToJSON(dt));
            }
            catch (Exception ex)
            {
                _response.Create(code: "-1", message: "Error en el servidor: " + ex.Message);
            }
            return _response;
        }

        public async Task<GenericResponse> DeleteAsync(string id)
        {
            DataTable dt = new();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("Config.Accion_Delete");
                adb.AddParameter("@id", SqlDbType.Int, id);
                dt = adb.GetDataTable();

                _response.Create(code: "0", message: "OK", payload: DataHelper.DataTableToJSON(dt));
            }
            catch (Exception ex)
            {
                _response.Create(code: "-1", message: "Error en el servidor: " + ex.Message);
            }
            return _response;
        }


    }
}
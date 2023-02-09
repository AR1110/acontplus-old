using DataAccess;
using Domain.Admin.Models;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace BL.Admin.Data
{
    public class SistemaService
    {
        private GenericResponse _response = new();
        private readonly IConfiguration _config;
        public SistemaService(IConfiguration config)
        {
            _config = config;
        }
        public async Task<GenericResponse> GetAsync(string json)
        {
            DataTable dt = new();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("Config.Sistema_Get");
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

        public async Task<GenericResponse> PostAsync(Sistema data)
        {
            DataTable dt = new();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("Config.Sistema_Insert");
                adb.AddParameter("@descripcion", SqlDbType.NVarChar, data.descripcion);
                adb.AddParameter("@codigo", SqlDbType.NVarChar, data.codigo);
                adb.AddParameter("@urlSistema", SqlDbType.NVarChar, data.urlSistema);
                adb.AddParameter("@hostApp", SqlDbType.NVarChar, data.hostApp);
                adb.AddParameter("@connectionStrings", SqlDbType.NVarChar, data.connectionStrings);
                dt = adb.GetDataTable();
                _response.Create(code: "0", message: "OK", payload: DataHelper.DataTableToJSON(dt));
            }
            catch (Exception ex)
            {
                _response.Create(code: "-1", message: "Error en el servidor: " + ex.Message);
            }
            return _response;
        }

        public async Task<GenericResponse> PutAsync(string id, Sistema data)
        {
            DataTable dt = new();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("Config.Sistema_Update");
                adb.AddParameter("@id", SqlDbType.Int, id);
                adb.AddParameter("@descripcion", SqlDbType.NVarChar, data.descripcion);
                adb.AddParameter("@urlSistema", SqlDbType.NVarChar, data.urlSistema);
                adb.AddParameter("@hostApp", SqlDbType.NVarChar, data.hostApp);
                adb.AddParameter("@connectionStrings", SqlDbType.NVarChar, data.connectionStrings);
                adb.AddParameter("@estado", SqlDbType.Bit, data.estado);
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
                await adb.SPExecute("Config.Sistema_Delete");
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
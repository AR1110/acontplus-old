using DataAccess;
using Domain.Admin.Models;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace BL.Admin.Data
{
    public class AsignacionService
    {
        private GenericResponse _response = new GenericResponse();
        private readonly IConfiguration _config;
        public AsignacionService(IConfiguration config)
        {
            _config = config;
        }
        public async Task<GenericResponse> GetAsync(string json)
        {
            DataTable dt = new DataTable();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("Config.Asignacion_Get");
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

        public async Task<GenericResponse> PostAsync(Asignacion data)
        {
            DataTable dt = new();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("Config.Asignacion_Insert");
                adb.AddParameter("@idAplicacionMenu", SqlDbType.Int, data.idAplicacionMenu);
                adb.AddParameter("@idAccion", SqlDbType.Int, data.idAccion);
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
            DataTable dt = new DataTable();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("Config.Asignacion_Delete");
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

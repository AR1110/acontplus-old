using DataAccess;
using Domain.Admin.Models;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace BL.Admin.Data
{
    public class UsuarioRolService
    {
        private GenericResponse _response = new GenericResponse();
        private readonly IConfiguration _config;
        public UsuarioRolService(IConfiguration config)
        {
            _config = config;
        }
        public async Task<GenericResponse> GetAsync(string json)
        {
            DataTable dt = new DataTable();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("App.UsuarioRol_Get");
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
        public async Task<GenericResponse> GetByUserAsync(string id)
        {
            DataTable dt = new DataTable();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("App.UsuarioRol_GetByUser");
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
        public async Task<GenericResponse> PostAsync(UsuarioRol data)
        {
            DataTable dt = new();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("App.UsuarioRol_Insert");
                adb.AddParameter("@idUsuario", SqlDbType.Int, data.idUsuario);
                adb.AddParameter("@idEntidad", SqlDbType.Int, data.idEntidad);
                adb.AddParameter("@idRol", SqlDbType.Int, data.idRol);
                dt = adb.GetDataTable();
                _response.Create(code: "0", message: "OK", payload: DataHelper.DataTableToJSON(dt));
            }
            catch (Exception ex)
            {
                _response.Create(code: "-1", message: "Error en el servidor: " + ex.Message);
            }
            return _response;
        }
        public async Task<GenericResponse> PutAsync(string id, UsuarioRol data)
        {
            DataTable dt = new DataTable();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("App.UsuarioRol_Update");
                adb.AddParameter("@id", SqlDbType.Int, id);
                adb.AddParameter("@idRol", SqlDbType.Int, data.idRol);
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
            DataTable dt = new DataTable();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("App.UsuarioRol_Delete");
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

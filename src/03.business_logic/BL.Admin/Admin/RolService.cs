using DataAccess;
using Domain.Admin.Models;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace BL.Admin.Data
{
    public class RolService
    {
        private GenericResponse _response = new GenericResponse();
        private readonly IConfiguration _config;
        public RolService(IConfiguration config)
        {
            _config = config;
        }
        public async Task<GenericResponse> GetAsync(string json)
        {
            DataTable dt = new DataTable();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("App.Rol_Get");
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
        public async Task<GenericResponse> GetAccesAsync(string ruc)
        {
            DataTable dt = new DataTable();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("App.Rol_GetId");
                adb.AddParameter("@ruc", SqlDbType.NVarChar, ruc);
                dt = adb.GetDataTable();
                _response.Create(code: "0", message: "OK", payload: DataHelper.DataTableToJSON(dt));
            }
            catch (Exception ex)
            {
                _response.Create(code: "-1", message: "Error en el servidor: " + ex.Message);
            }
            return _response;
        }
        public async Task<GenericResponse> PostAsync(Rol data)
        {
            DataTable dt = new();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("App.Rol_Insert");
                adb.AddParameter("@idPlanCliente", SqlDbType.NVarChar, data.idPlanCliente);
                adb.AddParameter("@descripcion", SqlDbType.NVarChar, data.descripcion);
                adb.AddParameter("@codigo", SqlDbType.NVarChar, data.codigo);
                dt = adb.GetDataTable();
                _response.Create(code: "0", message: "OK", payload: DataHelper.DataTableToJSON(dt));
            }
            catch (Exception ex)
            {
                _response.Create(code: "-1", message: "Error en el servidor: " + ex.Message);
            }
            return _response;
        }
        public async Task<GenericResponse> PutAsync(string id, Rol data)
        {
            DataTable dt = new DataTable();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("App.Rol_Update");
                adb.AddParameter("@id", SqlDbType.Int, id);
                adb.AddParameter("@descripcion", SqlDbType.NVarChar, data.descripcion);
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
                await adb.SPExecute("App.Rol_Delete");
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
        public async Task<GenericResponse> DuplicateAsync(string id, Rol data)
        {
            DataTable dt = new DataTable();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("App.Rol_Duplicate");
                adb.AddParameter("@id", SqlDbType.Int, id);
                adb.AddParameter("@idPlanCliente", SqlDbType.Int, data.idPlanCliente);
                adb.AddParameter("@descripcion", SqlDbType.NVarChar, data.descripcion);
                adb.AddParameter("@codigo", SqlDbType.NVarChar, data.codigo);
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

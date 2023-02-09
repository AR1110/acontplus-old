using DataAccess;
using Domain.Admin.Models;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data; 
namespace BL.Admin.Data
{
    public class AplicacionMenuService
    {
        private GenericResponse _response = new GenericResponse();
        private readonly IConfiguration _config;
        public AplicacionMenuService(IConfiguration config)
        {
            _config = config;
        }
        public async Task<GenericResponse> GetAsync(string json)
        {
            DataTable dt = new DataTable();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("Config.AplicacionMenu_Get");
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

        public async Task<GenericResponse> PostAsync(AplicacionMenu data)
        {
            DataTable dt = new DataTable();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("Config.AplicacionMenu_Insert");
                adb.AddParameter("@idAplicacion", SqlDbType.Int, data.idAplicacion);
                adb.AddParameter("@idMenu", SqlDbType.Int, data.idMenu);
                adb.AddParameter("@idSubMenu", SqlDbType.Int, data.idSubMenu);
                dt = adb.GetDataTable();
                _response.Create(code: "0", message: "OK", payload: DataHelper.DataTableToJSON(dt));
            }
            catch (Exception ex)
            {
                _response.Create(code: "-1", message: "Error en el servidor: " + ex.Message);
            }
            return _response;
        }

        public async Task<GenericResponse> PutAsync(string id, AplicacionMenu data)
        {
            DataTable dt = new DataTable();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("Config.AplicacionMenu_Update");
                adb.AddParameter("@id", SqlDbType.Int, id);
                adb.AddParameter("@idAplicacion", SqlDbType.Int, data.idAplicacion);
                adb.AddParameter("@idMenu", SqlDbType.Int, data.idMenu);
                adb.AddParameter("@idSubMenu", SqlDbType.Int, data.idSubMenu);
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
                await adb.SPExecute("Config.AplicacionMenu_Delete");
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
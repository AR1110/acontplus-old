
using DataAccess;
using Domain.Admin.Dtos;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace BL.Admin.Data
{
    public class AccesoMenuService
    {
        private GenericResponse _response = new GenericResponse();
        private readonly IConfiguration _config;
        public AccesoMenuService(IConfiguration config)
        {
            _config = config;
        }
        public async Task<GenericResponse> GetAsync(string json)
        {
            DataTable dt = new DataTable();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("Permit.AccesoMenu_Get");
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

        public async Task<GenericResponse> PutAsync(ApiAccessParam data)
        {
            DataTable dt = new DataTable();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("Permit.AccesoMenu_Update");
                adb.AddParameter("@jsonSubMenu", SqlDbType.NVarChar, data.jsonSubMenu);
                adb.AddParameter("@jsonAccion", SqlDbType.NVarChar, data.jsonAccion);
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

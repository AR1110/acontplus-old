using DataAccess;
using Domain.Admin.Models;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace BL.Admin.Data
{
    public class EntidadService
    {
        private GenericResponse _response = new GenericResponse();
        private readonly IConfiguration _config;
        public EntidadService(IConfiguration config)
        {
            _config = config;
        }
        public async Task<GenericResponse> GetAsync(string json)
        {
            DataTable dt = new DataTable();
            try
            {

                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("App.Entidad_Get");
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

        public async Task<GenericResponse> PostAsync(Entidad data)
        {
            DataTable dt = new();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("App.Entidad_Insert");
                adb.AddParameter("@ruc", SqlDbType.NVarChar, data.ruc);
                adb.AddParameter("@razonSocial", SqlDbType.NVarChar, data.razonSocial);
                adb.AddParameter("@nombreComercial", SqlDbType.NVarChar, data.nombreComercial);
                adb.AddParameter("@correo", SqlDbType.NVarChar, DataHelper.ToDBNullOrDefault(data.correo));
                adb.AddParameter("@telefono", SqlDbType.NVarChar, DataHelper.ToDBNullOrDefault(data.telefono));
                adb.AddParameter("@direccion", SqlDbType.NVarChar, DataHelper.ToDBNullOrDefault(data.direccion));
                dt = adb.GetDataTable();
                _response.Create(code: "0", message: "OK", payload: DataHelper.DataTableToJSON(dt));

            }
            catch (Exception ex)
            {
                _response.Create(code: "-1", message: "Error en el servidor: " + ex.Message);
            }
            return _response;
        }


        public async Task<GenericResponse> PutAsync(string id, Entidad data)
        {
            DataTable dt = new DataTable();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("App.Entidad_Update");
                adb.AddParameter("@id", SqlDbType.Int, id);
                adb.AddParameter("@ruc", SqlDbType.NVarChar, data.ruc);
                adb.AddParameter("@razonSocial", SqlDbType.NVarChar, data.razonSocial);
                adb.AddParameter("@nombreComercial", SqlDbType.NVarChar, data.nombreComercial);
                adb.AddParameter("@correo", SqlDbType.NVarChar, DataHelper.ToDBNullOrDefault(data.correo));
                adb.AddParameter("@telefono", SqlDbType.NVarChar, DataHelper.ToDBNullOrDefault(data.telefono));
                adb.AddParameter("@direccion", SqlDbType.NVarChar, DataHelper.ToDBNullOrDefault(data.direccion));
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
                await adb.SPExecute("App.Entidad_Delete");
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

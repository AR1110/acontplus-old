using DataAccess;
using Domain.Admin.Models;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace BL.Admin.Data
{
    public class LicenciaPlanService
    {
        private GenericResponse _response = new GenericResponse();
        private readonly IConfiguration _config;
        public LicenciaPlanService(IConfiguration config)
        {
            _config = config;
        }
        public async Task<GenericResponse> GetAsync(string json)
        {
            DataTable dt = new DataTable();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("Config.LicenciaPlan_Get");
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

        public async Task<GenericResponse> PostAsync(LicenciaPlan data)
        {
            DataTable dt = new();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("Config.LicenciaPlan_Insert");
                adb.AddParameter("@idLicencia", SqlDbType.Int, data.idLicencia);
                adb.AddParameter("@idAplicacion", SqlDbType.Int, data.idAplicacion);
                adb.AddParameter("@costo", SqlDbType.Decimal, data.costo);
                adb.AddParameter("@impuesto", SqlDbType.Decimal, data.impuesto);
                adb.AddParameter("@descuento", SqlDbType.Decimal, data.descuento);
                dt = adb.GetDataTable();
                _response.Create(code: "0", message: "OK", payload: DataHelper.DataTableToJSON(dt));
            }
            catch (Exception ex)
            {
                _response.Create(code: "-1", message: "Error en el servidor: " + ex.Message);
            }
            return _response;
        }


        public async Task<GenericResponse> PutAsync(string id, LicenciaPlan data)
        {
            DataTable dt = new DataTable();
            try
            {
                DbAccess adb = new DbAccess(_config);
                await adb.SPExecute("Config.LicenciaPlan_Update");
                adb.AddParameter("@id", SqlDbType.Int, id);
                adb.AddParameter("@costo", SqlDbType.Decimal, data.costo);
                adb.AddParameter("@impuesto", SqlDbType.Decimal, data.impuesto);
                adb.AddParameter("@descuento", SqlDbType.Decimal, data.descuento);
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
                await adb.SPExecute("Config.LicenciaPlan_Delete");
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
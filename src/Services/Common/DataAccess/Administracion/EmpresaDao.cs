
using Domain.Models;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace DataAccess.Administracion
{
    public class EmpresaDao
    {
        private readonly IConfiguration _config;

        protected GenericResponse _response;

        public EmpresaDao(IConfiguration config)
        {
            _config = config;
            _response = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsync(int idRol, string json)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("Administrador.Empresa_Get");
                db.AddParameter("idRol", SqlDbType.Int, idRol);
                db.AddParameter("json", SqlDbType.NVarChar, json);
                DataTable dt = db.GetDataTable();
                _response = DbResponse.SPDataTable(dt);
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
            }
            return _response;

        }
        public async Task<GenericResponse> InsertAsync(int idRol, Empresa data)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("Administrador.Empresa_Insert");
                db.AddParameter("idRol", SqlDbType.Int, idRol);
                db.AddParameter("ruc", SqlDbType.NVarChar, data.ruc);
                db.AddParameter("razonSocial", SqlDbType.NVarChar, data.razonSocial);
                db.AddParameter("nombreComercial", SqlDbType.NVarChar, data.nombreComercial);
                DataTable dt = db.GetDataTable();
                _response = DbResponse.SPDefault(dt);
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
            }
            return _response;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int id, Empresa data)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("Administrador.Empresa_Update");
                db.AddParameter("idRol", SqlDbType.Int, idRol);
                db.AddParameter("id", SqlDbType.Int, id);
                db.AddParameter("ruc", SqlDbType.NVarChar, data.ruc);
                db.AddParameter("razonSocial", SqlDbType.NVarChar, data.razonSocial);
                db.AddParameter("nombreComercial", SqlDbType.NVarChar, data.nombreComercial);
                db.AddParameter("estado", SqlDbType.Bit, data.estado);
                DataTable dt = db.GetDataTable();
                _response = DbResponse.SPDefault(dt);
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
            }
            return _response;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int id)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("Administrador.Empresa_Delete");
                db.AddParameter("idRol", SqlDbType.Int, idRol);
                db.AddParameter("id", SqlDbType.Int, id);
                DataTable dt = db.GetDataTable();
                _response = DbResponse.SPDefault(dt);
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
            }
            return _response;
        }
    }
}

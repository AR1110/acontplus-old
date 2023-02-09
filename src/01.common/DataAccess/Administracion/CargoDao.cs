
using Helpers;
using Domain.Models;
using System;
using System.Data;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace DataAccess
{
    public class CargoDao
    {
        private readonly IConfiguration _config;
        protected GenericResponse _response;

        public CargoDao(IConfiguration config)
        {
            _config = config;
            _response = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsync(int idRol, string json)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("Administrador.Cargo_Get");
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
        public async Task<GenericResponse> InsertAsync(int idRol, Cargo data)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("Administrador.Cargo_Insert");
                db.AddParameter("idRol", SqlDbType.Int, idRol);
                db.AddParameter("codigo", SqlDbType.NVarChar, data.codigo);
                db.AddParameter("descripcion", SqlDbType.NVarChar, data.descripcion);
                DataTable dt = db.GetDataTable();
                _response = DbResponse.SPDefault(dt);
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
            }
            return _response;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int id, Cargo data)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("Administrador.Cargo_Update");
                db.AddParameter("idRol", SqlDbType.Int, idRol);
                db.AddParameter("id", SqlDbType.Int, id);
                db.AddParameter("descripcion", SqlDbType.NVarChar, data.descripcion);
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
                await db.SPExecute("Administrador.Cargo_Delete");
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

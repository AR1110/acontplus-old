
using Domain.Models;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace DataAccess.Aplicacion
{
    public class UsuarioDao
    {
        protected GenericResponse _response;
        private readonly IConfiguration _config;
        public UsuarioDao(IConfiguration config)
        {
            _config = config;
            _response = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsync(string json)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("App.Usuario_Get");
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
        public async Task<GenericResponse> SearchAsync(string json)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("App.Usuario_Get_Search");
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
        public async Task<GenericResponse> InsertAsync(string json)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("App.Usuario_Insert");
                db.AddParameter("json", SqlDbType.NVarChar, json);
                DataTable dt = db.GetDataTable();
                _response = DbResponse.SPDefault(dt);
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
            }
            return _response;
        }
        public async Task<GenericResponse> UpdateAsync(int id, string json)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("App.Usuario_Update");
                db.AddParameter("id", SqlDbType.Int, id);
                db.AddParameter("json", SqlDbType.NVarChar, json);
                DataTable dt = db.GetDataTable();
                _response = DbResponse.SPDefault(dt);
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
            }
            return _response;
        }
        public async Task<GenericResponse> DeleteAsync(int id)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("App.Usuario_Delete");
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

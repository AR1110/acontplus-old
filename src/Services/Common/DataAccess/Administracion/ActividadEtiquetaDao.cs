
using System.Data;
using Common.Core.Models;
using Domain.Models;
using Domain.Models.Administracion;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Administracion
{
    public class ActividadEtiquetaDao
    {
        protected GenericResponse _response;
        private readonly IConfiguration _config;
        public ActividadEtiquetaDao(IConfiguration config)
        {
            _config = config;
            _response = new GenericResponse();
        }
        public async Task<GenericResponse> GetAsync(string json)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("Administrador.ActividadEtiqueta_Get");
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
        public async Task<GenericResponse> InsertAsync(int idRol, ActividadEtiqueta data)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("Administrador.ActividadEtiqueta_Insert");
                db.AddParameter("idRol", SqlDbType.Int, idRol);
                db.AddParameter("descripcion", SqlDbType.NVarChar, data.descripcion);
                db.AddParameter("codigo", SqlDbType.NVarChar, data.codigo);
                DataTable dt = db.GetDataTable();
                _response = DbResponse.SPDefault(dt);
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
            }
            return _response;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, int id, ActividadEtiqueta data)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("Administrador.ActividadEtiqueta_Update");
                db.AddParameter("idRol", SqlDbType.Int, idRol);
                db.AddParameter("id", SqlDbType.Int, id);
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
        public async Task<GenericResponse> DeleteAsync(int idRol, int id)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("Administrador.ActividadEtiqueta_Delete");
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

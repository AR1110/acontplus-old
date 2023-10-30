
using System.Data;
using Common.Core.Models;
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
                using (DbAccess db = new DbAccess(_config))
                {
                    await db.SPExecute("Administrador.ActividadEtiqueta_Get");
                    db.AddParameter("json", SqlDbType.NVarChar, json);
                    _response = db.GetDataTableAsync();
                }
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
                _response = db.GetDefault();
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
                using (DbAccess db = new DbAccess(_config))
                {

                    await db.SPExecute("Administrador.ActividadEtiqueta_Update");
                    db.AddParameter("idRol", SqlDbType.Int, idRol);
                    db.AddParameter("id", SqlDbType.Int, id);
                    db.AddParameter("descripcion", SqlDbType.NVarChar, data.descripcion);
                    _response = db.GetDefault();
                }
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
            }
            return _response;
        }
    }
}

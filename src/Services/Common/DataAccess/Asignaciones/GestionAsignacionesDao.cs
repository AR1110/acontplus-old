
using System.Data;
using Common.Core.Models;
using Domain.Models;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Asignaciones
{
    public class GestionAsignacionesDao
    {
        protected GenericResponse _response;
        private readonly IConfiguration _config;
        public GestionAsignacionesDao(IConfiguration config)
        {
            _config = config;
            _response = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsync(int idRol, string json)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("Asignaciones.GestionGeneral_Get");
                db.AddParameter("idRol", SqlDbType.Int, idRol);
                db.AddParameter("json", SqlDbType.NVarChar, json);
                DataSet ds = db.GetDataSet();
                _response = DbResponse.SPDataSet(ds);
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
            }
            return _response;

        }
    }
}


using Helpers;
using Domain.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace DataAccess
{
    public class EtiquetaDao
    {
        protected GenericResponse _response;
        private readonly IConfiguration _config;
        public EtiquetaDao(IConfiguration config)
        {
            _config = config;
            _response = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsync(string json)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("Administrador.Etiqueta_Get");
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
        public async Task<GenericResponse> InsertAsync(int idRol, int idActividad, List<Etiqueta> data)
        {
            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("Administrador.Etiqueta_Insert");
                db.AddParameter("idRol", SqlDbType.Int, idRol);
                db.AddParameter("idActividad", SqlDbType.Int, idActividad);
                var p = JsonConvert.SerializeObject(data);
                db.AddParameter("json", SqlDbType.NVarChar, p);
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

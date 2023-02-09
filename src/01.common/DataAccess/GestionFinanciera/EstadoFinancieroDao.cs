using Helpers;
using Domain.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace DataAccess
{
    public class EstadoFinancieroDao
    {
        private DataAccessObject _dao;
        private readonly IConfiguration _config;
        public EstadoFinancieroDao(IConfiguration config)
        {
            _config = config;
            _dao = new DataAccessObject(_config);
        }
        public async void Update(int idRol, string json)
        {
            List<EstadoFinanciero> estadoFinanciero = JsonConvert.DeserializeObject<List<EstadoFinanciero>>(json);
            foreach (var item in estadoFinanciero)
            {
                Dictionary<string, object> parameters = new Dictionary<string, object>();
                parameters.Add("idRol", idRol);
                parameters.Add("idTipoDocumento", item.idTipoDocumento);
                parameters.Add("idDocumento", item.idDocumento);
                parameters.Add("estado", item.estado);
                parameters.Add("codDoc", item.codDoc);
                DbResponse.SPDataTable(await _dao.GetDataTableAsync("Sistema.GestionFinanciera_Update_Document", parameters));
            }

        }
    }
}

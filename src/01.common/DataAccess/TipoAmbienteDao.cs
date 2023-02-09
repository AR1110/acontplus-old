using Domain.Models;
using Helpers;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess
{
    public class TipoAmbienteDao
    {
        private readonly IConfiguration _config;
        protected GenericResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public TipoAmbienteDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _gr = new GenericResponse();

        }
        public GenericResponse listTipoAmbiente()
        {
            var listar = new List<TipoAmbiente>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("SPTipoAmbienteList", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                _gr.id = reader.GetString(0);
                                _gr.message = reader.GetString(1);
                                _gr.titleSms = reader.GetString(2);

                                if (_gr.id == "1")
                                {
                                    var ta = new TipoAmbiente();
                                    ta.idTipoAmbiente = Convert.ToInt32(reader["idTipoAmbiente"]);
                                    ta.descripcion = reader["descripcion"].ToString();
                                    listar.Add(ta);
                                }

                            }
                        }
                    }
                }
                _gr.data = listar;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Tipo Ambiente Listar";
            }
            return _gr;
        }
    }
}

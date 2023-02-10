using Domain.Models;
using Domain.ViewModels;
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
    public class ContraPartidaCajaDao
    {
        protected GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ContraPartidaCajaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> ReadContraPartidaCajaAsync(int idRol, int idContraPartida)
        {
            var listar = new List<ContraPartidaCajaViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("ASPContraPartidaCajaRead", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("idContraPartida", idContraPartida);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                _gr.id = reader.GetString(0);
                                _gr.typeNotify = reader.GetString(1);
                                _gr.message = reader.GetString(2);
                                _gr.titleSms = reader.GetString(3);
                                if (_gr.id == "1")
                                {
                                    var item = new ContraPartidaCajaViewModel();
                                    item.contraPartidaCaja = new ContraPartidaCaja()
                                    {
                                        idContraPartidaCaja = reader.GetInt32(4),
                                        idCaja = reader.GetInt32(5),
                                        estado = reader.GetBoolean(6)
                                    };
                                    item.caja = reader.GetString(7);
                                    listar.Add(item);
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
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar ContraPartidaCaja";
            }
            return _gr;
        }
    }
}

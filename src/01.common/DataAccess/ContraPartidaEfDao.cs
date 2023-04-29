using Domain.Models;
using Domain.ViewModels;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess
{
    public class ContraPartidaEfDao
    {
        protected GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ContraPartidaEfDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> ReadContraPartidaEFAsync(int idRol, int idContraPartida)
        {
            var listar = new List<ContraPartidaEntidadFinancieraViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("ASPContraPartidaEFRead", con))
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
                                    var item = new ContraPartidaEntidadFinancieraViewModel();
                                    item.contraPartidaEntidadFinanciera = new ContraPartidaEntidadFinanciera()
                                    {
                                        idContraPartidaEntidadFinanciera = reader.GetInt32(4),
                                        idEntidadFinanciera = reader.GetInt32(5),
                                        estado = reader.GetBoolean(6)
                                    };
                                    item.entidadFinanciera = reader.GetString(7);
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
                _gr.titleSms = "Listar ContraPartida Entidad Financiera";
            }
            return _gr;
        }
    }
}

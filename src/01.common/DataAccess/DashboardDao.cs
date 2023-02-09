using Domain.Models;
using Helpers;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace DataAccess
{
    public class DashboardDao
    {
        private readonly IConfiguration _config;

        protected GenericResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public DashboardDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _gr = new GenericResponse();

        }

        public async Task<GenericResponse> GetAsync(int idRol)
        {
            var count = new Dashboard();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPDashboardGestionCantidad", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                        if (_gr.id == "1")
                        {
                            count = new Dashboard
                            {
                                cantidadUsuario = reader.GetInt32(3),
                                cantidadArticulo = reader.GetInt32(4),
                                cantidadCliente = reader.GetInt32(5),
                                cantidadProveedor = reader.GetInt32(6),
                                cantidadFacturaV = reader.GetInt32(7),
                                cantidadFacturaC = reader.GetInt32(8),
                                cantidadProforma = reader.GetInt32(9),
                                cantidadNotaEntrega = reader.GetInt32(10),
                            };
                        }
                    }
                }
                _gr.data = count;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Cantidad Datos";
            }
            return _gr;
        }
    }
}

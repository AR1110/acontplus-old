
using System.Data;
using System.Data.SqlClient;
using Domain.Models;
using Domain.ViewModels;
using Lib.Common;
using Microsoft.Extensions.Configuration;

namespace DataAccess
{
    public class ClienteDao
    {
        protected GenericResponse _response;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ClienteDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("KeyEncryption").Value, _config.GetConnectionString("DefaultConnection"));
            _response = new GenericResponse();
        }

        public async Task<GenericResponse> GetDetalleClienteAsync(int idRol, int idCliente)
        {
            var cl = new ClienteViewModel();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPClienteDetalleGet", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idCliente", idCliente);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();

                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _response.id = reader.GetString(0);
                        _response.message = reader.GetString(1);
                        _response.titleSms = reader.GetString(2);

                        if (_response.id == "1")
                        {
                            cl.cliente = new Cliente()
                            {
                                numeroIdentificacion = reader.GetString(3),
                                nombreComercial = reader.GetString(4),
                                nombreFiscal = reader.GetString(5),
                                direccion = reader.GetString(6),
                                telefono = reader.GetString(7),
                                correo = reader.GetString(8),
                            };
                            cl.tipoIdentificacion = reader.GetString(9);
                            cl.tipoClienteProveedor = reader.GetString(10);
                            cl.tipoEntidad = reader.GetString(11);
                            cl.subContribuyente = reader.GetString(12);
                            cl.tiempoCredito = reader.GetString(13);
                            cl.ciudad = reader.GetString(14);
                            cl.provincia = reader.GetString(15);

                        }
                    }
                }
                _response.data = cl;
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message;
                _response.titleSms = "Get Detalle Cliente";
            }
            finally
            {

            }
            return _response;
        }


    }

}

using Domain.Models.ConfigEmpresa;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess.ConfigEmpresa
{
    public class ConfigVentaDetalleDao
    {
        private GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ConfigVentaDetalleDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("KeyEncryption").Value, _config.GetConnectionString("DefaultConnection"));
            _gr = new GenericResponse();
        }


        public async Task<GenericResponse> GetAsync(int idRol)
        {
            var config = new ConfigVentaDetalle();

            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPConfigVentaDetalleGet", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        if (_gr.id == "1")
                        {
                            config = new ConfigVentaDetalle()
                            {
                                idConfigVentaDetalle = reader.GetInt64(2),
                                porcentajeIva = reader.GetBoolean(3),
                                porcentajeDescuento = reader.GetBoolean(4),
                                descuento = reader.GetBoolean(5),
                                totalDescuento = reader.GetBoolean(6),
                                ice = reader.GetBoolean(7)
                            };
                        }
                    }
                }
                _gr.data = config;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Configuracion Detalle";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, ConfigVentaDetalle data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("ASPConfigVentaDetalleUpdate", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idConfigVentaDetalle", data.idConfigVentaDetalle);
                    cmd.Parameters.AddWithValue("porcentajeIva", data.porcentajeIva);
                    cmd.Parameters.AddWithValue("porcentajeDescuento", data.porcentajeDescuento);
                    cmd.Parameters.AddWithValue("descuento", data.descuento);
                    cmd.Parameters.AddWithValue("totalDescuento", data.totalDescuento);
                    cmd.Parameters.AddWithValue("ice", data.ice);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Actualizar Detalle Documento";
            }
            finally
            {

            }
            return _gr;
        }
    }
}

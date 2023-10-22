using System.Data;
using System.Data.SqlClient;
using Domain.Models;
using Lib.Common.Api;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Ventas
{
    public class NotaEntregaDao
    {
        private GenericResponse _gr;
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public NotaEntregaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> ConvertAsync(int idRol, int idNotaEntrega)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Ventas.NotaEntrega_Convert", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("idNotaEntrega", idNotaEntrega);
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
                _gr.titleSms = "Convertir NotaEntrega a Factura";
            }
            finally
            {

            }
            return _gr;
        }
        public async Task<object[]> DataSendEmailAsync(string json)
        {
            var send = new Email();
            var invoiceName = "";
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    var cmd = new SqlCommand("Ventas.NotaEntrega_SendEmail", con);
                    cmd.Parameters.AddWithValue("json", json);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        if (_gr.id == "1")
                        {
                            send = new Email()
                            {
                                from = reader.GetString(2),
                                password = reader.GetString(3),
                                to = reader.GetString(4),
                                subject = reader.GetString(5),
                                message = reader.GetString(6),
                                cc = reader.GetString(7),
                            };
                            invoiceName = reader.GetString(8);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
            }
            finally
            {

            }
            return new object[] { send, invoiceName };
        }
    }
}

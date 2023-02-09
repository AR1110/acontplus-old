using Helpers;
using Domain.Models;
using Domain.ViewModels;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Ventas
{
    public class NotaEntregaDao : ConnectionDb
    {
        private GenericResponse _gr;
        public NotaEntregaDao()
        {
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> ConvertAsync(int idRol, int idNotaEntrega)
        {
            try
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
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Convertir NotaEntrega a Factura";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
        public async Task<object[]> DataSendEmailAsync(string json)
        {
            var send = new Email();
            var invoiceName = "";
            try
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
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
            }
            finally
            {
                con.Close();
            }
            return new object[] { send, invoiceName };
        }
    }
}

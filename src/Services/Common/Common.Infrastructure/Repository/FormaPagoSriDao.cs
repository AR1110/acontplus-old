using System.Data;
using Common.Core.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Common.Infrastructure.Repository
{
    public class FormaPagoSriDao
    {
        private readonly IConfiguration _config;
        protected GenericResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public FormaPagoSriDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();

        }
        public async Task<GenericResponse> OptionFormaPagoSriAsync()
        {
            var listar = new List<FormaPagoSri>();
            try
            {
                using (var con = new SqlConnection(_connectionStrings))
                {
                    using (var cmd = new SqlCommand("ASPFormaPagoSriOption", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                _gr.id = reader.GetString(0);
                                _gr.typeNotify = reader.GetString(1);
                                _gr.message = reader.GetString(2);
                                _gr.titleSms = reader.GetString(3);
                                if (_gr.id == "1")
                                {
                                    var item = new FormaPagoSri();
                                    item.idFormaPagoSri = reader.GetInt32(4);
                                    item.descripcion = reader.GetString(5);
                                    item.codigo = reader.GetString(6);
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
                _gr.titleSms = "Option Forma de Pago del Sri";
            }

            return _gr;
        }
    }
}

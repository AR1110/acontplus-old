using System.Data;
using Common.Core.Models;
using Domain.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DataAccess
{
    public class TipoPersonaDao
    {
        private readonly IConfiguration _config;
        protected GenericResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public TipoPersonaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();

        }
        public async Task<GenericResponse> ReadTipoPersonaAsync()
        {
            var listar = new List<TipoPersona>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPTipoPersonaRead", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.typeNotify = reader.GetString(1);
                        _gr.message = reader.GetString(2);
                        _gr.titleSms = reader.GetString(3);
                        if (_gr.id == "1")
                        {
                            var _tp = new TipoPersona()
                            {
                                idTipoPersona = reader.GetInt32(4),
                                descripcion = reader.GetString(5),
                                codigo = reader.GetString(6),
                                estado = reader.GetBoolean(7)
                            };
                            listar.Add(_tp);
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
                _gr.titleSms = "Listar Tipo Persona";
            }
            return _gr;
        }
    }
}

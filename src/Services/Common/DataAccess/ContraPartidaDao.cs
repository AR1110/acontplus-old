using System.Data;
using System.Data.SqlClient;
using Domain.Models;
using Domain.ViewModels;
using Lib.Common;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace DataAccess
{
    public class ContraPartidaDao
    {
        protected GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public ContraPartidaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();
        }
        public async Task<GenericResponse> CreateContraPartidaAsync(int idRol, ContraPartida data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("ASPContraPartidaCreate", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                        cmd.Parameters.AddWithValue("codigo", data.codigo);
                        cmd.Parameters.AddWithValue("observacion", data.observacion ?? "");
                        var c = JsonConvert.SerializeObject(data.dataCaja);
                        cmd.Parameters.Add(new SqlParameter("jsonCaja", c));
                        var ef = JsonConvert.SerializeObject(data.dataEntidadFinanciera);
                        cmd.Parameters.Add(new SqlParameter("jsonEntidadFinanciera", ef));
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
                            }
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Registrar ContraPartida";
            }
            return _gr;
        }
        public async Task<GenericResponse> ReadContraPartidaAsync(int idRol)
        {
            var listar = new List<ContraPartidaViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("ASPContraPartidaRead", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
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
                                    var item = new ContraPartidaViewModel();
                                    item.contraPartida = new ContraPartida()
                                    {
                                        idContraPartida = reader.GetInt32(4),
                                        descripcion = reader.GetString(5),
                                        codigo = reader.GetString(6),
                                        observacion = reader.GetString(7),
                                        estado = reader.GetBoolean(8)
                                    };
                                    item.totalRecords = reader.GetInt32(9);
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
                _gr.titleSms = "Listar ContraPartido";
            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateContraPartidaAsync(int idRol, ContraPartida data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("ASPContraPartidaUpdate", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("idContraPartida", data.idContraPartida);
                        cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                        cmd.Parameters.AddWithValue("observacion", data.observacion ?? "");
                        cmd.Parameters.AddWithValue("estado", data.estado);
                        var c = JsonConvert.SerializeObject(data.dataCaja);
                        cmd.Parameters.Add(new SqlParameter("jsonCaja", c));
                        var ef = JsonConvert.SerializeObject(data.dataEntidadFinanciera);
                        cmd.Parameters.Add(new SqlParameter("jsonEntidadFinanciera", ef));
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
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Actualizar ContraPartida";
            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteContraPartidaAsync(int idRol, int idContraPartida)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("ASPContraPartidaDelete", con))
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

                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Eliminar ContraPartida";
            }
            return _gr;
        }
    }
}

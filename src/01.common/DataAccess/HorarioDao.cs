using Domain.Models;
using Domain.ViewModels;
using Helpers;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess
{
    public class HorarioDao 
    {
        private readonly IConfiguration _config;
        protected GenericResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public HorarioDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("keyEncrypt").Value, _config.GetConnectionString("AcontPlus"));
            _gr = new GenericResponse();

        }
        public async Task<GenericResponse> ReadHorarioAsync(int idRol, int idTurno)
        {
            var listar = new List<HorarioViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("ASPHorarioRead", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("idTurno", idTurno);
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
                                    var item = new HorarioViewModel
                                    {
                                        horario = new Horario()
                                        {
                                            idHorario = reader.GetInt32(4),
                                            apertura = reader.GetTimeSpan(5).ToString(),
                                            cierre = reader.GetTimeSpan(6).ToString(),
                                            estado = reader.GetBoolean(7),
                                        },
                                        diaSemana = reader.GetString(8),
                                        diaLaborable = reader.GetString(9),
                                        clase = reader.GetString(10)
                                    };
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
                _gr.titleSms = "Listar Horario";
            }

            return _gr;
        }
        public async Task<GenericResponse> ListDiaAsycn()
        {
            var listar = new List<HorarioViewModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("ASPDisList", con))
                    {
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

                                    var item = new HorarioViewModel();
                                    item.horario = new Horario()
                                    {
                                        idDia = reader.GetInt32(4),
                                        estado = reader.GetBoolean(5),
                                        apertura = reader.GetString(6),
                                        cierre = reader.GetString(7),
                                    };
                                    item.diaSemana = reader.GetString(8);
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
                _gr.titleSms = "Listar Dias de la Semana";
            }
            return _gr;
        }
    }
}

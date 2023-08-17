using System.Data;
using System.Data.SqlClient;
using Domain.Models;
using Lib.Common;
using Microsoft.Extensions.Configuration;

namespace DataAccess
{
    public class AccesosDao
    {
        private readonly IConfiguration _config;
        protected GenericResponse _gr;
        private readonly string _connectionStrings = string.Empty;
        public AccesosDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("AcontPlus");
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> CreateAccesosAsync(accesosOperaciones data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("SPAccesoCreate", con))
                    {
                        cmd.Parameters.AddWithValue("@idPolitica", data.politica.idPolitica);
                        cmd.Parameters.AddWithValue("@idMenu", data.menu.idMenu);
                        cmd.Parameters.AddWithValue("@idAcciones", data.acciones.idAcciones);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                _gr.id = reader.GetString(0);
                                _gr.message = reader.GetString(1);
                                _gr.titleSms = reader.GetString(2);
                            }
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Agregar Accesos ";
            }
            return _gr;
        }

        public async Task<GenericResponse> ReadAccesosAsync(accesosOperaciones data)
        {
            var listar = new List<accesosOperaciones>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("SPAccesoRead", con))
                    {
                        cmd.Parameters.AddWithValue("@idPolitica", data.politica.idPolitica);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                _gr.id = reader.GetString(0);
                                _gr.message = reader.GetString(1);
                                _gr.titleSms = reader.GetString(2);
                                if (_gr.id == "1")
                                {
                                    var a = new accesosOperaciones();
                                    a.accesos = new Accesos()
                                    {
                                        idAccesos = Convert.ToInt32(reader["idAccesos"])
                                    };
                                    a.menu = new Menu()
                                    {
                                        idMenu = Convert.ToInt32(reader["idMenu"])
                                    };
                                    a.politica = new Politica()
                                    {
                                        idPolitica = Convert.ToInt32(reader["idPolitica"])
                                    };
                                    a.acciones = new Acciones()
                                    {
                                        idAcciones = Convert.ToInt32(reader["idAcciones"])

                                    };

                                    listar.Add(a);
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
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Accesos";
            }
            return _gr;
        }

        public async Task<GenericResponse> UpdateAccesosAsync(accesosOperaciones data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("SPAccesosUpdate", con))
                    {
                        cmd.Parameters.AddWithValue("@idAccesos", data.accesos.idAccesos);
                        cmd.Parameters.AddWithValue("@estado", data.accesos.estado);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                _gr.id = reader.GetString(0);
                                _gr.message = reader.GetString(1);
                                _gr.titleSms = reader.GetString(2);
                            }
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Actualizar Acceso";
            }
            return _gr;
        }

    }
}
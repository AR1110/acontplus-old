using System.Data;
using Common.Core.Models;
using Domain.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DataAccess
{
    public class AccionesDao
    {
        protected GenericResponse _gr;

        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        public AccionesDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();
        }
        public async Task<GenericResponse> CreateAccionesAsync(Acciones data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {

                    using (SqlCommand cmd = new SqlCommand("SPAccionesCreate", con))
                    {
                        cmd.Parameters.AddWithValue("@descripcion", data.descripcion);
                        cmd.Parameters.AddWithValue("@codigo", data.codigo);
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
                _gr.titleSms = "Agreagar Acciones";
            }
            return _gr;
        }
        public async Task<GenericResponse> ReadAccionesAsync()
        {
            var listar = new List<Acciones>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("SPAccionesRead", con))
                    {
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
                                    var a = new Acciones();
                                    a.idAcciones = Convert.ToInt32(reader["idAcciones"]);
                                    a.codigo = reader["codigo"].ToString();
                                    a.descripcion = reader["descripcion"].ToString();
                                    a.estado = Convert.ToBoolean(reader["estado"]);
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
                _gr.titleSms = "Listas Acciones";
            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAccionesAsync(Acciones data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("SPAccionesUpdate", con))
                    {
                        cmd.Parameters.AddWithValue("@idAcciones", data.idAcciones);
                        cmd.Parameters.AddWithValue("@descripcion", data.descripcion);
                        cmd.Parameters.AddWithValue("@codigo", data.codigo);
                        cmd.Parameters.AddWithValue("@estado", data.estado);
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
                _gr.titleSms = "Actualizar Acciones";
            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteAccionesAsync(int idAccion)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("SPAccionesDelete", con))
                    {
                        cmd.Parameters.AddWithValue("@idAcciones", idAccion);
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
                _gr.titleSms = "Eliminar Acciones";
            }
            return _gr;
        }
    }
}
using Domain.Models;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess
{
    public class TarifaDao
    {
        private readonly IConfiguration _config;
        protected GenericResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public TarifaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = Encryption.DecryptString(_config.GetSection("KeyEncryption").Value, _config.GetConnectionString("DefaultConnection"));
            _gr = new GenericResponse();

        }

        //Gestion de informacion
        public async Task<GenericResponse> CreateTarifaAsync(int idRol, Tarifa data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("ASPTarifaCreate", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                        cmd.Parameters.AddWithValue("codigo", data.codigo);
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
                _gr.titleSms = "Registrar Tarifa";

            }
            return _gr;
        }
        public async Task<GenericResponse> ReadTarifaAsync(int idRol, int pageIndex, int pageSize)
        {
            var listar = new List<Tarifa>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("ASPTarifaRead", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("pageIndex", pageIndex);
                        cmd.Parameters.AddWithValue("pageSize", pageSize);
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
                                    var t = new Tarifa();
                                    t.idTarifa = reader.GetInt32(4);
                                    t.descripcion = reader.GetString(5);
                                    t.codigo = reader.GetString(6);
                                    t.predeterminada = reader.GetBoolean(7);
                                    t.estado = reader.GetBoolean(8);
                                    t.totalRecords = reader.GetInt32(9);
                                    listar.Add(t);
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
                _gr.titleSms = "Listar Tarifa de Precio";
            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateTarifaAsync(int idRol, Tarifa data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("ASPTarifaUpdate", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("idTarifa", data.idTarifa);
                        cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                        cmd.Parameters.AddWithValue("estado", data.estado);
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
                _gr.titleSms = "Actualizar Tarifa";

            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteTarifaAsync(int idRol, int idTarifa)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("ASPTarifaDelete", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("idTarifa", idTarifa);
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
                _gr.titleSms = "Eliminar Tarifa";

            }
            return _gr;
        }

        //Operaciones Espaciales
        public async Task<GenericResponse> SelectAync(int idRol)
        {
            var list = new List<Tarifa>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPTarifaSelect", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();

                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.message = reader.GetString(1);
                        _gr.titleSms = reader.GetString(2);
                        if (_gr.id == "1")
                        {
                            var item = new Tarifa()
                            {
                                idTarifa = reader.GetInt32(3),
                                descripcion = reader.GetString(4),
                                codigo = reader.GetString(5)
                            };
                            list.Add(item);
                        }
                    }
                }
                _gr.data = list;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Tarifa";
            }
            return _gr;
        }

    }
}
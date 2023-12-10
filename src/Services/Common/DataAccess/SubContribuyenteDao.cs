using System.Data;
using Common.Core.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DataAccess
{
    public class SubContribuyenteDao
    {
        private readonly IConfiguration _config;
        protected GenericResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public SubContribuyenteDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();

        }
        public async Task<GenericResponse> CreateSubContribuyenteAsync(int idRol, SubContribuyenteOperaciones data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("ASPSubContribuyenteCreate", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("idTipoContribuyente", data.tipoContribuyente.idTipoContribuyente);
                        cmd.Parameters.AddWithValue("descripcion", data.subContribuyente.descripcion);
                        cmd.Parameters.AddWithValue("codigo", data.subContribuyente.codigo);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
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
                _gr.titleSms = "Registrar SubContribuyente";
            }
            return _gr;
        }
        public GenericResponse ReadSubContribuyente(int idRol, int idTipoContribuyente)
        {
            var listar = new List<SubContribuyenteOperaciones>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("ASPSubContribuyenteRead", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("idTipoContribuyente", idTipoContribuyente);
                        cmd.CommandType = CommandType.StoredProcedure;
                        con.Open();
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
                                    var sc = new SubContribuyenteOperaciones();

                                    sc.subContribuyente = new SubContribuyente()
                                    {
                                        idSubContribuyente = reader.GetInt32(4),
                                        descripcion = reader.GetString(5),
                                        codigo = reader.GetString(6),
                                        estado = reader.GetBoolean(7)
                                    };
                                    sc.tipoContribuyente = new TipoContribuyente()
                                    {
                                        idTipoContribuyente = reader.GetInt32(8),
                                        descripcion = reader.GetString(9)
                                    };
                                    listar.Add(sc);
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
                _gr.titleSms = "SubContribuyente Listar";
            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateSubContribuyenteAsync(int idRol, SubContribuyenteOperaciones data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("ASPSubContribuyenteUpdate", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("idSubContribuyente", data.subContribuyente.idSubContribuyente);
                        cmd.Parameters.AddWithValue("idTipoContribuyente", data.tipoContribuyente.idTipoContribuyente);
                        cmd.Parameters.AddWithValue("descripcion", data.subContribuyente.descripcion);
                        cmd.Parameters.AddWithValue("codigo", data.subContribuyente.codigo);
                        cmd.Parameters.AddWithValue("estado", data.subContribuyente.estado);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
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
                _gr.titleSms = "Actualizar SubContribuyente";
            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteSubContribuyenteAsync(int idRol, int idSubContribuyente)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("ASPSubContribuyenteDelete", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.Parameters.AddWithValue("idSubContribuyente", idSubContribuyente);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
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
                _gr.titleSms = "Eliminar SubContribuyente";
            }
            return _gr;
        }
        //Operaciones Especiales
        public async Task<GenericResponse> OptionSubContribuyenteAsync(int idRol)
        {
            var listar = new List<SubContribuyenteOperaciones>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    using (SqlCommand cmd = new SqlCommand("ASPSubContribuyenteOption", con))
                    {
                        cmd.Parameters.AddWithValue("idRol", idRol);
                        cmd.CommandType = CommandType.StoredProcedure;
                        await con.OpenAsync();
                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                _gr.id = reader.GetString(0);
                                _gr.typeNotify = reader.GetString(1);
                                _gr.message = reader.GetString(2);
                                _gr.titleSms = reader.GetString(3);

                                if (_gr.id == "1")
                                {
                                    var sc = new SubContribuyenteOperaciones();

                                    sc.subContribuyente = new SubContribuyente()
                                    {
                                        idSubContribuyente = reader.GetInt32(4),
                                        descripcion = reader.GetString(5),
                                        codigo = reader.GetString(6),
                                        estado = reader.GetBoolean(7)
                                    };
                                    sc.tipoContribuyente = new TipoContribuyente()
                                    {
                                        idTipoContribuyente = reader.GetInt32(8),
                                        descripcion = reader.GetString(9)
                                    };
                                    listar.Add(sc);
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
                _gr.titleSms = "SubContribuyente Options";
            }
            return _gr;
        }
    }
}

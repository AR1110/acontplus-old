using Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Helpers;

namespace DataAccess.Administracion
{
    public class PoliticaDao : ConnectionDb
    {
        protected GenericResponse _gr;

        public PoliticaDao()
        {
            _gr = new GenericResponse();
        }

        //Gestios de Informacion
        public async Task<GenericResponse> GetAsync(int idRol, int pageIndex, int pageSize)
        {
            var list = new List<Politica>();
            try
            {
                SqlCommand cmd = new SqlCommand("aspPoliticaGet", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("pageIndex", pageIndex);
                cmd.Parameters.AddWithValue("pageSize", pageSize);
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
                        var p = new Politica
                        {
                            idPolitica = reader.GetInt32(3),
                            descripcion = reader.GetString(4),
                            codigo = reader.GetString(5),
                            estado = reader.GetBoolean(6),
                            fechaRegistro = reader.GetDateTime(7).ToString("yyyy-MM-dd"),
                            totalRecords = reader.GetInt32(8)
                        };
                        list.Add(p);
                    }
                }
                _gr.data = list;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Politica Listar";

            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, Politica data)
        {
            try
            {
                SqlCommand cmd = new SqlCommand("aspPoliticaInsert", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                cmd.Parameters.AddWithValue("codigo", data.codigo);
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
                _gr.titleSms = "Registrar Politica";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
        public async Task<GenericResponse> UpdateAsync(int idRol, Politica data)
        {
            try
            {
                SqlCommand cmd = new SqlCommand("aspPoliticaUpdate", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idPolitica", data.idPolitica);
                cmd.Parameters.AddWithValue("descripcion", data.descripcion);
                cmd.Parameters.AddWithValue("codigo", data.codigo);
                cmd.Parameters.AddWithValue("estado", data.estado);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
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
                _gr.titleSms = "Actualizar Politica";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idPolitica)
        {
            try
            {
                SqlCommand cmd = new SqlCommand("ASPPoliticaDelete", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idPolitica", idPolitica);
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
                con.Close();
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.typeNotify = "warning";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Eliminar Politica";
            }
            return _gr;
        }

        //Operaciones Espauiales 
        public async Task<GenericResponse> GetAllAsync(int idRol)
        {
            var list = new List<Politica>();
            try
            {
                var cmd = new SqlCommand("ASPPoliticaGetAll", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _gr.id = reader.GetString(0);
                    _gr.message = reader.GetString(1);

                    if (_gr.id == "1")
                    {
                        var p = new Politica
                        {
                            idPolitica = reader.GetInt32(2),
                            descripcion = reader.GetString(3),
                            codigo = reader.GetString(4),
                        };
                        list.Add(p);
                    }
                }
                _gr.data = list;
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
            return _gr;
        }
    }
}
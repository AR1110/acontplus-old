using Helpers;
using Domain.Models;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace DataAccess.Aplicacion
{
    public class EntidadDao : ConnectionDb
    {
        protected GenericResponse _response;
        public EntidadDao()
        {
            _response = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsync(string json)
        {
            DataTable dt = new DataTable ();
            try
            {
                SqlCommand cmd = new SqlCommand("App.aspEntidad_Get", con);
                cmd.Parameters.AddWithValue("json", json);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataAdapter dataAdapter = new SqlDataAdapter (cmd);
                dataAdapter.Fill(dt);
                if (dt.Rows.Count > 0)
                {
                    _response.id = "1";
                    _response.data = DataHelper.DataTableToJSON(dt);
                }

            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Entidad Listar";
            }
            finally
            {
                con.Close();
            }
            return _response;

        }
        public async Task<GenericResponse> GetIdAsync(int id)
        {
            DataTable dt = new DataTable ();
            try
            {
                SqlCommand cmd = new SqlCommand("App.aspEntidad_GetId", con);
                cmd.Parameters.AddWithValue("id", id);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataAdapter dataAdapter = new SqlDataAdapter (cmd);
                dataAdapter.Fill(dt);
                if (dt.Rows.Count > 0)
                {
                    _response.id = "1";
                    _response.data = DataHelper.DataTableToJSON(dt);
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Entidad GetId";
            }
            finally
            {
                con.Close();
            }
            return _response;
        }
        public async Task<GenericResponse> InsertAsync(Entidad data)
        {
            try
            {
                var cmd = new SqlCommand("App.aspEntidad_Insert", con);
                cmd.Parameters.AddWithValue("ruc", data.ruc);
                cmd.Parameters.AddWithValue("razonSocial", data.razonSocial);
                cmd.Parameters.AddWithValue("nombreComercial", data.nombreComercial);
                cmd.Parameters.AddWithValue("email", DataHelper.ToDBNullOrDefault(data.email));
                cmd.Parameters.AddWithValue("telefono", DataHelper.ToDBNullOrDefault(data.telefono));
                cmd.Parameters.AddWithValue("direccion", DataHelper.ToDBNullOrDefault(data.direccion));
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _response.id = reader.GetString(0);
                    _response.message = reader.GetString(1);
                    _response.titleSms = reader.GetString(2);
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Registrar Entidad";
            }
            finally
            {
                con.Close();
            }
            return _response;
        }
        public async Task<GenericResponse> UpdateAsync(int id, Entidad data)
        {
            try
            {
                var cmd = new SqlCommand("App.aspEntidad_Update", con);
                cmd.Parameters.AddWithValue("id", id);
                cmd.Parameters.AddWithValue("ruc", data.ruc);
                cmd.Parameters.AddWithValue("idCiudad", data.idCiudad);
                cmd.Parameters.AddWithValue("razonSocial", data.razonSocial);
                cmd.Parameters.AddWithValue("nombreComercial", data.nombreComercial);
                cmd.Parameters.AddWithValue("email", DataHelper.ToDBNullOrDefault(data.email));
                cmd.Parameters.AddWithValue("telefono", DataHelper.ToDBNullOrDefault(data.telefono));
                cmd.Parameters.AddWithValue("direccion", DataHelper.ToDBNullOrDefault(data.direccion));
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _response.id = reader.GetString(0);
                    _response.message = reader.GetString(1);
                    _response.titleSms = reader.GetString(2);
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Actualizar Entidad";
            }
            finally
            {
                con.Close();
            }
            return _response;


        }
        public async Task<GenericResponse> DeleteAsync(int id)
        {
            try
            {
                var cmd = new SqlCommand("App.aspEntidad_Delete", con);
                cmd.Parameters.AddWithValue("id", id);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _response.id = reader.GetString(0);
                    _response.message = reader.GetString(1);
                    _response.titleSms = reader.GetString(2);
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Eliminar Entidad";
            }
            finally
            {
                con.Close();
            }
            return _response;
        }

    }
}

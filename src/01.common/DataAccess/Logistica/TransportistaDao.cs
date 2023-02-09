using Helpers;
using Domain.Models;
using Domain.Models.Logistica;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Logistica
{
    public class TransportistaDao : ConnectionDb
    {
        private GenericResponse _response;

        public TransportistaDao()
        {
            _response = new GenericResponse();
        }

        public async Task<GenericResponse> GetAsync(int idRol, string json)
        {
            DataTable dt = new DataTable ();
            try
            {
                var cmd = new SqlCommand("Logistica.Transportista_Get", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
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
                _response.titleSms = "Listar Transportista";
            }
            finally
            {
                con.Close();
            }
            return _response;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, Transportista data)
        {
            try
            {
                var cmd = new SqlCommand("Logistica.Transportista_Insert", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idTipoIdentificacion", data.idTipoIdentificacion);
                cmd.Parameters.AddWithValue("nroIdentificacion", data.nroIdentificacion);
                cmd.Parameters.AddWithValue("nombre", data.nombre);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _response.id = reader.GetString(0);
                    _response.message = reader.GetString(1);
                    _response.titleSms = reader.GetString(2);
                    _response.lastId = reader.GetInt32(3);
                }
            }
            catch (Exception ex)
            {
                _response.id = "0";
                _response.message = ex.Message.ToString();
                _response.titleSms = "Registrar Transportista";
            }
            finally
            {
                con.Close();
            }
            return _response;
        }
        public async Task<GenericResponse> PutAsycn(int idRol, int idTransportista, Transportista data)
        {
            try
            {
                var cmd = new SqlCommand("Logistica.Transportista_Update", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idTransportista", idTransportista);
                cmd.Parameters.AddWithValue("nroIdentificacion", data.nroIdentificacion);
                cmd.Parameters.AddWithValue("nombre", data.nombre);
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
                _response.titleSms = "Actualizar Transportista";
            }
            finally
            {
                con.Close();
            }
            return _response;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idTransportista)
        {
            try
            {
                var cmd = new SqlCommand("Logistica.Transportista_Delete", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idTransportista", idTransportista);
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
                _response.titleSms = "Eliminar Transportista";
            }
            finally
            {
                con.Close();
            }
            return _response;
        }
    }
}

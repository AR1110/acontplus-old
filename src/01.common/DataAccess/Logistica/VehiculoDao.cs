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
    public class VehiculoDao : ConnectionDb
    {
        private GenericResponse _gr;

        public VehiculoDao()
        {
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> InsertAsync(int idRol, Vehiculo data)
        {
            try
            {
                var cmd = new SqlCommand("ASPVehiculoInsert", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("placa", data.placa);
                cmd.Parameters.AddWithValue("marca", data.marca);
                cmd.Parameters.AddWithValue("modelo", data.modelo);
                cmd.Parameters.AddWithValue("observacion", DataHelper.ToDBNullOrDefault(data.observacion));
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _gr.id = reader.GetString(0);
                    _gr.message = reader.GetString(1);
                    _gr.titleSms = reader.GetString(2);
                    _gr.lastId = reader.GetInt32(3);
                }
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Registrar Vehiculo";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
        public async Task<GenericResponse> GetAsync(int idRol)
        {
            var vehiculos = new List<Vehiculo>();
            try
            {
                var cmd = new SqlCommand("ASPVehiculoGet", con);
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
                        var item = new Vehiculo()
                        {
                            idVehiculo = reader.GetInt32(3),
                            placa = reader.GetString(4),
                            marca = reader.GetString(5),
                            modelo = reader.GetString(6),
                            observacion = reader.GetString(7),
                        };
                        vehiculos.Add(item);
                    }
                }
                _gr.data = vehiculos;

            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Vehiculo";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
        public async Task<GenericResponse> PutAsycn(int idRol, int idVehiculo, Vehiculo data)
        {
            try
            {
                var cmd = new SqlCommand("ASPVehiculoUpdate", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idVehiculo", idVehiculo);
                cmd.Parameters.AddWithValue("placa", data.placa);
                cmd.Parameters.AddWithValue("marca", data.marca);
                cmd.Parameters.AddWithValue("modelo", data.modelo);
                cmd.Parameters.AddWithValue("observacion", DataHelper.ToDBNullOrDefault(data.observacion));
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
                _gr.titleSms = "Actualizar Vehiculo";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
        public async Task<GenericResponse> DeleteAsync(int idRol, int idVehiculo)
        {
            try
            {
                var cmd = new SqlCommand("ASPVehiculoDelete", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idVehiculo", idVehiculo);
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
                _gr.titleSms = "Eliminar Vehiculo";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }

        public async Task<GenericResponse> SearchAsync(int idRol, string busqueda)
        {
            var search = new List<Vehiculo>();
            try
            {
                var cmd = new SqlCommand("ASPVehiculoSearch", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("busqueda", busqueda);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _gr.id = reader.GetString(0);
                    _gr.message = reader.GetString(1);
                    if (_gr.id == "1")
                    {
                        var item = new Vehiculo()
                        {
                            idVehiculo = reader.GetInt32(2),
                            placa = reader.GetString(3),
                        };
                        search.Add(item);
                    }
                }
                _gr.data = search;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Buscador Vehiculo";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
    }
}

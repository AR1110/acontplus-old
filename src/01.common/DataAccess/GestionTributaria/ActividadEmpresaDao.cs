using Domain.Dtos;
using Domain.Models;
using Helpers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace DataAccess
{
    public class ActividadEmpresaDao : ConnectionDb
    {
        private GenericResponse _gr;
        public ActividadEmpresaDao()
        {
            _gr= new GenericResponse();
        }
        public GenericResponse GetAllAsync(int idRol)
        {
            var listar = new List<ActividadEmpresa>();
            try
            {
                var cmd = new SqlCommand("ASPActividadEmpresaGetAll", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.CommandType = CommandType.StoredProcedure;
                con.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _gr.id = reader.GetString(0);
                    if (_gr.id == "1")
                    {
                        var a = new ActividadEmpresa
                        {
                            idActividadEmpresa = reader.GetInt32(1),
                            descripcion = reader.GetString(2),
                            estado = reader.GetBoolean(3),
                        };
                        listar.Add(a);
                    }
                }
                _gr.data = listar;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Actividades ";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
        public GenericResponse GetBySucursalAsync(int idRol)
        {
            var listar = new List<ActividadEmpresa>();
            try
            {
                var cmd = new SqlCommand("ASPActividadEmpresaBySucursal", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.CommandType = CommandType.StoredProcedure;
                con.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _gr.id = reader.GetString(0);
                    if (_gr.id == "1")
                    {
                        var a = new ActividadEmpresa
                        {
                            idActividadEmpresa = reader.GetInt32(1),
                            descripcion = reader.GetString(2),
                            estado = reader.GetBoolean(3),
                        };
                        listar.Add(a);
                    }
                }
                _gr.data = listar;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Actividades de la Sucursal ";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }

    }
}
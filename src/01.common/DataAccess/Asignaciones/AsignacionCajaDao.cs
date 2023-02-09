using Domain.Models;
using Domain.ViewModels;
using Helpers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace DataAccess.Asignaciones
{
    public class AsignacionCajaDao : ConnectionDb
    {
        protected GenericResponse _gr;

        public AsignacionCajaDao()
        {
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> GetByCajaAsycn(int idRol, int idCaja)
        {
            var listar = new List<AsignacionCajaViewModel>();
            try
            {
                var cmd = new SqlCommand("aspAsignacionCajaByCaja", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idCaja", idCaja);
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
                        var item = new AsignacionCajaViewModel
                        {
                            asignacionCaja = new AsignacionCaja()
                            {
                                idAsignacionCaja = reader.GetInt32(3),
                                idCaja = reader.GetInt32(4),
                                idUsuario = reader.GetInt32(5),
                                idTurno = reader.GetInt32(6),
                            },
                            usuario = reader.GetString(7)
                        };
                        listar.Add(item);
                    }
                }
                _gr.data = listar;
            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Asignacion Caja";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
        public async Task<GenericResponse> InsertAsync(int idRol, AsignacionCaja data)
        {
            try
            {
                var cmd = new SqlCommand("aspAsignacionCajaInsert", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idCaja", data.idCaja);
                cmd.Parameters.AddWithValue("idTurno", data.idTurno);
                cmd.Parameters.AddWithValue("idUsuario", data.idUsuario);
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
                _gr.titleSms = "Registrar Asignacion de Caja";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
        public async Task<GenericResponse> PutAsyc(int idRol, AsignacionCaja data)
        {
            try
            {
                var cmd = new SqlCommand("aspAsignacionCajaUpdate", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idAsignacionCaja", data.idAsignacionCaja);
                cmd.Parameters.AddWithValue("idTurno", data.idTurno);
                cmd.Parameters.AddWithValue("idUsuario", data.idUsuario);
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
                _gr.titleSms = "Actualizar Asignacion de Caja";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }

    }
}

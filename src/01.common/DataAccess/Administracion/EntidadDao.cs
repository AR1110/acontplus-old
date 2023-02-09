using Domain.Models;
using Domain.ViewModels.Administracion;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Helpers;


namespace DataAccess
{
    public class EntidadDao : ConnectionDb
    {
        protected GenericResponse _gr;

        public EntidadDao()
        {
            _gr = new GenericResponse();
        }

        public async Task<GenericResponse> OptionAsync(int idRol)
        {
            var listar = new List<Entidad>();
            try
            {
                var cmd = new SqlCommand("aspEntidadOption", con);
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
                        var item = new Entidad
                        {
                            idEntidad = reader.GetInt32(2),
                            razonSocial = reader.GetString(3),
                            ruc = reader.GetString(4),
                            nombreComercial = reader.GetString(5),
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
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
        public async Task<GenericResponse> GetByAccessAsync(int idRol, int idUsuario)
        {
            var listar = new List<EntidadViewModel>();
            try
            {
                SqlCommand cmd = new SqlCommand("aspEntidadByAccess", con);
                cmd.Parameters.AddWithValue("idRol", idRol);
                cmd.Parameters.AddWithValue("idUsuario", idUsuario);
                cmd.CommandType = CommandType.StoredProcedure;
                await con.OpenAsync();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    _gr.id = reader.GetString(0);
                    if (_gr.id == "1")
                    {
                        var e = new EntidadViewModel
                        {
                            entidad = new Entidad()
                            {
                                idEntidad = reader.GetInt32(1),
                                razonSocial = reader.GetString(2),
                                ruc = reader.GetString(3),
                                estado = reader.GetBoolean(4),
                            },
                            idUsuario = reader.GetInt32(5),
                            idPolitica = reader.GetInt32(6),
                        };
                        listar.Add(e);
                    }
                }
                _gr.data = listar;

            }
            catch (Exception ex)
            {
                _gr.id = "0";
                _gr.message = ex.Message.ToString();
                _gr.titleSms = "Listar Entidades por Acceso de Usuario";
            }
            finally
            {
                con.Close();
            }
            return _gr;
        }
    }
}
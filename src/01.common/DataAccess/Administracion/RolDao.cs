//using Domain.Models;
//using Domain.Models.Administracion;
//using Domain.ViewModels.Administracion;
//using Newtonsoft.Json;
//using System;
//using System.Collections.Generic;
//using System.Data;
//using System.Data.SqlClient;
//using System.Threading.Tasks;

//namespace DataAccess.Administracion
//{
//    public class RolDao : ConnectionDb
//    {
//        private GenericResponse _gr;
//        public RolDao()
//        {
//            _gr = new GenericResponse();
//        }

//        public async Task<GenericResponse> InsertAsync(int idRolSession, int idUsuario, List<Rol> data)
//        {
//            try
//            {
//                var cmd = new SqlCommand("ASPRolInsert", con);
//                cmd.Parameters.AddWithValue("idRolSession", idRolSession);
//                cmd.Parameters.AddWithValue("idUsuario", idUsuario);
//                var roles = JsonConvert.SerializeObject(data); cmd.Parameters.Add(new SqlParameter("jsonRol", roles));
//                cmd.CommandType = CommandType.StoredProcedure;
//                await con.OpenAsync();

//                SqlDataReader reader = await cmd.ExecuteReaderAsync();

//                while (await reader.ReadAsync())
//                {
//                    _gr.id = reader.GetString(0);
//                    _gr.message = reader.GetString(1);
//                    _gr.titleSms = reader.GetString(2);
//                }
//            }
//            catch (Exception ex)
//            {
//                _gr.id = "0";
//                _gr.message = ex.Message.ToString();
//                _gr.titleSms = "Registrar Perfil de Usuario";
//            }
//            finally
//            {
//                con.Close();
//            }
//            return _gr;
//        }
//        public async Task<GenericResponse> GetAsync(int idRol, int idUsuario)
//        {
//            var roles = new List<RolViewModel>();
//            try
//            {
//                var cmd = new SqlCommand("ASPRolGet", con);
//                cmd.Parameters.AddWithValue("idRol", idRol);
//                cmd.Parameters.AddWithValue("idUsuario", idUsuario);
//                cmd.CommandType = CommandType.StoredProcedure;
//                await con.OpenAsync();
//                SqlDataReader reader = cmd.ExecuteReader();
//                while (reader.Read())
//                {
//                    _gr.id = reader.GetString(0);
//                    _gr.message = reader.GetString(1);
//                    _gr.titleSms = reader.GetString(2);
//                    if (_gr.id == "1")
//                    {
//                        var item = new RolViewModel()
//                        {
//                            rol = new Rol
//                            {
//                                idEntidad = reader.GetInt32(3),
//                                idPolitica = reader.GetInt32(4),
//                                idUsuario = reader.GetInt32(5),
//                            },
//                            entidad = reader.GetString(6),
//                            politica = reader.GetString(7)

//                        };
//                        roles.Add(item);
//                    }
//                }
//                _gr.data = roles;
//            }
//            catch (Exception ex)
//            {
//                _gr.id = "0";
//                _gr.message = ex.Message.ToString();
//                _gr.titleSms = "Get Roles";
//            }
//            finally
//            {
//                con.Close();
//            }
//            return _gr;
//        }
//    }
//}

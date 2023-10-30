using System.Data;
using Common.Core.Models;
using Domain.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DataAccess
{
    public class PersonaDao
    {
        private readonly IConfiguration _config;
        protected GenericResponse _gr;
        private readonly string _connectionStrings = string.Empty;

        public PersonaDao(IConfiguration config)
        {
            _config = config;
            _connectionStrings = _config.GetConnectionString("DefaultConnection");
            _gr = new GenericResponse();

        }

        public async Task<GenericResponse> ReadPersonaAsync(int pageIndex, int pageSize, int idRol, HelpersResponse data)
        {
            var listar = new List<PersonaOperaciones>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPPersonaRead", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("pageIndex", pageIndex);
                    cmd.Parameters.AddWithValue("pageSize", pageSize);
                    cmd.Parameters.AddWithValue("tipoValidacion", data.tipoValidacion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.typeNotify = reader.GetString(1);
                        _gr.message = reader.GetString(2);
                        _gr.titleSms = reader.GetString(3);
                        if (_gr.id == "1")
                        {


                            var _po = new PersonaOperaciones()
                            {
                                persona = new Persona()
                                {
                                    idPersona = reader.GetInt32(4),
                                    numeroIdentificacion = reader.GetString(5),
                                    nombreFiscal = reader.GetString(6),
                                    nombreComercial = reader.GetString(7),
                                    direccion = reader.GetString(8),
                                    telefono = reader.GetString(9),
                                    correo = reader.GetString(10),
                                    estado = reader.GetBoolean(11),
                                    totalRecords = reader.GetInt32(32)
                                },
                                tipoIdentificacionTransaccion = new TipoIdentificacionTransaccion()
                                {
                                    idTipoIdentificacionTransaccion = reader.GetInt32(12),
                                    identificacion = reader.GetString(13),
                                    codigoIdentificacion = reader.GetString(14)
                                },
                                ciudad = new Ciudad()
                                {
                                    idCiudad = reader.GetInt32(15),
                                    descripcion = reader.GetString(16)
                                },
                                configuracionPersona = new ConfiguracionPersona()
                                {
                                    idConfiguracionPersona = reader.GetInt32(17),
                                    montoCredito = reader.GetDecimal(18)
                                },
                                tipoPersona = new TipoPersona()
                                {
                                    idTipoPersona = reader.GetInt32(19),
                                    descripcion = reader.GetString(20)
                                },
                                tipoClienteProveedor = new TipoClienteProveedor()
                                {
                                    idTipoClienteProveedor = reader.GetInt32(21),
                                    descripcion = reader.GetString(22)
                                },
                                tipoEntidad = new TipoEntidad()
                                {
                                    idTipoEntidad = reader.GetInt32(23),
                                    descripcion = reader.GetString(24)
                                },
                                subContribuyente = new SubContribuyente()
                                {
                                    idSubContribuyente = reader.GetInt32(25),
                                    descripcion = reader.GetString(26)
                                },
                                tiempoCredito = new TiempoCredito()
                                {
                                    idTiempoCredito = reader.GetInt32(27),
                                    descripcion = reader.GetString(28),
                                    //diasCredito = reader.GetInt32(29)
                                },


                            };
                            _po.ciudad.provincia = new Provincia()
                            {
                                idProvincia = reader.GetInt32(30),
                                descripcion = reader.GetString(31)
                            };
                            listar.Add(_po);
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
                _gr.titleSms = "Listar Persona";
            }
            return _gr;

        }

        public async Task<GenericResponse> SearchPersonaAsync(int idRol, HelpersResponse data)
        {
            var listar = new List<PersonaOperaciones>();
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionStrings))
                {
                    SqlCommand cmd = new SqlCommand("ASPPersonaSearch", con);
                    cmd.Parameters.AddWithValue("idRol", idRol);
                    cmd.Parameters.AddWithValue("numeroIdentificacion", data.numeroIdentificacion);
                    cmd.Parameters.AddWithValue("tipoValidacion", data.tipoValidacion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    await con.OpenAsync();
                    SqlDataReader reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        _gr.id = reader.GetString(0);
                        _gr.typeNotify = reader.GetString(1);
                        _gr.message = reader.GetString(2);
                        _gr.titleSms = reader.GetString(3);
                        if (_gr.id == "1")
                        {
                            var _po = new PersonaOperaciones()
                            {
                                persona = new Persona()
                                {
                                    idPersona = reader.GetInt32(4),
                                    numeroIdentificacion = reader.GetString(5),
                                    nombreFiscal = reader.GetString(6),
                                    nombreComercial = reader.GetString(7),
                                    correo = reader.GetString(8),
                                    direccion = reader.GetString(9),
                                    telefono = reader.GetString(10),
                                },
                                ciudad = new Ciudad()
                                {
                                    idCiudad = reader.GetInt32(11),
                                    descripcion = reader.GetString(12)
                                },
                                subContribuyente = new SubContribuyente()
                                {
                                    idSubContribuyente = reader.GetInt32(13),
                                    descripcion = reader.GetString(14)
                                }
                            };
                            listar.Add(_po);
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
                _gr.titleSms = "Buscar Persona";
            }
            return _gr;
        }
    }
}

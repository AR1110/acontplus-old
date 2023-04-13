using DataAccess;
using System.Data;

namespace WS_Cliente_Ident_Val_Sri
{
    public sealed class IdentificacionValidacionService
    {
        private readonly IConfiguration _config;
        public IdentificacionValidacionService(IConfiguration config) => (_config) = (config);
        public async Task<DataTable> Get(int cantDocs)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            var tipo = Convert.ToInt32(_config.GetSection("tipo").Value);
            string query;
            if (tipo == 1)
            {
                query = @"SELECT TOP(@top) idCliente,numeroIdentificacion,nombreFiscal AS razonSocial, ti.codigoSri FROM Cliente c with(NOLOCK) 
INNER JOIN TipoIdentificacion ti WITH(NOLOCK) ON c.idTipoIdentificacion = ti.idTipoIdentificacion

WHERE validationSri = 0 AND NOT EXISTS (SELECT * FROM ClienteError cr where c.idCliente = cr.idcliente) AND codigoSri IN ('04', '05')";
            }
            else
            {
                query = @"SELECT TOP(@top) idProveedor, LTRIM(RTRIM(numeroIdentificacion)) as numeroIdentificacion,nombreFiscal AS razonSocial, ti.codigoSri FROM Proveedor p with(NOLOCK)
INNER JOIN TipoIdentificacion ti WITH(NOLOCK) ON p.idTipoIdentificacion = ti.idTipoIdentificacion
                        WHERE validationSri = 0 AND NOT EXISTS (SELECT * FROM ProveedorError pr WHERE p.idProveedor = pr.idProveedor) AND codigoSri IN ('04', '05')";
            }

            await _dbAccess.QueryExecute(query);
            _dbAccess.AddDynamicParam("@top", cantDocs);
            return _dbAccess.GetDataTable();
        }
        public async Task Insert(int idCliente, string numeroIdentificacion, string razonSocial)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            var tipo = Convert.ToInt32(_config.GetSection("tipo").Value);
            string query;

            if (tipo == 1)
            {
                query = @"INSERT INTO ClienteError(idCliente, numeroIdentificacion, razonSocial) VALUES (@idCliente, @numeroIdentificacion, @razonSocial)";

            }
            else
            {
                query = @"INSERT INTO ProveedorError(idProveedor, numeroIdentificacion, razonSocial) VALUES (@idCliente, @numeroIdentificacion, @razonSocial)";

            }
            await _dbAccess.QueryExecute(query);
            _dbAccess.AddDynamicParam("@idCliente", idCliente);
            _dbAccess.AddDynamicParam("@numeroIdentificacion", numeroIdentificacion);
            _dbAccess.AddDynamicParam("@razonSocial", razonSocial);
            _dbAccess.OnlyExecute();
        }
        public async Task Update(int idCliente, string razonSocial, string nombreComercial)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            var tipo = Convert.ToInt32(_config.GetSection("tipo").Value);
            string query;

            if (tipo == 1)
            {
                query = @"UPDATE Cliente SET nombreComercial = @nombreComercial, nombreFiscal = @razonSocial, validationSri = 1 WHERE idCliente = @idCliente";

            }
            else
            {
                query = @"UPDATE Proveedor SET nombreComercial = @nombreComercial, nombreFiscal = @razonSocial, validationSri = 1 WHERE idProveedor = @idCliente";

            }
            await _dbAccess.QueryExecute(query);
            _dbAccess.AddDynamicParam("@idCliente", idCliente);
            _dbAccess.AddDynamicParam("@razonSocial", razonSocial);
            _dbAccess.AddDynamicParam("@nombreComercial", nombreComercial ?? razonSocial);
            _dbAccess.OnlyExecute();
        }
    }
}

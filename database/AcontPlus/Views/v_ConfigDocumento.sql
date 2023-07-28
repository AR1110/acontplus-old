use Acontplus
GO
IF OBJECT_ID(N'v_ConfigDocumento', N'V') IS NOT NULL
DROP VIEW v_ConfigDocumento
GO
CREATE VIEW v_ConfigDocumento
AS
    (
    SELECT cd.*
        , td.descripcion documento
        , e.codEstab
        , e.ruc
        , e.estab
        , pe.ptoEmi
        , td.codigo codDocumento
        , tt.descripcion transaccion
    FROM ConfiguracionDocumento cd WITH (NOLOCK)
        INNER JOIN TipoDocumento td WITH (NOLOCK) ON cd.idTipoDocumento = td.idTipoDocumento
        INNER JOIN PuntoEmision pe WITH (NOLOCK) ON cd.idPuntoEmision = pe.idPuntoEmision
        INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON pe.codEstab = e.codEstab
        LEFT JOIN TipoTransaccion tt WITH(NOLOCK) ON td.idTipoTransaccion = tt.idTipoTransaccion
)
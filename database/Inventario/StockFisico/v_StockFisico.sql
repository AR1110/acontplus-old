CREATE VIEW  v_StockFisico
AS
    (
    SELECT sf.*
            , e.estab
            , pe.ptoEmi
            , en.idEntidad
            , en.razonSocial empresa
    FROM Inventario.StockFisico sf WITH (NOLOCK)
        INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON sf.CodEstab = e.codEstab
        INNER JOIN PuntoEmision pe WITH (NOLOCK) ON sf.PuntoEmisionId = pe.idPuntoEmision
        INNER JOIN Entidad en WITH (NOLOCK) ON e.ruc = en.ruc
)

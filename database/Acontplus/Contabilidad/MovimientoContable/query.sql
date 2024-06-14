use [Acontplus]
go



SELECT * FROM 
(
    SELECT IIF(codDoc = '01','Factura','Nota Entrega') as descripcion
          ,SUM(cc.importeTotal)						   as ingreso
          ,0										   as egreso
          ,SUM(cc.abono)						       as abono
          ,SUM(cc.saldo)						       as saldo
    FROM v_CuentaPorCobrar cc WITH (NOLOCK)
    WHERE cc.idEntidad = 7
      AND cc.codEstado NOT IN ('A')
      AND cc.convertToDoc = 0
      and MONTH(cc.fechaEmision) = 3
    GROUP BY codDoc

    union all 

    SELECT 'Ingresos'     as descripcion
          ,SUM(ci.abono)  as ingreso
          ,0              as egreso
          ,0              as abono
          ,0              as saldo
    FROM ComprobanteIngreso ci WITH (NOLOCK) 
    WHERE ci.idComprobanteIngreso IN (
                                          SELECT hc.idComprobanteIngreso
                                          FROM Contabilidad.Historial_Cobro hc WITH (NOLOCK)
                                          INNER JOIN dbo.Cobro              co WITH (NOLOCK) ON co.idCobro              = hc.idCobro
                                          INNER JOIN v_CuentaPorCobrar      cc WITH (NOLOCK) ON cc.idCuentaPorCobrar    = hc.idCuentaPorCobrar
                                          INNER JOIN dbo.ComprobanteIngreso ci WITH (NOLOCK) ON ci.idComprobanteIngreso = hc.idComprobanteIngreso
                                          WHERE cc.idEntidad = 7
                                            AND cc.codEstado NOT IN ('A')
                                            AND cc.convertToDoc = 0
                                            AND MONTH(cc.fechaEmision) = 3
                                            AND co.cobro = 1
                                         )

    UNION ALL

    SELECT ISNULL(subcategoryName,'COMPRA')            as descripcion
          ,0									       as ingreso
	      ,SUM(cp.importeTotal)						   as egreso
          ,SUM(cp.abono)						       as abono
          ,SUM(cp.saldo)                               as saldo
    FROM v_CuentaPorPagar cp WITH (NOLOCK)
    WHERE cp.idEntidad = 7
      AND cp.codEstado NOT IN ('A')
      and MONTH(cp.fechaEmision) = 3
    GROUP BY subcategoryName

    UNION ALL

     SELECT 'Egresos'     as descripcion
          ,0              as ingreso
          ,SUM(ce.total)  as egreso
          ,0              as abono
          ,0              as saldo
    FROM ComprobanteEgreso ce WITH (NOLOCK) 
    WHERE ce.idComprobanteEgreso IN (
                                        SELECT hp.idComprobanteEgreso
                                        FROM Contabilidad.Historial_Pago  hp WITH (NOLOCK)
                                        INNER JOIN dbo.Pago               pa WITH (NOLOCK) ON pa.idPago               = hc.idCobro
                                        INNER JOIN v_CuentaPorCobrar      cc WITH (NOLOCK) ON cc.idCuentaPorCobrar    = hc.idCuentaPorCobrar
                                        INNER JOIN dbo.ComprobanteIngreso ci WITH (NOLOCK) ON ci.idComprobanteIngreso = hc.idComprobanteIngreso
                                        WHERE cc.idEntidad = 7
                                          AND cc.codEstado NOT IN ('A')
                                          AND cc.convertToDoc = 0
                                          AND MONTH(cc.fechaEmision) = 3
                                          AND co.cobro = 1
                                    )

    
) as dt


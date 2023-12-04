USE AcontPlus
GO
CREATE OR ALTER PROCEDURE FactElect.Doc_Elect_Report @idUsuarioRol INT,@json NVARCHAR(max)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
    
    --> Global 
    DECLARE @tipo INT ,@idEntidad INT

    --> Sql
    DECLARE @sql NVARCHAR(MAX) ,@params NVARCHAR(MAX)

    -->Filter
    DECLARE @codEstab VARCHAR(100) ,@idPuntoEmision INT ,@ckFecha BIT ,@fechaInicio DATETIME2 ,@fechaFin DATETIME2 ,@codEstado INT ,@ckDevolucion BIT ,@ckRetencion BIT
           ,@identificacion VARCHAR(20) ,@idUsuario INT
    --> Recuperar Datos
    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT )

    SELECT TOP 1 @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

    --> Factura 
    IF @tipo = 2
        BEGIN
            
            SELECT @codEstab       = codEstab
                  ,@idPuntoEmision = idPuntoEmision
                  ,@ckFecha        = ckFecha
                  ,@fechaInicio    = fechaInicio
                  ,@fechaFin       = fechaFin
                  ,@codEstado      = codEstado
                  ,@ckDevolucion   = ckDevolucion
                  ,@ckRetencion    = ckRetencion
                  ,@codEstado      = codEstado 
                  ,@identificacion = identificacion
                  ,@idUsuario      = idUsuario
            FROM OPENJSON(@json) WITH 
            (
                codEstab       VARCHAR(100)
               ,idPuntoEmision INT
               ,ckfecha        BIT
               ,fechaInicio    DATETIME2
               ,fechaFin       DATETIME2
               ,codEstado      INT
               ,ckDevolucion   BIT
               ,ckRetencion    BIT
               ,identificacion VARCHAR(20)
               ,idUsuario      INT
            )

            SET @params = '@idEntidad       INT
                          ,@codEstab        VARCHAR(100)
                          ,@idPuntoEmision  INT
                          ,@fechaInicio     DATETIME2
                          ,@fechaFin        DATETIME2
                          ,@codEstado       INT
                          ,@identificacion  VARCHAR(20)
                          ,@idUsuario       INT'

            SET @sql = 'SELECT * FROM ( 
                                        SELECT idFactura 
                                              ,idEstablecimiento
                                              ,idPuntoEmision
                                              ,codEstab
                                              ,nombreComercial
                                              ,estab + ''-'' + ptoEmi + ''-'' + RIGHT(''000000000'' + CONVERT(VARCHAR(9), secuencial), 9) serieComprobante
                                              ,claveAcceso
	                                          ,Format(fechaEmision,''dd/MM/yyyy'') as fechaEmision
	                                          ,f.razonSocialComprador
	                                          ,f.identificacionComprador
	                                          ,CAST(f.subTotalNetoExentoIva as numeric(18,2))  as subTotalExento
							                  ,CAST(f.subTotalNetoNoObjetoIva as numeric(18,2))as subTotalNoObjetoIva
	                                          ,CAST(f.subTotalNetoIvaCero as numeric(18,2))    as subTotalIvaCero
	                                          ,CAST(f.subTotalNetoIva as numeric(18,2))        as subTotalIva
	                                          ,CAST(f.subTotalSinImpuestos  as numeric(18,2))  as precioTotalSinImpuestos
	                                          ,CAST(f.iva as numeric(18,2))                    as iva
	                                          ,CAST(f.totalDescuento as numeric(18,2))         as descuento
	                                          ,CAST(f.total as numeric(18,2))                  as total

	                                          ,(SELECT TOP 1 dd.serieComprobante 
							                    FROM FactElect.DocRelacionado          dr WITH (NOLOCK)
							                    INNER JOIN Recepcion.DocumentoRecibido dd WITH (NOLOCK) ON dd.idDocumento = dr.idDocumentoRecibido
							                    WHERE dr.claveAcceso = f.claveAcceso 
							                   ) as nroRetencion

	                                          ,(SELECT SUM(dr.valorRetenido) FROM FactElect.DocRelacionado dr WITH (NOLOCK) WHERE dr.claveAcceso = f.claveAcceso) as totalRet

                                              ,(
                                                SELECT TOP 1 nc.estab + ''-'' + nc.ptoEmi + ''-'' + RIGHT(''000000000'' + CONVERT(VARCHAR(9), nc.secuencial), 9) 
                                                FROM Ventas.v_NotaCredito nc WITH (NOLOCK) 
                                                WHERE nc.idFactura = f.idFactura
                                                  AND nc.estado = 1
                                               ) as nroDevolucion

                                              ,(
                                                SELECT TOP 1 CAST(nc.total as numeric(18,2)) 
                                                FROM Ventas.v_NotaCredito nc WITH (NOLOCK) 
                                                WHERE nc.idFactura = f.idFactura
                                                  AND nc.estado = 1
                                               ) as devolucion

                                              ,f.nombreUsuario as usuario
                                              ,f.idUsuario
							                  ,f.codEstado 
                                              ,CASE WHEN codEstado = 4 THEN ''Autorizada''
                                                    WHEN codEstado = 6 THEN ''Anulada''
                                                                       ELSE ''No Autorizada'' 
                                               END as estado

                                        FROM Ventas.v_Factura f WITH (NOLOCK)
                                        WHERE f.idEntidad = @idEntidad

                                      )as dt WHERE dt.idFactura > 0 '

            IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND dt.codEstab = @codEstab '
                END 

            IF @idPuntoEmision > 0 
                BEGIN
                    SET @sql = @sql + 'AND dt.idPuntoEmision = @idPuntoEmision '
                END
                
            IF @ckFecha = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(dt.fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
                END 

            IF @codEstado >= 0
                BEGIN
                    IF @codEstado IN (4,6)
                        BEGIN
                            SET @sql = @sql + 'AND dt.codEstado = @codEstado '
                        END 
                    ELSE 
                        BEGIN
                            SET @sql = @sql + 'AND dt.codEstado != 4'
                        END 
                END 

            IF @identificacion IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND dt.identificacionComprador = @identificacion '
                END 

            IF @idUsuario IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND dt.idUsuario = @idUsuario '
                END 

            IF @ckDevolucion = 1
                BEGIN
                    SET @sql = @sql + 'AND dt.nroDevolucion IS NOT NULL '
                END 

            IF @ckRetencion = 1
                BEGIN
                    SET @sql = @sql + 'AND dt.nroRetencion IS NOT NULL '
                END 

            SET @sql = @sql + 'ORDER BY dt.idFactura DESC '

            SELECT entidad as razonSocial 
                  ,rucEmpresa as ruc
                  ,telefono 
                  ,nombreUsuario as usuario
                  ,'Reporte Tributario - Factura' as nombreReporte
            FROM v_usuario
            WHERE idUsuarioRol = @idUsuarioRol

            EXEC sp_executesql @sql
							  ,@params 
							  ,@idEntidad      = @idEntidad
                              ,@codEstab       = @codEstab
                              ,@idPuntoEmision = @idPuntoEmision
                              ,@fechaInicio    = @fechaInicio
                              ,@fechaFin       = @fechaFin
                              ,@codEstado      = @codEstado
                              ,@identificacion = @identificacion
                              ,@idUsuario      = @idUsuario
            RETURN 
        END 

    SELECT '0'code,'No se encontraron datos con los parametros solicitados' as 'message'
    RETURN 
END 

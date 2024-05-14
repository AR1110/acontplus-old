USE Acontplus
GO
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.

-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		IGNACIO MANCHU
-- Create date: 2024/05/15
-- Description:	REPORT FOR COBROS
-- =============================================
-- Contabilidad.ComprobanteIngreso_Report 307,'{"tipo":2,"format":"pdf","codEstab":"ESTAB-000000216","codDoc":"NE","idSubEntidadFinanciera":0,"idCustomer":null,"fechaInicio":"2024-03-01 00:00:00 AM","fechaFin":"2024-03-25 23:59:59 PM","dateChecked":true}', ''
CREATE OR ALTER PROC Contabilidad.ComprobanteIngreso_Report
	@userRoleId			INT
	, @json				VARCHAR(MAX)
    , @tableNames       VARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	--> Global
    DECLARE @tipo INT ,@idEntidad INT ,@usuario VARCHAR(150),@idUsuario INT, @codDoc VARCHAR(5), @idSubEntidadFinanciera INT
            , @fechaInicio DATETIME2, @fechaFin DATETIME2, @codEstab VARCHAR(20), @dateChecked BIT, @idCustomer INT
            , @idPuntoEmision   INT

    --> Sql
    DECLARE @sql NVARCHAR(MAX) ,@params NVARCHAR(MAX)
	
	--> Variables
    SELECT TOP 1 @idEntidad = idEntidad ,@usuario = nombreUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH ( tipo INT )

	--> Por Documentos.
	IF @tipo = 1
		BEGIN
            SET @tableNames = 'header,details'

             SELECT @codEstab                = codEstab
                , @codDoc                   = codDoc
                , @idSubEntidadFinanciera   = idSubEntidadFinanciera
                , @fechaInicio              = fechaInicio
                , @fechaFin                 = fechaFin
                , @dateChecked              = dateChecked
                , @idCustomer               = idCustomer
                , @idPuntoEmision           = idPuntoEmision
            FROM OPENJSON(@json) WITH (
                codEstab                    VARCHAR(20)
                , codDoc                    VARCHAR(5)
                , idSubEntidadFinanciera    INT
                , idCustomer                INT
                , fechaInicio               DATETIME2
                , fechaFin                  DATETIME2
                , dateChecked               BIT
                , idCustomer                INT
                , idPuntoEmision            INT
            )


            SET @params = '@idEntidad               INT 
                           ,@idSubEntidadFinanciera INT
                           ,@codEstab               VARCHAR(20)
                           ,@codDoc                 VARCHAR(5)
                           ,@idCustomer             INT
                           ,@idPuntoEmision         INT
                           ,@fechaInicio            DATETIME2
                           ,@fechaFin               DATETIME2'

            SET @sql = 'SELECT * FROM (SELECT ci.idComprobanteIngreso
                                            , ci.idPersona
                                            , se.nombreComercial
                                            , se.codEstab
                                            , ''CI'' +''-''+ se.estab +''-''+ Helper.F_Auto_Sequential(ci.nroDocumento)	                AS serie
                                            , ci.fechaRegistro                              											AS fechaRegistro
                                            , ci.nroIdentificacion
                                            , ci.nombreFiscal
                                            , CAST(ci.abono  AS NUMERIC(18,2))															AS abono
                                            , CAST(ci.total  AS NUMERIC(18,2))															AS total
                                            , cc.idPuntoEmision
                                            , cc.codDoc
                                            , cc.serieComprobante
                                            , ef.descripcion
                                            , CAST(hc.saldo  AS NUMERIC(18,2))															AS totalDoc
                                            , CAST(hc.abono  AS NUMERIC(18,2))															AS abonoDoc
                                            , CAST(hc.saldo - hc.abono AS NUMERIC(18,2))												AS saldoDoc
                                            , ISNULL(bc.descripcion, '''')																AS banco
                                            , ISNULL(cd.descripcion, '''')																AS ciudad
                                            , co.idSubEntidadFinanciera         														AS idSubEntidadFinanciera
                                            , co.secuencial                                                                             AS secuencial
                                            , (
	                                            CASE ef.codigo WHEN ''EFE'' THEN  ''''
								                                            ELSE  JSON_VALUE(dbo.f_sanitize_json(co.infoCobro), ''$.nro'')
	                                            END
	                                          )																						    AS nro
                                            , (
	                                            CASE ef.codigo WHEN ''TAR'' THEN  JSON_VALUE(dbo.f_sanitize_json(co.infoCobro), ''$.referencia'') 
								                                            ELSE  ''''
	                                            END
	                                          )																						    AS referencia
                                            , (
	                                            CASE ef.codigo WHEN ''TAR'' THEN  JSON_VALUE(dbo.f_sanitize_json(co.infoCobro), ''$.aprobacion'')
								                                            ELSE  ''''
	                                            END
	                                          )																						    AS aprobacion
                                            , (
	                                            CASE ef.codigo WHEN ''TAR'' THEN  JSON_VALUE(dbo.f_sanitize_json(co.infoCobro), ''$.lote'')
								                                            ELSE  ''''
	                                            END
	                                          )																					        AS lote
                                            FROM dbo.ComprobanteIngreso                 ci	    WITH(NOLOCK)
                                            INNER JOIN Contabilidad.Historial_Cobro		hc		WITH(NOLOCK) ON hc.idComprobanteIngreso		= ci.idComprobanteIngreso
                                            INNER JOIN Sri.Establecimiento				se		WITH(NOLOCK) ON se.codEstab					= ci.codEstab
                                            INNER JOIN Contabilidad.CuentaPorCobrar		cc		WITH(NOLOCK) ON cc.idCuentaPorCobrar		= hc.idCuentaPorCobrar
                                            INNER JOIN dbo.Cobro						co		WITH(NOLOCK) ON co.idCobro					= hc.idCobro
                                            INNER JOIN dbo.EntidadFinanciera			ef		WITH(NOLOCK) ON ef.idEntidadFinanciera		= co.idEntidadFinanciera
                                            LEFT  JOIN dbo.Banco						bc		WITH(NOLOCK) ON bc.idBanco					= co.idBanco
                                            LEFT  JOIN dbo.Ciudad						cd		WITH(NOLOCK) ON cd.idCiudad					= co.idCiudad
                                            WHERE		ci.idEntidad    = @idEntidad
                                            AND			ci.estado       = 1
                                   ) AS dt WHERE dt.idComprobanteIngreso > 0 '

            IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND dt.codEstab = @codEstab '
                END

            IF @idPuntoEmision > 0
                BEGIN
                    SET @sql = @sql + 'AND dt.idPuntoEmision = @idPuntoEmision '
                END

            IF @codDoc IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND dt.codDoc = @codDoc '
                END

            IF @idSubEntidadFinanciera > 0
                BEGIN
                    SET @sql = @sql + 'AND dt.idSubEntidadFinanciera = @idSubEntidadFinanciera '
                END

            IF @idCustomer > 0
                BEGIN
                    SET @sql = @sql + 'AND dt.idPersona = @idCustomer '
                END
                
            IF @dateChecked = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(dt.fechaRegistro AS DATE) BETWEEN CAST(@fechaInicio AS DATE) AND CAST(@fechaFin AS DATE) '
                END

            SET @sql = @sql + 'ORDER BY dt.fechaRegistro DESC '
            
            ---> Header
            SELECT TOP 1 
                ve.nombreComercial
                , ve.ruc
                , ve.telefono
                , ve.correo
                , @usuario          AS usuario
                , @fechaInicio      AS fechaInicio
                , @fechaFin         AS fechaFin
            FROM v_Estab_Asign ve WITH(NOLOCK)
            WHERE ve.codEstab = @codEstab

            ---> Details
            EXEC sp_executesql @sql
							  ,@params 
							  ,@idEntidad                   = @idEntidad
                              ,@idSubEntidadFinanciera      = @idSubEntidadFinanciera
                              ,@codEstab                    = @codEstab
                              ,@codDoc                      = @codDoc
                              ,@idCustomer                  = @idCustomer
                              ,@idPuntoEmision              = @idPuntoEmision
                              ,@fechaInicio                 = @fechaInicio
                              ,@fechaFin                    = @fechaFin
			RETURN
		END
	
    IF @tipo = 2
        BEGIN
            SET @tableNames = 'header,details'

            SELECT @codEstab                = codEstab
                , @codDoc                   = codDoc
                , @idSubEntidadFinanciera   = idSubEntidadFinanciera
                , @idCustomer               = idCustomer
                , @fechaInicio              = fechaInicio
                , @fechaFin                 = fechaFin
                , @dateChecked              = dateChecked
                , @idPuntoEmision           = idPuntoEmision
            FROM OPENJSON(@json) WITH (
                codEstab                    VARCHAR(20)
                , codDoc                    VARCHAR(5)
                , idSubEntidadFinanciera    INT
                , idCustomer                INT
                , fechaInicio               DATETIME2
                , fechaFin                  DATETIME2
                , dateChecked               BIT
                , idPuntoEmision            INT
            )

            
            --- Serie
            --- fechaRegistro => Fecha cobro.
            --- Numero de cobro.
            ---> Comprobante ingreso => Eliminar


            SET @params = '@idEntidad               INT 
                           ,@idSubEntidadFinanciera INT
                           ,@codEstab               VARCHAR(20)
                           ,@codDoc                 VARCHAR(5)
                           ,@idCustomer             INT
                           ,@idPuntoEmision         INT
                           ,@fechaInicio            DATETIME2
                           ,@fechaFin               DATETIME2'

            SET @sql = 'SELECT * FROM (SELECT ci.idComprobanteIngreso 
                                        , ci.idPersona
                                        , se.nombreComercial
                                        , se.codEstab
                                        , ''CI'' +''-''+ se.estab +''-''+ Helper.F_Auto_Sequential(ci.nroDocumento)						    AS serie
                                        , ci.fechaRegistro                              											        AS fechaRegistro
                                        , ci.nroIdentificacion
                                        , ci.nombreFiscal
                                        , CAST(ci.abono  AS NUMERIC(18,2))															        AS abono
                                        , CAST(ci.total  AS NUMERIC(18,2))															        AS total
                                        , co.fechaEmision
                                        , cc.idPuntoEmision
                                        , (	CASE cc.codDoc WHEN ''01'' THEN ''EFE'' ELSE cc.codDoc END )								    AS codDoc
                                        , cc.serieComprobante
                                        , cx.nroCuota
                                        , ef.descripcion
                                        , CAST(hc.saldo  AS NUMERIC(18,2))															        AS totalDoc
                                        , CAST(hc.abono  AS NUMERIC(18,2))															        AS abonoDoc
                                        , CAST(hc.saldo - hc.abono AS NUMERIC(18,2))												        AS saldoDoc
                                        , ISNULL(bc.descripcion, '''')																        AS banco
                                        , ISNULL(cd.descripcion, '''')																        AS ciudad
                                        , ISNULL(co.idSubEntidadFinanciera, 0)														        AS idSubEntidadFinanciera
                                        , co.secuencial                                                                                     AS secuencial
                                        , (
	                                        CASE ef.codigo WHEN ''EFE'' THEN  ''''
								                                        ELSE  JSON_VALUE(dbo.f_sanitize_json(co.infoCobro), ''$.nro'')
	                                        END
	                                      )																						            AS nro
                                        , (
	                                        CASE ef.codigo WHEN ''TAR'' THEN  JSON_VALUE(dbo.f_sanitize_json(co.infoCobro), ''$.referencia'') 
								                                        ELSE  ''''
	                                        END
	                                        )																						        AS referencia
                                        , (
	                                        CASE ef.codigo WHEN ''TAR'' THEN  JSON_VALUE(dbo.f_sanitize_json(co.infoCobro), ''$.aprobacion'')
								                                        ELSE  ''''
	                                        END
	                                      )																						            AS aprobacion
                                        , (
	                                        CASE ef.codigo WHEN ''TAR'' THEN  JSON_VALUE(dbo.f_sanitize_json(co.infoCobro), ''$.lote'')
								                                        ELSE  ''''
	                                        END
	                                      )																					                AS lote
                                        FROM dbo.ComprobanteIngreso                 ci	    WITH(NOLOCK)
                                        INNER JOIN Sri.Establecimiento				se		WITH(NOLOCK) ON se.codEstab					= ci.codEstab
                                        INNER JOIN dbo.Cobro						co		WITH(NOLOCK) ON co.idComprobanteIngreso		= ci.idComprobanteIngreso
                                        INNER JOIN dbo.EntidadFinanciera			ef		WITH(NOLOCK) ON ef.idEntidadFinanciera		= co.idEntidadFinanciera
                                        LEFT  JOIN dbo.Banco						bc		WITH(NOLOCK) ON bc.idBanco					= co.idBanco
                                        LEFT  JOIN dbo.Ciudad						cd		WITH(NOLOCK) ON cd.idCiudad					= co.idCiudad
                                        INNER JOIN dbo.CobroDetalle					hc		WITH(NOLOCK) ON hc.idCobro					= co.idCobro
                                        INNER JOIN Contabilidad.CuotaPorCobrar		cx		WITH(NOLOCK) ON cx.idCuotaPorCobrar			= hc.idCuotaPorCobrar
                                        INNER JOIN Contabilidad.CuentaPorCobrar		cc		WITH(NOLOCK) ON cc.idCuentaPorCobrar		= cx.idCuentaPorCobrar
                                        WHERE		ci.idEntidad    = @idEntidad
                                        AND			ci.estado       = 1
                                   ) AS dt WHERE dt.idComprobanteIngreso > 0 '
            
            IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND dt.codEstab = @codEstab '
                END

            IF @idPuntoEmision > 0
                BEGIN
                    SET @sql = @sql + 'AND dt.idPuntoEmision = @idPuntoEmision '
                END

            IF @codDoc IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND dt.codDoc = @codDoc '
                END

            IF @idSubEntidadFinanciera > 0
                BEGIN
                    SET @sql = @sql + 'AND dt.idSubEntidadFinanciera = @idSubEntidadFinanciera '
                END

            IF @idCustomer > 0
                BEGIN
                    SET @sql = @sql + 'AND dt.idPersona = @idCustomer '
                END
                
            IF @dateChecked = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(dt.fechaRegistro AS DATE) BETWEEN CAST(@fechaInicio AS DATE) AND CAST(@fechaFin AS DATE) '
                END

            SET @sql = @sql + 'ORDER BY dt.fechaRegistro DESC '

            ---> Header
            SELECT TOP 1 ve.nombreComercial
                , ve.ruc
                , ve.telefono
                , ve.correo
                , @usuario          AS usuario
                , @fechaInicio      AS fechaInicio
                , @fechaFin         AS fechaFin
            FROM v_Estab_Asign ve WITH(NOLOCK)
            WHERE ve.codEstab = @codEstab

            ---> Details
            EXEC sp_executesql @sql
							  ,@params 
							  ,@idEntidad                   = @idEntidad
                              ,@idSubEntidadFinanciera      = @idSubEntidadFinanciera
                              ,@codEstab                    = @codEstab
                              ,@codDoc                      = @codDoc
                              ,@idCustomer                  = @idCustomer
                              ,@idPuntoEmision              = @idPuntoEmision
                              ,@fechaInicio                 = @fechaInicio
                              ,@fechaFin                    = @fechaFin
            RETURN
        END
END
GO

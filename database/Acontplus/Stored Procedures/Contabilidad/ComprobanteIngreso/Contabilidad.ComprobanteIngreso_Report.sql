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
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
-- Contabilidad.ComprobanteIngreso_Report 307,'{"tipo":1,"format":"pdf","codEstab":"ESTAB-000000216","codDoc":"FV","idSubEntidadFinanciera":0,"idProveedor":null,"fechaInicio":"2024-03-01 00:00:00 AM","fechaFin":"2024-03-25 23:59:59 PM","isUseDate":true}', ''
CREATE OR ALTER PROC Contabilidad.ComprobanteIngreso_Report
	@userRoleId			INT
	, @json				VARCHAR(MAX)
    , @tableNames       VARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	--> Global
    DECLARE @tipo INT ,@idEntidad INT ,@usuario VARCHAR(150),@idUsuario INT, @codDoc VARCHAR(5), @idSubEntidadFinanciera INT, @idProveedor INT
            , @fechaInicio DATETIME2, @fechaFin DATETIME2, @codEstab VARCHAR(20), @isUseDate BIT

    --> Sql
    DECLARE @sql NVARCHAR(MAX) ,@params NVARCHAR(MAX)
	
	--> Variables
    SELECT TOP 1 @idEntidad = idEntidad ,@usuario = nombreUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH ( tipo INT )

	--> Por Documentos.
	IF @tipo = 1
		BEGIN
            SET @tableNames = 'details,header'

            SELECT @codEstab                = codEstab
                , @codDoc                   = codDoc
                , @idSubEntidadFinanciera   = idSubEntidadFinanciera
                , @idProveedor              = idProveedor
                , @fechaInicio              = fechaInicio
                , @fechaFin                 = fechaFin
                , @isUseDate                = isUseDate
            FROM OPENJSON(@json) WITH (
                codEstab                    VARCHAR(20)
                , codDoc                    VARCHAR(5)
                , idSubEntidadFinanciera    INT
                , idProveedor               INT
                , fechaInicio               DATETIME2
                , fechaFin                  DATETIME2
                , isUseDate                 BIT
            )

            SET @params = '@idEntidad               INT 
                           ,@idSubEntidadFinanciera INT
                           ,@codEstab               VARCHAR(20)
                           ,@codDoc                 VARCHAR(5)
                           ,@idProveedor            INT
                           ,@fechaInicio            DATETIME2
                           ,@fechaFin               DATETIME2'

            SET @sql = 'SELECT * FROM (SELECT ci.idComprobanteIngreso
                                            , se.nombreComercial
                                            , se.codEstab
                                            , ''CI'' +''-''+ se.estab +''-''+ Helper.F_Auto_Sequential(ci.nroDocumento)	                AS serie
                                            , ci.fechaRegistro                              											AS fechaRegistro
                                            , ci.nroIdentificacion
                                            , ci.nombreFiscal
                                            , CAST(ci.abono  AS NUMERIC(18,2))															AS abono
                                            , CAST(ci.total  AS NUMERIC(18,2))															AS total
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
                                            , td.codigo                                                                                 AS codigo                                            
                                            FROM dbo.ComprobanteIngreso                 ci	    WITH(NOLOCK)
                                            INNER JOIN Contabilidad.Historial_Cobro		hc		WITH(NOLOCK) ON hc.idComprobanteIngreso		= ci.idComprobanteIngreso
                                            INNER JOIN Sri.Establecimiento				se		WITH(NOLOCK) ON se.codEstab					= ci.codEstab
                                            INNER JOIN Contabilidad.CuentaPorCobrar		cc		WITH(NOLOCK) ON cc.idCuentaPorCobrar		= hc.idCuentaPorCobrar
                                            INNER JOIN dbo.Cobro						co		WITH(NOLOCK) ON co.idCobro					= hc.idCobro
                                            INNER JOIN dbo.EntidadFinanciera			ef		WITH(NOLOCK) ON ef.idEntidadFinanciera		= co.idEntidadFinanciera
                                            LEFT  JOIN dbo.Banco						bc		WITH(NOLOCK) ON bc.idBanco					= co.idBanco
                                            LEFT  JOIN dbo.Ciudad						cd		WITH(NOLOCK) ON cd.idCiudad					= co.idCiudad
                                            LEFT  JOIN dbo.TipoDocumento				td		WITH(NOLOCK) ON td.idTipoDocumento			= co.idTipoDocumento
                                            WHERE		ci.idEntidad    = @idEntidad
                                            AND			ci.estado       = 1
                                   ) AS dt WHERE dt.idComprobanteIngreso > 0 '

            IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND dt.codEstab = @codEstab '
                END

            IF @codDoc IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND dt.codigo = @codDoc '
                END

            IF @idSubEntidadFinanciera > 0
                BEGIN
                    SET @sql = @sql + 'AND dt.idSubEntidadFinanciera = @idSubEntidadFinanciera '
                END
                
            IF @isUseDate = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(dt.fechaRegistro AS DATE) BETWEEN CAST(@fechaInicio AS DATE) AND CAST(@fechaFin AS DATE) '
                END

            SET @sql = @sql + 'ORDER BY dt.fechaRegistro DESC '
            

            ---> Details
            EXEC sp_executesql @sql
							  ,@params 
							  ,@idEntidad                   = @idEntidad
                              ,@idSubEntidadFinanciera      = @idSubEntidadFinanciera
                              ,@codEstab                    = @codEstab
                              ,@codDoc                      = @codDoc
                              ,@idProveedor                 = @idProveedor
                              ,@fechaInicio                 = @fechaInicio
                              ,@fechaFin                    = @fechaFin

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

			RETURN
		END
	
    IF @tipo = 2
        BEGIN 
            SET @tableNames = 'details,header'

            SELECT @codEstab                = codEstab
                , @codDoc                   = codDoc
                , @idSubEntidadFinanciera   = idSubEntidadFinanciera
                , @idProveedor              = idProveedor
                , @fechaInicio              = fechaInicio
                , @fechaFin                 = fechaFin
                , @isUseDate                = isUseDate
            FROM OPENJSON(@json) WITH (
                codEstab                    VARCHAR(20)
                , codDoc                    VARCHAR(5)
                , idSubEntidadFinanciera    INT
                , idProveedor               INT
                , fechaInicio               DATETIME2
                , fechaFin                  DATETIME2
                , isUseDate                 BIT
            )

            SET @params = '@idEntidad               INT 
                           ,@idSubEntidadFinanciera INT
                           ,@codEstab               VARCHAR(20)
                           ,@codDoc                 VARCHAR(5)
                           ,@idProveedor            INT
                           ,@fechaInicio            DATETIME2
                           ,@fechaFin               DATETIME2'

            SET @sql = 'SELECT * FROM (SELECT ci.idComprobanteIngreso                                            
                                        , se.nombreComercial
                                        , se.codEstab
                                        , ''CI'' +''-''+ se.estab +''-''+ Helper.F_Auto_Sequential(ci.nroDocumento)						    AS serie
                                        , ci.fechaRegistro                              											        AS fechaRegistro
                                        , ci.nroIdentificacion
                                        , ci.nombreFiscal
                                        , CAST(ci.abono  AS NUMERIC(18,2))															        AS abono
                                        , CAST(ci.total  AS NUMERIC(18,2))															        AS total
                                        , cc.codDoc
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
	                                        )																						        AS nro
                                        , (
	                                        CASE ef.codigo WHEN ''TAR'' THEN  JSON_VALUE(dbo.f_sanitize_json(co.infoCobro), ''$.referencia'') 
								                                        ELSE  ''''
	                                        END
	                                        )																						        AS referencia
                                        , (
	                                        CASE ef.codigo WHEN ''TAR'' THEN  JSON_VALUE(dbo.f_sanitize_json(co.infoCobro), ''$.aprobacion'')
								                                        ELSE  ''''
	                                        END
	                                        )																						        AS aprobacion
                                        , (
	                                        CASE ef.codigo WHEN ''TAR'' THEN  JSON_VALUE(dbo.f_sanitize_json(co.infoCobro), ''$.lote'')
								                                        ELSE  ''''
	                                        END
	                                        )																					            AS lote
                                        , td.codigo                                                                                         AS codigo
                                            
                                        FROM dbo.ComprobanteIngreso                 ci	    WITH(NOLOCK)
                                        INNER JOIN Sri.Establecimiento				se		WITH(NOLOCK) ON se.codEstab					= ci.codEstab
                                        INNER JOIN dbo.Cobro						co		WITH(NOLOCK) ON co.idComprobanteIngreso		= ci.idComprobanteIngreso
                                        INNER JOIN dbo.EntidadFinanciera			ef		WITH(NOLOCK) ON ef.idEntidadFinanciera		= co.idEntidadFinanciera
                                        LEFT  JOIN dbo.Banco						bc		WITH(NOLOCK) ON bc.idBanco					= co.idBanco
                                        LEFT  JOIN dbo.Ciudad						cd		WITH(NOLOCK) ON cd.idCiudad					= co.idCiudad
                                        LEFT  JOIN dbo.TipoDocumento				td		WITH(NOLOCK) ON td.idTipoDocumento			= co.idTipoDocumento
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

            IF @codDoc IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND dt.codigo = @codDoc '
                END

            IF @idSubEntidadFinanciera > 0
                BEGIN
                    SET @sql = @sql + 'AND dt.idSubEntidadFinanciera = @idSubEntidadFinanciera '
                END
                
            IF @isUseDate = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(dt.fechaRegistro AS DATE) BETWEEN CAST(@fechaInicio AS DATE) AND CAST(@fechaFin AS DATE) '
                END

            SET @sql = @sql + 'ORDER BY dt.fechaRegistro DESC '

            ---> Details
            EXEC sp_executesql @sql
							  ,@params 
							  ,@idEntidad                   = @idEntidad
                              ,@idSubEntidadFinanciera      = @idSubEntidadFinanciera
                              ,@codEstab                    = @codEstab
                              ,@codDoc                      = @codDoc
                              ,@idProveedor                 = @idProveedor
                              ,@fechaInicio                 = @fechaInicio
                              ,@fechaFin                    = @fechaFin

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

            RETURN
        END
END
GO

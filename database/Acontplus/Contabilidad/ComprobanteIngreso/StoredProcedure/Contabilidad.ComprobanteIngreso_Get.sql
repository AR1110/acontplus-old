USE [AcontPlus]
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
CREATE OR ALTER PROCEDURE Contabilidad.ComprobanteIngreso_Get @idUsuarioRol INT, @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT ,@idEntidad INT

    --> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX) ,@pageIndex INT ,@pageSize INT
	
    -->Filters
	DECLARE @codEstab VARCHAR(50)
	       ,@fechaInicio DATETIME2 
	       ,@fechaFin DATETIME2
	       ,@nroIdentificacion NVARCHAR(100)
	       ,@byEstado INT 
	       ,@nroSecuencialDoc VARCHAR(13)
	       ,@idUsuario INT
	       ,@idComprobanteIngreso INT 
	       ,@idCuentaPorCobrar INT
	       ,@codDoc VARCHAR(5)

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT )

	SELECT TOP 1 @idUsuario = idUsuario , @idEntidad = idEntidad FROM v_Usuario WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

	--> Get 
	IF @tipo = 1
		BEGIN

			SET @params = '@idEntidad         INT
						  ,@fechaI            DATETIME2
						  ,@fechaF            DATETIME2
						  ,@nroIdentificacion NVARCHAR(100)
						  ,@estado            INT
						  ,@idUsuario         INT
						  ,@codEstab          VARCHAR(50)
						  ,@nroSecuencialDoc  VARCHAR(13)'

			SET @sql = 'SELECT TOP 50 ci.idComprobanteIngreso
							         ,ci.idComprobanteIngreso												       as idDocumento
							         ,es.codEstab
							         ,ci.total
							         ,FORMAT(ci.fechaRegistro,''dd/MM/yyyy'')								       as fechaRegistro
							         ,ci.abono
							         ,ci.cambio
							         ,''CI'' + ''-'' + es.estab + ''-'' +Helper.F_Auto_Sequential(ci.nroDocumento) as nroDoc
							         ,cu.IDCard															           as nroIdentificacion
							         ,cu.BusinessName													           as cliente
							         ,''Ninguna''															       as caja
							         ,CASE WHEN ci.estado = 0 THEN ''table-danger'' ELSE '''' END				   as style
							         ,CASE WHEN ci.estado = 0 THEN ''Anulado''      ELSE ''Activo'' END			   as estado
							         ,us.nombreUsuario														       as usuario
					FROM dbo.ComprobanteIngreso    ci WITH (NOLOCK) 
					INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = ci.idEstablecimiento
					INNER JOIN dbo.Usuario         us WITH (NOLOCK) ON us.idUsuario         = ci.idUsuario
					INNER JOIN Customer.Customer   cu WITH (NOLOCK) ON cu.id                = ci.CustomerId
                    WHERE ci.idEntidad = @idEntidad '

			SELECT @idUsuario         = byUsuario
				  ,@nroIdentificacion = nroIdentificacion
				  ,@codEstab          = codEstab
				  ,@byEstado          = byEstado
				  ,@fechaInicio       = fechaInicio
				  ,@fechaFin          = fechaFin
				  ,@nroSecuencialDoc  = LTRIM(TRIM(nroSecuencialDoc))
			FROM OPENJSON(@json)WITH
            (
                
                 fechaInicio       DATETIME2
                ,fechaFin          DATETIME2
                ,nroIdentificacion NVARCHAR(100)
                ,codEstab          VARCHAR(100)
                ,byUsuario         INT
                ,byEstado          INT
                ,nroSecuencialDoc  VARCHAR(13)
			)

            IF EXISTS (SELECT 1 FROM Config.v_User_Permission_Sale WHERE idUsuarioRol = @idUsuarioRol AND viewOthersDocs = 0) 
				BEGIN
                    SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH(NOLOCK) WHERE idUsuarioRol = @idUsuarioRol
				END

            IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND es.codEstab = @codEstab '
                END 

	        IF @byEstado IN (1,0)
			    BEGIN
				    SET @sql = @sql + 'AND ci.estado = @estado '
			    END 		 
			
			IF @nroIdentificacion IS NOT NULL
				BEGIN
					SET @sql = @sql + 'AND ci.nroIdentificacion = @nroIdentificacion '
				END 

			IF @nroSecuencialDoc > 0
				BEGIN
					SET @sql = @sql + ' AND ci.nroDocumento = @nroSecuencialDoc '
				END 
			ELSE 
				BEGIN
					SET @sql = @sql + 'AND CAST(ci.fechaRegistro as date) BETWEEN CAST(@fechaI as date) AND CAST(@fechaF as date) '

				END

			IF @idUsuario > 0 
				BEGIN
					SET @sql = @sql + 'AND ci.idUsuario = @byUsuarioSearch '
				END 		

			SET @sql = @sql + 'ORDER BY ci.nroDocumento DESC '
		 
			EXEC sp_executesql  @sql
					           ,@params
					           ,@idEntidad            = @idEntidad
					           ,@codEstab             = @codEstab
					           ,@fechaI               = @fechaInicio
					           ,@fechaF               = @fechaFin
					           ,@nroIdentificacion    = @nroIdentificacion
					           ,@idUsuario            = @idUsuario
					           ,@estado               = @byEstado
							   ,@nroSecuencialDoc     = @nroSecuencialDoc
			RETURN 
		END 

	--> Historial para mostrar los detalles del comprobante de ingreso 
	IF @tipo = 2
		BEGIN
			SELECT @idComprobanteIngreso = idComprobanteIngreso FROM OPENJSON(@json) WITH (idComprobanteIngreso INT '$.idComprobanteIngreso')

			SELECT ci.idComprobanteIngreso
				  ,'CI' + '-' + es.estab + '-' + Helper.F_Auto_Sequential(ci.nroDocumento) as serieComprobante
				  ,FORMAT(ci.fechaRegistro,'dd/MM/yyyy')                                   as fechaEmision
				  ,ci.total
				  ,ci.abono
				  ,ci.cambio
                  ,cu.IDCard                                                               as numeroIdentificacion
				  ,cu.BusinessName                                                         as nombreFiscal
			FROM dbo.ComprobanteIngreso    ci WITH (NOLOCK) 
			INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = ci.idEstablecimiento
            INNER JOIN Customer.Customer   cu WITH (NOLOCK) ON cu.id                = ci.CustomerId
			WHERE ci.idComprobanteIngreso = @idComprobanteIngreso

			SELECT co.idCobro
				  ,co.valor
				  ,co.abono
				  ,fechaEmision         = FORMAT(co.fechaEmision, 'dd/MM/yyyy')
				  ,codPago              = ef.codigo
				  ,subEntidadFinanciera = ISNULL(sf.descripcion, ef.descripcion)
				  ,co.infoCobro
				  ,posfechado           = CASE WHEN co.posfechado = 1 THEN  'SI' ELSE 'NO' END 
			      ,estado               = CASE WHEN co.cobro = 1 THEN 'COBRADO' ELSE 'POR COBRAR' END
			FROM dbo.Cobro                   co WITH (NOLOCK) 
			INNER JOIN dbo.EntidadFinanciera ef WITH (NOLOCK) ON ef.idEntidadFinanciera    = co.idEntidadFinanciera
			 LEFT JOIN SubEntidadFinanciera  sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = co.idSubEntidadFinanciera
			 LEFT JOIN Banco                 bc WITH (NOLOCK) ON bc.idBanco                = co.idBanco
			WHERE co.idComprobanteIngreso = @idComprobanteIngreso

			SELECT cd.idCobroDetalle
			      ,cd.idCobro 
				  ,codDoc           = CASE cx.codDoc WHEN '01' THEN 'Factura' ELSE 'Nota Entrega' END 
				  ,fechaVencimiento = FORMAT(cx.fechaVencimiento,'dd/MM/yyyy')
				  ,cc.nroCuota
				  ,cc.cuota
				  ,cd.interes
				  ,cd.diasMora
				  ,cd.mora
				  ,cd.abono
				  ,saldo            = (cc.cuota + cd.mora) - cd.abono
				  ,serieComprobante = cx.serieComprobante
			FROM dbo.CobroDetalle                   cd WITH (NOLOCK)
			INNER JOIN dbo.Cobro                    co WITH (NOLOCK) ON co.idCobro           = cd.idCobro
			INNER JOIN Contabilidad.CuotaPorCobrar  cc WITH (NOLOCK) ON cc.idCuotaPorCobrar  = cd.idCuotaPorCobrar
			INNER JOIN Contabilidad.CuentaPorCobrar cx WITH (NOLOCK) ON cx.idCuentaPorCobrar = cc.idCuentaPorCobrar
			WHERE co.idComprobanteIngreso = @idComprobanteIngreso

			RETURN 
		END

	--> Historial para mostrar los comprobantes de ingreso por Documento
	IF @tipo = 3
		BEGIN
			SELECT @idCuentaPorCobrar = idCuentaPorCobrar FROM OPENJSON(@json) WITH (idCuentaPorCobrar INT)

			SELECT cl.numeroIdentificacion
				  ,cl.nombreFiscal
				  ,cc.serieComprobante                        as serieComprobante
				  ,FORMAT(cc.fechaEmision,'dd/MM/yyyy hh:mm') as fechaEmision
				  ,cc.importeTotal
				  ,cc.abono
				  ,cc.saldo
			FROM Contabilidad.CuentaPorCobrar cc WITH (NOLOCK)
			INNER JOIN dbo.Cliente            cl WITH (NOLOCK) ON cl.idCliente      = cc.idCliente
			INNER JOIN dbo.PuntoEmision       pt WITH (NOLOCK) ON pt.idPuntoEmision = cc.idPuntoEmision
			INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.codEstab       = pt.codEstab
			WHERE cc.idCuentaPorCobrar = @idCuentaPorCobrar

			SELECT ci.idComprobanteIngreso 
				  ,FORMAT(ci.fechaRegistro,'dd/MM/yyyy hh:mm')                             as fechaEmision
				  ,'CI' + '-' + es.estab + '-' + Helper.F_Auto_Sequential(ci.nroDocumento) as serieComprobante
				  ,ci.total
				  ,ci.abono
				  ,ci.cambio
				  ,CASE ci.estado WHEN 1 THEN 'ACTIVO' ELSE 'ANULADO' END                  as estado
                  ,ci.estado                                                               as [status]
                  ,(
                        SELECT COUNT(DISTINCT cc.idCuentaPorCobrar) 
                        FROM Contabilidad.Historial_Cobro cc WITH (NOLOCK) 
                        WHERE cc.idComprobanteIngreso = ci.idComprobanteIngreso

                   )                                                                       as cantDocs
                  ,es.codEstab
			FROM dbo.ComprobanteIngreso     ci WITH (NOLOCK)
			INNER JOIN Sri.Establecimiento  es WITH (NOLOCK) ON es.idEstablecimiento = ci.idEstablecimiento
			WHERE ci.idComprobanteIngreso IN (SELECT hc.idComprobanteIngreso FROM Contabilidad.Historial_Cobro hc WITH (NOLOCK) WHERE hc.idCuentaPorCobrar = @idCuentaPorCobrar)
              AND ci.estado = 1

			SELECT co.idComprobanteIngreso
			      ,co.idCobro
				  ,CASE co.posfechado WHEN 1 THEN 'SI' ELSE 'NO' END         as posfechado
				  ,FORMAT(co.fechaEmision,'dd/MM/yyyy hh:mm')                as fechaEmision
				  ,ISNULL(sf.descripcion,ef.descripcion)                     as formaCobro
				  ,ISNULL(bc.descripcion,'-------------')                    as banco
				  ,ISNULL(dbo.f_sanitize_json(co.infoCobro),'[]')            as infoCobro
				  ,co.valor
				  ,co.abono
				  ,co.vuelto
				  ,CASE co.cobro WHEN 1 THEN 'COBRADO' ELSE 'POR COBRAR' END as estado
				  ,ef.codigo                                                 as codPago
			FROM dbo.ComprobanteIngreso             ci WITH (NOLOCK)
			INNER JOIN Contabilidad.Historial_Cobro hc WITH (NOLOCK) ON ci.idComprobanteIngreso   = hc.idComprobanteIngreso
			INNER JOIN dbo.Cobro                    co WITH (NOLOCK) ON co.idCobro                = hc.idCobro
			INNER JOIN dbo.EntidadFinanciera        ef WITH (NOLOCK) ON ef.idEntidadFinanciera    = co.idEntidadFinanciera
			 LEFT JOIN dbo.SubEntidadFinanciera     sf WITH (NOLOCK) ON sf.idSubEntidadFinanciera = co.idSubEntidadFinanciera
			 LEFT JOIN dbo.Banco                    bc WITH (NOLOCK) ON bc.idBanco                = co.idBanco
			WHERE hc.idCuentaPorCobrar = @idCuentaPorCobrar
              AND ci.estado = 1
            ORDER BY co.secuencial ASC

			SELECT co.idCobro
				  ,cx.nroCuota
				  ,FORMAT(cx.fechaVencimiento,'dd/MM/yyyy') as fechaVencimiento
				  ,cx.cuota
				  ,cc.abono
                  ,cc.saldo - cc.abono                      as saldo
			FROM dbo.ComprobanteIngreso             ci WITH (NOLOCK)
			INNER JOIN dbo.Cobro                    co WITH (NOLOCK) ON co.idComprobanteIngreso   = ci.idComprobanteIngreso
			INNER JOIN dbo.CobroDetalle             cc WITH (NOLOCK) ON cc.idCobro                = co.idCobro
			INNER JOIN Contabilidad.CuotaPorCobrar  cx WITH (NOLOCK) ON cx.idCuotaPorCobrar       = cc.idCuotaPorCobrar
			WHERE cx.idCuentaPorCobrar = @idCuentaPorCobrar
              AND ci.estado = 1
            ORDER BY co.secuencial,cx.nroCuota ASC

			RETURN 
		END 

    --> Filtros
    IF @tipo = 4
        BEGIN
            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idPuntoEmision
                  ,ptoEmi + '-' + estab as ptoEmi
                  ,defaultEstab
                  ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK)
            WHERE idUsuarioRol = @idUsuarioRol 
            ORDER BY defaultEstab DESC
            
            SELECT idTipoDocumento
                , descripcion
                , codigoSri
                , codigo AS codDoc
            FROM dbo.TipoDocumento
            WITH (NOLOCK) 
            WHERE codigo IN ('FV','NE')

            SELECT idSubEntidadFinanciera
                    , idEntidadFinanciera
                    , descripcion
                    , codigo
                    , interes
                    , estado
                    , idEntidad
                    , predeterminado
                    , controlCaja
            FROM SubEntidadFinanciera
            WHERE idEntidad = @idEntidad
            
            SELECT idBanco,descripcion,codigo FROM dbo.Banco WITH (NOLOCK) WHERE estado = 1
            RETURN
        END
END
GO
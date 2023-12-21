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
CREATE OR ALTER PROCEDURE Ventas.Aprob_Document_Insert @userRoleId INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Globales 
    DECLARE @idAprobacion INT ,@idTipoDocumento INT ,@idEntidad INT ,@idUsuario INT ,@uniqueId VARCHAR(150) = NEWID()

    -- Data Json
    DECLARE @comprobante VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@historial VARCHAR(MAX) ,@infoAdicionalArticulo VARCHAR(MAX) ,@infoAdicional VARCHAR(MAX)

    --> Aprob.ventas
	DECLARE @idPuntoEmision INT ,@docOrigen VARCHAR(5) ,@docDestino VARCHAR(5) ,@idEstadoDocumento INT , @identificacionComprador VARCHAR(20)

    -->Fact.Elect
    DECLARE @fechaEmision DATETIME2 ,@codDoc VARCHAR(5) ,@estab VARCHAR(5) ,@ptoEmi VARCHAR(5) ,@ruc VARCHAR(20) ,@ambiente VARCHAR(5) ,@secuencial INT ,@claveAcceso VARCHAR(50)

	DECLARE @tbComprobante  AS TABLE (
		 idCliente INT NOT NULL
		,idPuntoEmision INT NOT NULL
		,fechaEmision DATETIME2 NOT NULL
		,codDoc VARCHAR(5) NOT NULL
		,totalSinImpuestos NUMERIC(18,5) NOT NULL
		,totalDescuento NUMERIC(18,5) NOT NULL
		,propina NUMERIC(18,5) NOT NULL
		,importeTotal NUMERIC(18,5) NOT NULL
		,docOrigen VARCHAR(15) NOT NULL
		,docDestino VARCHAR(15) NOT NULL
		,observacion VARCHAR(300) NULL
	)

	DECLARE @tbDetalle AS TABLE (
		 orderIndex INT NOT NULL
		,idTarifa INT NOT NULL
		,idArticulo INT NOT NULL
		,idMedida INT NOT NULL
		,idTipoIva INT NOT NULL
		,idBodega INT NOT NULL
		,cantidad NUMERIC(18,5) NOT NULL
		,descripcion VARCHAR(300) NOT NULL
		,precioUnitario NUMERIC(18,5) NOT NULL
		,descuento NUMERIC(18,5) NOT NULL
		,precioTotalSinImpuesto NUMERIC(18,5) NOT NULL
		,codigoPorcentaje INT NOT NULL
		,tarifa NUMERIC(18,5) NOT NULL
        ,valorImpuesto NUMERIC(18,5) NOT NULL
        ,fechaEmision DATETIME2 NOT NULL
	)

    DECLARE @tbTaxes AS TABLE (
        TaxId INT NOT NULL 
	   ,TaxPercentId INT NOT NULL 
	   ,[Percent] NUMERIC(18,5) NOT NULL
	   ,TaxBase NUMERIC(18,5) NOT NULL
	   ,TaxValue NUMERIC(18,5) NOT NULL
       ,Discount NUMERIC(18,5) NOT NULL
    )

	DECLARE @tbHistorial AS TABLE (
		idDocumento INT NOT NULL
	   ,serie VARCHAR(20) NOT NULL
	)

	DECLARE @tbInfoAdicional AS TABLE (
		 nombre VARCHAR(300) NOT NULL
		,valor VARCHAR(300) NOT NULL
	)

	DECLARE @tbHistorialVenta AS TABLE (
		idInfoAdicional INT UNIQUE NOT NULL
	)

	BEGIN TRY 

        --> Variables Globales
        SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data Json 
        SELECT @comprobante           = comprobante
              ,@detalles              = detalles
              ,@impuestos             = impuestos
              ,@infoAdicional         = infoAdicional
              ,@infoAdicionalArticulo = infoAdicionalArticulo
              ,@historial             = historial
        FROM OPENJSON(@json) WITH 
        (
             comprobante           NVARCHAR(MAX) as json
            ,detalles              NVARCHAR(MAX) as json
            ,impuestos             NVARCHAR(MAX) as json
            ,infoAdicional         NVARCHAR(MAX) as json
            ,infoAdicionalArticulo NVARCHAR(MAX) as json
            ,historial             NVARCHAR(MAX) as json
        )

		INSERT INTO @tbComprobante
		      (idCliente,idPuntoEmision,fechaEmision,codDoc,totalSinImpuestos,totalDescuento,propina,importeTotal,docOrigen,docDestino,observacion)
		SELECT idCliente,idPuntoEmision,fechaEmision,codDoc,totalSinImpuestos,totalDescuento,propina,importeTotal,docOrigen,docDestino,observacion
		FROM OPENJSON(@comprobante)
		WITH (
				idCliente                   INT '$.idCliente' 
			   ,idPuntoEmision              INT '$.idPuntoEmision' 
			   ,fechaEmision          DATETIME2 '$.fechaEmision'
			   ,codDoc               VARCHAR(5) '$.codDoc'
			   ,totalSinImpuestos NUMERIC(18,5) '$.subTotalSinImpuestos' 
			   ,totalDescuento    NUMERIC(18,5) '$.totalDescuento'
			   ,propina           NUMERIC(18,5) '$.propina'
			   ,importeTotal      NUMERIC(18,5) '$.total' 
			   ,docOrigen           VARCHAR(15) '$.docOrigen'
			   ,docDestino          VARCHAR(15) '$.docDestino'
			   ,observacion        VARCHAR(300) '$.observacion'
		     )

		INSERT INTO @tbDetalle 
			  (orderIndex,idTarifa,idBodega,idArticulo,idMedida,idTipoIva,cantidad,descripcion,precioUnitario,descuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,fechaEmision)
		SELECT orderIndex,idTarifa,idBodega,idArticulo,idMedida,idTipoIva,cantidad,descripcion,precioUnitario,descuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,fechaEmision
		FROM OPENJSON(@detalles)
		WITH (
				orderIndex                       INT '$.orderIndex',
				idTarifa                         INT '$.idTarifa'
			   ,idArticulo                       INT '$.idArticulo'
		       ,idBodega                         INT '$.idBodega'
			   ,idMedida                         INT '$.idMedida' 
			   ,idTipoIva                        INT '$.idTipoIva' 
		       ,cantidad               NUMERIC(18,5) '$.cantidad' 
		       ,descripcion             VARCHAR(300) '$.descripcion' 
		       ,precioUnitario         NUMERIC(18,5) '$.precioUnitario' 
		       ,descuento              NUMERIC(18,5) '$.descuento'
		       ,precioTotalSinImpuesto NUMERIC(18,5) '$.precioTotalSinImpuesto' 
		       ,codigoPorcentaje          VARCHAR(5) '$.codigoPorcentaje'
		       ,tarifa                 NUMERIC(18,5) '$.tarifa'
               ,valorImpuesto          NUMERIC(18,5) '$.valorImpuesto'
               ,fechaEmision               DATETIME2 '$.fechaEmision'
		 )

        INSERT INTO @tbTaxes
              (TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
        SELECT TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount
        FROM OPENJSON(@impuestos) WITH 
        (
            taxId               INT 
	       ,taxPercentId        INT
	       ,[percent] NUMERIC(18,5)
	       ,taxBase   NUMERIC(18,5) 
	       ,taxValue  NUMERIC(18,5) 
           ,discount  NUMERIC(18,5)
        )

		INSERT INTO @tbHistorial  (idDocumento,serie) SELECT idDocumento,serie FROM OPENJSON(@historial) WITH (idDocumento INT '$.idDocumento' ,serie VARCHAR(30) '$.serie')

		INSERT INTO @tbInfoAdicional (nombre,valor) SELECT nombre,valor FROM OPENJSON(@infoAdicional) WITH (nombre VARCHAR(300) '$.nombre' ,valor VARCHAR(300) '$.valor')
		
		INSERT INTO @tbHistorialVenta (idInfoAdicional) SELECT idInfoAdicional FROM OPENJSON(@infoAdicionalArticulo) WITH (idInfoAdicional INT '$.idInfoAdicional')
		

		-- ========================== CAPTURAR LAS VARIABLES =============================================================
		SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigo = 'APR'

		SELECT TOP 1 @ruc = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

		SELECT TOP 1 @docOrigen = docOrigen , @docDestino = docDestino FROM @tbComprobante

		SELECT	
			@idPuntoEmision          = dt.idPuntoEmision 
		   ,@identificacionComprador = numeroIdentificacion
		   ,@estab                   = es.estab
		   ,@ptoEmi                  = pt.ptoEmi
		   ,@ambiente                = pt.ambiente
		   ,@fechaEmision            = dt.fechaEmision
		FROM @tbComprobante dt 
		INNER JOIN dbo.PuntoEmision    pt WITH (NOLOCK) ON pt.idPuntoEmision = dt.idPuntoEmision
		INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab       = pt.codEstab
		INNER JOIN dbo.Cliente         cl WITH (NOLOCK) ON cl.idCliente      = dt.idCliente 
		
		SELECT @secuencial =  COUNT(*) + 1 FROM Ventas.Aprob_Document WITH (NOLOCK) WHERE idPuntoEmision = @idPuntoEmision

		IF @docDestino = '01'
			BEGIN
				SET @claveAcceso = dbo.ufnGeneraClaveAcceso(dbo.AFTDeleteCero(@estab)
													   ,'01'
													   ,@ambiente
													   ,'1'
													   ,dbo.AFTConvertDate(@fechaEmision)
													   ,@ruc
													   ,@estab+@ptoEmi
													   ,dbo.AFTAutoComplete(@secuencial))
			END 
		ELSE
			BEGIN
				SET @claveAcceso = NEWID()

				SET @codDoc = 'NE'
			END 
		
		-- ========================= VALIDADACIONES =====================================================	

		IF (SELECT COUNT(*) FROM @tbComprobante) = 0 
			BEGIN
				SELECT '0'code,'Erro en la informacion del comprobante' as 'message'
				RETURN
			END 

		IF (SELECT COUNT(*) FROM @tbDetalle) = 0 
			BEGIN
				SELECT '0'code,'Error en la informacion del detalle' as 'message'
				RETURN
			END 

		IF (SELECT COUNT(*) FROM @tbHistorial) = 0 
			BEGIN
				SELECT '0'code,'Erro en la informacion del historial' as 'message'
				RETURN
			END 

        IF (SELECT COUNT(*) FROM @tbTaxes) = 0 
            BEGIN
                SELECT '0' code,'Error en los impuestos' AS 'message'
				RETURN
            END
		
		IF @claveAcceso IS NULL
			BEGIN
				SELECT '0'code,'Error critico la clave de Acceso no se genero correctamente' as 'message'
				RETURN 
			END 

		IF EXISTS (SELECT 1 FROM Ventas.Aprob_Document wHERE claveAcceso = @claveAcceso)
			BEGIN
				SELECT '0'code,'Esta clave de acceso ya se encuentra registrada' as 'message'
				RETURN
			END 

		BEGIN TRAN
            
            --> Comprobante
			INSERT INTO Ventas.Aprob_Document
                   (uniqueId,idCliente,idPuntoEmision,fechaEmision, identificacionComprador,codDoc,estab,ptoEmi,ruc,ambiente,tipoEmision,secuencial,claveAcceso,totalSinImpuestos,totalDescuento,propina,importeTotal,docOrigen,observacion,idEntidad,idUsuario)
			SELECT @uniqueId,idCliente,idPuntoEmision,fechaEmision,@identificacionComprador,codDoc,@estab,@ptoEmi,@ruc,@ambiente,'1',@secuencial,@claveAcceso,totalSinImpuestos,totalDescuento,propina,importeTotal,@docOrigen,observacion,@idEntidad,@idUsuario
			FROM @tbComprobante

			SET @idAprobacion = @@IDENTITY

            --> Detalles 
			INSERT INTO Ventas.Aprob_Document_Detailt
                   (uniqueId,idArticulo,idTarifa,idBodega,idTipoIva,idMedida,cantidad,descripcion,precioUnitario,descuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,fechaEmision)
			SELECT @uniqueId,idArticulo,idTarifa,idBodega,idTipoIva,idMedida,cantidad,descripcion,precioUnitario,descuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,fechaEmision
			FROM @tbDetalle 
			ORDER BY orderIndex ASC

            -->Impuestos
            INSERT INTO Ventas.AprobVentasImpuesto
                   (AprobDocumentId,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
            SELECT @idAprobacion,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount FROM @tbTaxes

			INSERT INTO Ventas.Aprob_Document_Hist(uniqueId,idDocumento,codDocumento,serie)
			SELECT @uniqueId,idDocumento,@docOrigen,serie FROM @tbHistorial 

			INSERT INTO InfoAdicionalDoc (idComprobante,idTipoDocumento,nombre,valor)
						          SELECT @idAprobacion,@idTipoDocumento,nombre,valor FROM @tbInfoAdicional

			INSERT INTO Ventas.HistoryInfoAdicional(idInfoAdicional,idDocumento,codDoc,secuencial,estab,ptoEmi)
			                                 SELECT idInfoAdicional,@idAprobacion,'APR',@secuencial,@estab,@ptoEmi FROM @tbHistorialVenta

			IF @docOrigen = 'NE'
				BEGIN
					SELECT TOP 1 @idEstadoDocumento = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'TRA'

					UPDATE cc SET cc.idEstadoPago = @idEstadoDocumento FROM Contabilidad.CuentaPorCobrar cc WITH(NOLOCK)
				    JOIN (SELECT dt.idDocumento FROM Ventas.Aprob_Document_Hist dt WHERE dt.uniqueId = @uniqueId) dt ON dt.idDocumento = cc.idDocumento AND cc.codDoc = 'NE'

				END 

			IF @docOrigen = 'PR'
				BEGIN
					SELECT TOP 1 @idEstadoDocumento = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'APL'

					UPDATE pr SET	
						pr.idEstadoDocumento = @idEstadoDocumento
					FROM dbo.Proforma pr WITH(NOLOCK)
				    JOIN (SELECT dt.idDocumento FROM Ventas.Aprob_Document_Hist dt
					       WHERE dt.uniqueId = @uniqueId) dt ON dt.idDocumento = pr.idProforma
				END 

		COMMIT TRAN 
		SELECT '1'code,'Registrado Correctamente' as 'message'
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END
		SELECT '0'code,'Info: Error en el procedimiento: ' as  'message'

		INSERT INTO ErroresSistema
		      (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Aprobacion/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
	END CATCH 

END
GO

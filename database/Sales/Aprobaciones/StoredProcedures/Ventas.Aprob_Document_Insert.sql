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
    DECLARE @idAprob_Document INT ,@idEntidad INT ,@idUsuario INT ,@idTipoDocumento INT

    -- Data Json
    DECLARE @comprobante VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@historial VARCHAR(MAX) ,@infoAdicionalArticulo VARCHAR(MAX) ,@infoAdicional VARCHAR(MAX)

    --> Aprob.ventas
	DECLARE @idPuntoEmision INT ,@docOrigen VARCHAR(5) ,@docDestino VARCHAR(5) ,@idEstadoDocumento INT ,@serieComprobante VARCHAR(50)

    -->Fact.Elect
    DECLARE @fechaEmision DATETIME2 ,@estab VARCHAR(5) ,@ptoEmi VARCHAR(5) ,@ruc VARCHAR(20) ,@ambiente VARCHAR(5) ,@secuencial INT ,@claveAcceso VARCHAR(50)

	DECLARE @tbComprobante  AS TABLE (
		 idCliente INT NOT NULL
		,idPuntoEmision INT NOT NULL
        ,idUsuario INT NOT NULL
        ,idTipoDocumento INT NOT NULL
        ,idTipoDocOrigen INT NOT NULL
		,fechaEmision DATETIME2 NOT NULL
		,totalSinImpuestos NUMERIC(18,5) NOT NULL
		,totalDescuento NUMERIC(18,5) NOT NULL
		,propina NUMERIC(18,5) NOT NULL
		,importeTotal NUMERIC(18,5) NOT NULL
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
        ,nota VARCHAR(200) NULL
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
		idNotaEntrega INT
	   ,idProforma INT
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
		      (idCliente,idPuntoEmision,idUsuario,idTipoDocumento,idTipoDocOrigen,fechaEmision,totalSinImpuestos,totalDescuento,propina,importeTotal,observacion)
		SELECT idCliente,idPuntoEmision,idUsuario,idTipoDocumento,idTipoDocOrigen,fechaEmision,totalSinImpuestos,totalDescuento,propina,importeTotal,observacion
		FROM OPENJSON(@comprobante) WITH 
        (
		     idCliente         INT  
		    ,idPuntoEmision    INT 
            ,idUsuario         INT 
            ,idTipoDocumento   INT
            ,idTipoDocOrigen   INT
		    ,fechaEmision      DATETIME2 
		    ,totalSinImpuestos NUMERIC(18,5) '$.subTotalSinImpuestos'
		    ,totalDescuento    NUMERIC(18,5)
		    ,propina           NUMERIC(18,5) 
		    ,importeTotal      NUMERIC(18,5) 
		    ,observacion       VARCHAR(300)
            
		)

		INSERT INTO @tbDetalle 
			  (orderIndex,idTarifa,idBodega,idArticulo,idMedida,idTipoIva,cantidad,descripcion,precioUnitario,descuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,fechaEmision, nota)
		SELECT orderIndex,idTarifa,idBodega,idArticulo,idMedida,idTipoIva,cantidad,descripcion,precioUnitario,descuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,fechaEmision, nota
		FROM OPENJSON(@detalles) WITH 
        (
		     orderIndex             INT
		    ,idTarifa               INT
		    ,idArticulo             INT 
		    ,idBodega               INT 
		    ,idMedida               INT
		    ,idTipoIva              INT 
		    ,cantidad               NUMERIC(18,5) 
		    ,descripcion            VARCHAR(300)
		    ,precioUnitario         NUMERIC(18,5) 
		    ,descuento              NUMERIC(18,5)
		    ,precioTotalSinImpuesto NUMERIC(18,5)
		    ,codigoPorcentaje       VARCHAR(5)
		    ,tarifa                 NUMERIC(18,5) 
            ,valorImpuesto          NUMERIC(18,5) 
            ,fechaEmision           DATETIME2
            ,nota                   VARCHAR(200)
		 )

        INSERT INTO @tbTaxes
              (TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
        SELECT TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount
        FROM OPENJSON(@impuestos) WITH 
        (
            taxId        INT 
	       ,taxPercentId INT
	       ,[percent]    NUMERIC(18,5)
	       ,taxBase      NUMERIC(18,5) 
	       ,taxValue     NUMERIC(18,5) 
           ,discount     NUMERIC(18,5)
        )

		INSERT INTO @tbHistorial  
              (idNotaEntrega,idProforma) 
        SELECT idNotaEntrega,idProforma 
        FROM OPENJSON(@historial) WITH 
        (
            idNotaEntrega INT
           ,idProforma    INT
        )

		INSERT INTO @tbInfoAdicional (nombre,valor) SELECT nombre,valor FROM OPENJSON(@infoAdicional) WITH (nombre VARCHAR(300) '$.nombre' ,valor VARCHAR(300) '$.valor')
		
		INSERT INTO @tbHistorialVenta (idInfoAdicional) SELECT idInfoAdicional FROM OPENJSON(@infoAdicionalArticulo) WITH (idInfoAdicional INT '$.idInfoAdicional')
		
		--> CAPTURAR LAS VARIABLES 
		SELECT TOP 1 @ruc = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

        SELECT TOP 1 @idEstadoDocumento = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PE'

		SELECT @idPuntoEmision  = dt.idPuntoEmision 
              ,@idTipoDocumento = dt.idTipoDocumento
              ,@fechaEmision    = dt.fechaEmision
              ,@idUsuario       = dt.idUsuario
              ,@ptoEmi          = pt.ptoEmi
		      ,@ambiente        = pt.ambiente
              ,@docDestino      = td.codigoSri
              ,@docOrigen       = og.codigo
              ,@estab           = es.estab
		FROM @tbComprobante dt 
		INNER JOIN dbo.PuntoEmision    pt WITH (NOLOCK) ON pt.idPuntoEmision    = dt.idPuntoEmision
        INNER JOIN dbo.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = dt.idTipoDocumento
        INNER JOIN dbo.TipoDocumento   og WITH (NOLOCK) ON og.idTipoDocumento   = dt.idTipoDocOrigen
		INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = pt.idEstablecimiento
        
		
		SELECT @secuencial =  COUNT(*) + 1 FROM Ventas.Aprob_Document WITH (NOLOCK) WHERE idPuntoEmision = @idPuntoEmision

        SELECT @serieComprobante   = @estab + '-' + @ptoEmi + '-' +  Helper.F_Auto_Sequential(@secuencial)

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
			END 
		
		-- ========================= VALIDADACIONES =====================================================	

		IF NOT EXISTS(SELECT 1 FROM @tbComprobante)
			BEGIN
				SELECT '0'code,'Erro en la informacion del comprobante' as 'message'
				RETURN
			END 

		IF NOT EXISTS(SELECT 1 FROM @tbDetalle) 
			BEGIN
				SELECT '0'code,'Error en la informacion del detalle' as 'message'
				RETURN
			END 

		IF NOT EXISTS(SELECT 1 FROM @tbHistorial) 
			BEGIN
				SELECT '0'code,'Erro en la informacion del historial' as 'message'
				RETURN
			END 

        IF NOT EXISTS(SELECT 1 FROM @tbTaxes)
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
                  (idTipoDocumento,idTipoDocOrigen,idCliente,idPuntoEmision, idEstadoDocumento, idUsuario,fechaEmision ,secuencial ,claveAcceso,totalSinImpuestos,totalDescuento,propina,importeTotal,observacion ,serieComprobante)
			SELECT idTipoDocumento,idTipoDocOrigen,idCliente,idPuntoEmision,@idEstadoDocumento,@idUsuario,fechaEmision,@secuencial,@claveAcceso,totalSinImpuestos,totalDescuento,propina,importeTotal,observacion,@serieComprobante
			FROM @tbComprobante

			SET @idAprob_Document = @@IDENTITY

            --> Detalles 
			INSERT INTO Ventas.Aprob_Document_Detailt
                   (idAprob_Document,idArticulo,idTarifa,idBodega,idTipoIva,idMedida,cantidad,descripcion,precioUnitario,descuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,fechaEmision, nota)
			SELECT @idAprob_Document,idArticulo,idTarifa,idBodega,idTipoIva,idMedida,cantidad,descripcion,precioUnitario,descuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,fechaEmision, nota
			FROM @tbDetalle 
			ORDER BY orderIndex ASC

            -->Impuestos
            INSERT INTO Ventas.AprobVentasImpuesto
                    (AprobDocumentId,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
            SELECT @idAprob_Document,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount FROM @tbTaxes

			INSERT INTO Ventas.Aprob_Document_Hist
                   (idAprob_Document,idProforma,idNotaEntrega)
			SELECT @idAprob_Document,idProforma,idNotaEntrega 
            FROM @tbHistorial 

			INSERT INTO InfoAdicionalDoc(idComprobante,idTipoDocumento,nombre,valor)
			SELECT @idAprob_Document,@idTipoDocumento,nombre,valor FROM @tbInfoAdicional


			IF @docOrigen = 'NE'
				BEGIN
                    UPDATE dbo.NotaEntrega WITH (ROWLOCK) SET convertToDoc = 1 
                    WHERE idNotaEntrega IN (
                                              SELECT dt.idNotaEntrega FROM Ventas.Aprob_Document_Hist dt WHERE dt.idAprob_Document = @idAprob_Document  
                                           )
				END 

			IF @docOrigen = 'PR'
				BEGIN
					SELECT TOP 1 @idEstadoDocumento = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'APL'

					UPDATE dbo.Proforma SET idEstadoDocumento = @idEstadoDocumento
                    WHERE idProforma IN (
                                            SELECT dt.idProforma FROM Ventas.Aprob_Document_Hist dt WHERE dt.idAprob_Document = @idAprob_Document  
                                        )
				END 

		COMMIT TRAN 
		SELECT '1'code,'Registrado Correctamente' as 'message'
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END

		INSERT INTO ErroresSistema
		      (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Aprobacion/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

        SELECT '0'code,'Info: Error en el procedimiento: ' as  'message'
	END CATCH 

END
GO

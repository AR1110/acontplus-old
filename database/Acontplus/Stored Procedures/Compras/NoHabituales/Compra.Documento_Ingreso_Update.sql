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
-- Author:		Alexis Ramirez 
-- Create date: 03/16/2023
-- Description:	SP para actualizar los documentos de ingreso.
-- =============================================
CREATE OR ALTER PROCEDURE Compra.Documento_Ingreso_Update @userRoleId INT, @id INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

	--> Globales 
	DECLARE @idUsuario INT ,@idEntidad INT

    --> Data Json
    DECLARE @comprobante VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@artInfoAdicionales VARCHAR(MAX) ,@cuotas VARCHAR(MAX)

	--> Compra
	DECLARE @uniqueId VARCHAR(150) ,@fechaEmision DATETIME2 ,@importeTotal NUMERIC(18,5)

    --> contabilidad
	DECLARE @idEstablecimiento INT ,@identificacion VARCHAR(20) ,@serieComprobante VARCHAR(20) ,@idProveedor INT ,@idTiempoCredito INT
        ,@subcategoryId INT

    -----DATOS CONTABILIDAD------
	DECLARE @fechaVencimiento DATETIME2

    --> Customer
    DECLARE @CustomerId INT

	DECLARE @document AS TABLE(
		 idDocumentoIngreso INT NOT NULL
        ,idProveedor INT NOT NULL
        ,fechaEmision DATETIME2 NOT NULL
        ,fechaVencimiento DATETIME2 NOT NULL
        ,totalSinImpuestos NUMERIC (18,5) NOT NULL
        ,porcentajeDescuento NUMERIC(18,5) NOT NULL
        ,descuento NUMERIC(18,5) NOT NULL
        ,importeTotal NUMERIC (18,5) NOT NULL
        ,observacion VARCHAR(300) NULL
        ,subcategoryId INT
	)

	DECLARE @tblDetails AS TABLE (
		 orderIndex INT NOT NULL
		,idDocumentoIngresoDetail INT NOT NULL
        ,idArticulo INT NOT NULL
		,idBodega INT NOT NULL
		,idMedida INT NULL
		,idTipoIva INT NOT NULL
		,ice NUMERIC (18,5) NOT NULL
		,cantidad NUMERIC (18,5) NOT NULL
		,precioUnitario NUMERIC (18,5) NOT NULL
		,descuento  NUMERIC (18,5) NOT NULL
		,porcentajeDescuento NUMERIC (18,5) NOT NULL
        ,codigoPorcentaje VARCHAR(5) NOT NULL
        ,tarifa NUMERIC(18,5) NOT NULL
        ,valorImpuesto NUMERIC(18,5) NOT NULL
		,precioTotalSinImpuesto NUMERIC (18,5) NOT NULL
		,nota VARCHAR(100) NULL
		,descripcion VARCHAR(255) NOT NULL
        ,llevaInventario BIT NOT NULL
        ,cantidadTransaccion NUMERIC(18,5) NOT NULL
        ,conversion NUMERIC(18,5) NOT NULL
        ,precioCosto NUMERIC(18,5) NOT NULL
        ,precioCostoFraccionado NUMERIC(18,5) NOT NULL
        ,estado BIT NOT NULL
	)

	DECLARE @tbTaxes AS TABLE (
        TaxId INT NOT NULL 
	   ,TaxPercentId INT NOT NULL 
	   ,[Percent] NUMERIC(18,5) NOT NULL
	   ,TaxBase NUMERIC(18,5) NOT NULL
	   ,TaxValue NUMERIC(18,5) NOT NULL
       ,Discount NUMERIC(18,5) NOT NULL
    )

	DECLARE @artInfoAdicional AS TABLE (
		 idInfoAdicional INT NOT NULL
		,idArticulo INT  NOT NULL		
		,idEtiqueta INT  NOT NULL
		,jsonAdicional NVARCHAR(MAX) NULL
	)

    DECLARE @tbCuotas AS TABLE(
	    idCuotaPorPagar INT UNIQUE NOT NULL
       ,nroCuota INT UNIQUE NOT NULL 
	   ,fechaVencimiento DATE NOT NULL
	   ,cuota NUMERIC(18,5) NOT NULL
	   ,entrada BIT NOT NULL
	)


	BEGIN TRY 
		
        --> Globales
        SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data Json 
        SELECT @comprobante        = comprobante
              ,@detalles           = detalles
              ,@impuestos          = impuestos
              ,@artInfoAdicionales = artInfoAdicionales
              ,@cuotas             = cuotas
        FROM OPENJSON(@json) WITH 
        (
             comprobante        NVARCHAR(MAX) as json
            ,detalles           NVARCHAR(MAX) as json 
            ,impuestos          NVARCHAR(MAX) as json
            ,artInfoAdicionales NVARCHAR(MAX) as json
            ,cuotas             NVARCHAR(MAX) as json
        )
        
		INSERT INTO @document 
		      (idDocumentoIngreso,idProveedor,fechaEmision,fechaVencimiento,totalSinImpuestos,importeTotal,observacion,descuento,porcentajeDescuento, subcategoryId)
		SELECT @id               ,idProveedor,fechaEmision,fechaVencimiento,totalSinImpuestos,importeTotal,observacion,descuento,porcentajeDescuento, subcategoryId
		FROM OPENJSON(@comprobante)WITH 
        (
             idDocumentoIngreso     INT
            ,idProveedor            INT  
		    ,fechaEmision           DATETIME2 
		    ,fechaVencimiento       DATETIME2  
		    ,totalSinImpuestos      NUMERIC(18,5)
            ,descuento              NUMERIC(18,5) 
            ,porcentajeDescuento    NUMERIC(18,5) 
		    ,importeTotal           NUMERIC(18,5)
            ,observacion            VARCHAR(300)  
            ,subcategoryId          INT
		) as dt
		
		INSERT INTO @tblDetails
              (orderIndex,idDocumentoIngresoDetail,idArticulo,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,descuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion,precioCosto,conversion,precioCostoFraccionado,estado)
		SELECT orderIndex,idDocumentoIngresoDetail,idArticulo,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,descuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion,precioCosto,conversion,precioCostoFraccionado,estado 
		FROM OPENJSON (@detalles) WITH 
        (
		     orderIndex               INT 
		    ,idDocumentoIngresoDetail INT 
            ,idArticulo               INT 
		    ,idBodega                 INT
		    ,idMedida                 INT 
            ,idTipoIva                INT 
		    ,ice                      NUMERIC(10,5)
		    ,cantidad                 NUMERIC(15,5) 
		    ,precioUnitario           NUMERIC(15,5) 
		    ,descuento                NUMERIC(15,5) 
		    ,precioTotalSinImpuesto   NUMERIC(15,5) 
		    ,porcentajeDescuento      NUMERIC(15,5) 
            ,codigoPorcentaje         VARCHAR(5) 
            ,tarifa                   NUMERIC(15,5) 
            ,valorImpuesto            NUMERIC(15,5) 
		    ,precioTotalSinImpuesto   NUMERIC(15,5) 
		    ,nota                     VARCHAR(100) 
		    ,descripcion              VARCHAR(255) 
            ,llevaInventario          BIT 
            ,cantidadTransaccion      NUMERIC(15,5)
            ,precioCosto              NUMERIC(15,5)
            ,conversion               NUMERIC(15,5)
            ,precioCostoFraccionado   NUMERIC(15,5)
            ,estado                   BIT 
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

		INSERT INTO @artInfoAdicional  
              (idInfoAdicional,idArticulo,idEtiqueta,jsonAdicional)
		SELECT idInfoAdicional,idArticulo,idEtiqueta,jsonAdicional
		FROM OPENJSON(@artInfoAdicionales) WITH 
        (
		     idInfoAdicional INT
		    ,idArticulo      INT
		    ,idEtiqueta      INT
		    ,jsonAdicional   NVARCHAR(max) '$.jsonAdicional' AS JSON		
		) 

        INSERT INTO @tbCuotas
              (idCuotaPorPagar,nroCuota,fechaVencimiento,cuota,entrada)
        SELECT idCuotaPorPagar,nroCuota,fechaVencimiento,cuota,entrada
        FROM OPENJSON(@cuotas) WITH 
        (
            idCuotaPorPagar  INT
           ,nroCuota         INT
	       ,fechaVencimiento DATE 
	       ,cuota            NUMERIC(18,5) 
	       ,entrada          BIT 
        )

		--> Recuperar datos de las Tablas
		SELECT TOP 1 @fechaEmision = fechaEmision ,@importeTotal = importeTotal ,@idProveedor = idProveedor ,@fechaVencimiento = fechaVencimiento, @subcategoryId = subcategoryId FROM @document

        SELECT TOP 1 @identificacion = numeroIdentificacion ,@CustomerId = ISNULL(CustomerId,0) FROM dbo.Proveedor WITH (NOLOCK) WHERE idProveedor = @idProveedor

        IF (@CustomerId = 0)
            BEGIN
                SELECT [Common].[ufnSpResponse]('0','Debe validar el proveedor',DEFAULT)
				RETURN 
            END
        

		SELECT TOP 1 @uniqueId =  uniqueId FROM Compra.Documento_Ingreso WITH (NOLOCK) WHERE idDocumentoIngreso = @id 

		--> Validacion de la informacion
        IF (SELECT COUNT(*) FROM @document) = 0 
            BEGIN
                SELECT [Common].[ufnSpResponse]('0','Error en la info Factura', DEFAULT)
                RETURN
            END 

        IF (SELECT COUNT(*) FROM @tblDetails) = 0 
            BEGIN
                SELECT [Common].[ufnSpResponse]('0','Error en los detalles', DEFAULT)
                RETURN
            END
           
        IF (SELECT COUNT(*) FROM @tbTaxes) = 0 
            BEGIN
                SELECT [Common].[ufnSpResponse]('0','Error en los impuestos',DEFAULT)
                RETURN
            END

        IF (SELECT COUNT(*) FROM @tbCuotas) = 0 
            BEGIN
                SELECT [Common].[ufnSpResponse]('0','Error en las cuotas',DEFAULT)
                RETURN
            END


		IF EXISTS (SELECT 1 FROM v_CuentaPorPagar WITH (NOLOCK) WHERE codDoc = 'DH' AND codEstado != 'PE' AND idDocumento = @id)
            BEGIN
                SELECT [Common].[ufnSpResponse]('0','El Documento tiene movimientos financieros o esta Anulado',DEFAULT)
                RETURN 
            END 

		BEGIN TRAN 
			
			--> Comprobante
			UPDATE di WITH (ROWLOCK) 
               SET di.idProveedor         = dc.idProveedor
			      ,di.fechaEmision        = dc.fechaEmision
                  ,di.descuento           = dc.descuento
                  ,di.porcentajeDescuento = dc.porcentajeDescuento
			      ,di.totalSinImpuestos   = dc.totalSinImpuestos
			      ,di.importeTotal        = dc.importeTotal
                  ,di.observacion         = dc.observacion
			FROM Compra.Documento_Ingreso di 
			INNER JOIN @document          dc ON dc.idDocumentoIngreso = di.idDocumentoIngreso
			 
            --> Detalles
			UPDATE dd SET
				   dd.idMedida               = dt.idMedida
			      ,dd.idBodega               = dt.idBodega
                  ,dd.idTipoIva              = dt.idTipoIva
                  ,dd.descripcion            = dt.descripcion
			      ,dd.cantidad               = dt.cantidad
			      ,dd.precioUnitario         = dt.precioUnitario
			      ,dd.descuento              = dt.descuento
			      ,dd.precioTotalSinImpuesto = dt.precioTotalSinImpuesto
			      ,dd.codigoPorcentaje       = dt.codigoPorcentaje
                  ,dd.tarifa                 = dt.tarifa
                  ,dd.valorImpuesto          = dt.valorImpuesto
			      ,dd.estado                 = dt.estado
			FROM Compra.Documento_Ingreso_Detail dd WITH (NOLOCK)
			INNER JOIN @tblDetails               dt ON dt.idDocumentoIngresoDetail = dd.idDocumentoIngresoDetail

			INSERT INTO Compra.Documento_Ingreso_Detail
			       (idDocumentoIngreso,idArticulo,idMedida,idBodega,idTipoIva,descripcion,cantidad,precioUnitario,descuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto)
			SELECT @id                ,idArticulo,idMedida,idBodega,idTipoIva,descripcion,cantidad,precioUnitario,descuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto
			FROM @tblDetails
            WHERE idDocumentoIngresoDetail = 0 
            ORDER BY orderIndex ASC 

            DELETE FROM Compra.Documento_Ingreso_Detail WHERE idDocumentoIngreso = @id AND estado = 0

            --> Impuestos
			DELETE FROM Compra.DocumentoIngresoImpuesto WHERE DocumentoIngresoId = @id

            INSERT INTO Compra.DocumentoIngresoImpuesto
                   (DocumentoIngresoId,TaxId,TaxPercentId,TaxBase,[Percent],TaxValue,Discount)
            SELECT @id                ,TaxId,TaxPercentId,TaxBase,[Percent],TaxValue,Discount FROM @tbTaxes

			
			--> InfoAdicional
			UPDATE Compra.InfoAdicional SET estado = 0 WHERE uniqueId = @uniqueId AND estado = 1

			UPDATE  infoAdd SET infoAdd.idEtiqueta =  temp.idEtiqueta, infoAdd.jsonAdicional = temp.jsonAdicional, infoAdd.estado = 1 
			FROM  Compra.InfoAdicional infoAdd WITH(NOLOCK) 
			INNER JOIN @artInfoAdicional temp ON temp.idInfoAdicional = infoAdd.idInfoAdicional

			INSERT INTO  Compra.InfoAdicional (uniqueId, idArticulo, idEtiqueta, jsonAdicional, fechaRegistro)
			SELECT @uniqueId, idArticulo, idEtiqueta, jsonAdicional, dbo.ufnGetDateEcuador() FROM @artInfoAdicional WHERE idInfoAdicional = 0 

			DELETE FROM Compra.InfoAdicional WHERE estado = 0  AND uniqueId = @uniqueId

            --> Inventario
			IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
				BEGIN
                    
                    DECLARE @idTipoTransaccion  INT ,@idTipoDocumentoIv INT ,@idTransaccion INT

                    SELECT TOP 1 @idTipoDocumentoIv = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'IV'

                    SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = 'E'

                    SELECT TOP 1 @idTransaccion = idTransaccion FROM Inventario.Transaccion WHERE idTipoTransaccion = @idTipoTransaccion AND idTipoDocumento = @idTipoDocumentoIv AND idDocumento = @id

                    --> Transaccion
                    UPDATE Inventario.Transaccion WITH (ROWLOCK)
                       SET fechaEmision = @fechaEmision
                          ,CustomerId   = @customerId
                    WHERE idTransaccion = @idTransaccion

                    UPDATE Inventario.TransaccionDetalle WITH (ROWLOCK) SET estado = 0 WHERE idTransaccion = @idTransaccion

                    IF EXISTS (SELECT 1 FROM @tblDetails WHERE llevaInventario = 1)
				        BEGIN
                             INSERT INTO Inventario.TransaccionDetalle 
                                    (idTransaccion,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,conversion,precioCostoFraccionado,total)
			                 SELECT @idTransaccion,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,conversion,precioCostoFraccionado,precioTotalSinImpuesto
                             FROM @tblDetails 
                             WHERE llevaInventario = 1
                               AND estado = 1

                             EXEC dbo.Transaccion_Handler_Init 'E', 'IV', @id, DEFAULT
                        END
				END

		    --> Contabilidad
		    UPDATE Contabilidad.CuentaPorPagar WITH (ROWLOCK)
               SET idProveedor      =   @idProveedor
		          ,identificacion   =   @identificacion
		          ,fechaEmision     =   @fechaEmision
                  ,fechaVencimiento =   @fechaVencimiento
		          ,importeTotal     =   @importeTotal
                  ,subcategoryId    =   @subcategoryId
            WHERE idDocumento = @id 
              AND codDoc = 'DH'

            UPDATE cp WITH (ROWLOCK)
               SET cp.fechaVencimiento = tc.fechaVencimiento
                  ,cp.cuota            = tc.cuota
            FROM Contabilidad.CuotaPorPagar cp 
            INNER JOIN @tbCuotas            tc ON tc.idCuotaPorPagar = cp.idCuotaPorPagar

		COMMIT TRAN 
        SELECT [Common].[ufnSpResponse]('1','Actualizado Correctamente',DEFAULT)
	END TRY 

	BEGIN CATCH 
		IF (@@TRANCOUNT > 0)
            BEGIN 
			    ROLLBACK TRAN
            END 

		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'CompraHabitual/Update', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	    
        SELECT [Common].[ufnSpResponse]('0','Error en el procedimiento',DEFAULT)
    END CATCH 
END
GO

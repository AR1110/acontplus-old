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
-- Description:	SP para listar las compras que no tiene documento validado por el sri.
-- =============================================
IF OBJECT_ID(N'Compra.Documento_Ingreso_Insert', N'P') IS NOT NULL
DROP PROCEDURE Compra.Documento_Ingreso_Insert
GO
CREATE PROCEDURE Compra.Documento_Ingreso_Insert 
	@idUsuarioRol AS INT
   ,@comprobante AS VARCHAR(MAX)
   ,@detalles AS VARCHAR(MAX)
   ,@impuestos AS VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	
	--=============Datos capturados desde BD===========================
	DECLARE @idEntidad AS INT 
	DECLARE @idUsuario AS INT 

	--============Parametros para el Area Administrativa==============
	DECLARE @idPuntoEmision AS INT
	DECLARE @uniqueId AS VARCHAR(20)
	DECLARE @year AS VARCHAR(50)
	DECLARE @idDocumentoIngreso AS INT 
	DECLARE @secuencial AS INT

	--==============Parametros para el Area de Inventario==============
	DECLARE @inventory AS VARCHAR(5)
	DECLARE @serieComprobante AS VARCHAR(20)

	--==============Parametros para el area de contabilidad============
	DECLARE @idEstadoPago AS INT

	--==========Tablas temporales para la validacion===================

	DECLARE @document AS TABLE(
		 idEstablecimiento INT NOT NULL 
        ,idPuntoEmision INT NOT NULL
        ,idProveedor INT NOT NULL
        ,codDoc VARCHAR(5) DEFAULT 'DH' NOT NULL
		,estab VARCHAR(5) NOT NULL
        ,ptoEmi VARCHAR(5) NOT NULL
        ,fechaEmision DATETIME NOT NULL
        ,totalSinImpuestos NUMERIC (18,5) NOT NULL
        ,importeTotal NUMERIC (18,5) NOT NULL
		,inventory VARCHAR(5) NOT NULL
	)

	DECLARE @detail AS TABLE(
		 idArticulo INT NOT NULL
        ,idMedida INT NOT NULL
        ,idBodega INT NOT NULL
        ,codigoPrincipal VARCHAR(100) NOT NULL
        ,codigoAuxiliar VARCHAR(100) NOT NULL
        ,descripcion VARCHAR(300) NOT NULL
        ,cantidad NUMERIC (18,5)   NOT NULL
        ,precioUnitario NUMERIC (18,5)  NOT NULL
        ,descuento NUMERIC (18,5)  NOT NULL
        ,precioTotalSinImpuesto NUMERIC (18,5)  NOT NULL
        ,codigoPorcentaje VARCHAR(5) NOT NULL
	)

	DECLARE @taxes AS TABLE(
		 codigo VARCHAR(5)  NOT NULL
        ,codigoPorcentaje VARCHAR(5) NOT NULL
        ,tarifa NUMERIC(18,5) NOT NULL
        ,baseImponible NUMERIC(18,5) NOT NULL
        ,valor NUMERIC(18,5) NOT NULL
	)

	BEGIN TRY

		INSERT INTO @document 
		      (idEstablecimiento,idPuntoEmision,idProveedor,estab,ptoEmi,fechaEmision,totalSinImpuestos,importeTotal,inventory)
		SELECT idEstablecimiento,idPuntoEmision,idProveedor,estab,ptoEmi,fechaEmision,totalSinImpuestos,importeTotal,inventory
		FROM OPENJSON(@comprobante)
		WITH (idEstablecimiento INT '$.idEstablecimiento' 
			 ,idPuntoEmision INT '$.idPuntoEmision'
			 ,idProveedor INT '$.idProveedor' 
			 ,estab VARCHAR(5) '$.estab' 
			 ,ptoEmi VARCHAR(5) '$.ptoEmi' 
			 ,fechaEmision DATETIME '$.fechaEmision'
			 ,totalSinImpuestos NUMERIC (18,5) '$.totalSinImpuestos'
			 ,importeTotal NUMERIC (18,5) '$.importeTotal'
			 ,inventory VARCHAR(5) '$.inventory'
		     ) as dt
		
		INSERT INTO @detail
		      (idArticulo,idMedida,idBodega,codigoPrincipal,codigoAuxiliar,descripcion,cantidad,precioUnitario,descuento,precioTotalSinImpuesto,codigoPorcentaje)
		SELECT idArticulo,idMedida,idBodega,codigoPrincipal,codigoAuxiliar,descripcion,cantidad,precioUnitario,descuento,precioTotalSinImpuesto,codigoPorcentaje
		FROM OPENJSON(@detalles)
		WITH (
				idArticulo INT '$.idArticulo'
			   ,idMedida INT '$.idMedida'
			   ,idBodega INT '$.idBodega'
			   ,codigoPrincipal VARCHAR(100) '$.codigoPrincipal'
			   ,codigoAuxiliar VARCHAR(100) '$.codigoAuxiliar'
			   ,descripcion VARCHAR(300) '$.descripcion'
			   ,cantidad NUMERIC (18,5) '$.cantidad'  
			   ,precioUnitario NUMERIC (18,5) '$.precioUnitario' 
			   ,costoNeto NUMERIC(18,5) '$.costoNeto'
			   ,descuento NUMERIC (18,5) '$.descuento' 
			   ,precioTotalSinImpuesto NUMERIC (18,5) '$.precioTotalSinImpuesto' 
			   ,codigoPorcentaje VARCHAR(5) '$.codigoPorcentaje'
		     ) as dt
		
		INSERT INTO @taxes 
		      (codigo,codigoPorcentaje,tarifa,baseImponible,valor)
		SELECT codigo,codigoPorcentaje,tarifa,baseImponible,valor
		FROM OPENJSON(@impuestos)
		WITH (
			    codigo VARCHAR(5) '$.codigo'
			   ,codigoPorcentaje VARCHAR(5) '$.codigoPorcentaje'
		       ,tarifa NUMERIC(18,5) '$.tarifa'
               ,baseImponible NUMERIC(18,5) '$.baseImponible'
               ,valor NUMERIC(18,5) '$.valor'
			 ) as dt

		
		----======================================Recuperar datos de las Tablas===========================================================
		SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		SELECT @idPuntoEmision = idPuntoEmision,@inventory = inventory FROM @document
		
		SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PE'

		SELECT @year = DATEPART(YEAR,dbo.ufnGetDateEcuador())

		SELECT @uniqueId = 'D'+@year+Helper.F_Auto_Sequential(COUNT(*)+1) FROM Compra.Documento_Ingreso WITH(NOLOCK) WHERE DATEPART(YEAR,fechaRegistro) = @year

		SELECT @secuencial = COUNT(*)+1 FROM Compra.Documento_Ingreso WITH(NOLOCK) WHERE idPuntoEmision = @idPuntoEmision

		SELECT @serieComprobante = estab+'-'+ptoEmi+'-'+Helper.F_Auto_Sequential(@secuencial) FROM @document

		
		--==================================Validacion de la informacion============================================================

		IF EXISTS (SELECT 1 FROM Compra.Documento_Ingreso WHERE uniqueId = @uniqueId)
			BEGIN
				SELECT '0' code,'Este Id ya se encuentra registrado' as 'message'
				RETURN 
			END

		IF EXISTS (SELECT 1 FROM Compra.Documento_Ingreso WHERE idPuntoEmision = @idPuntoEmision AND secuencial = @secuencial)
			BEGIN
				SELECT '0' code,'Este secuencial ya se encuentra registrado' as 'message'
				RETURN 
			END 

		IF (SELECT COUNT(*) FROM @detail) = 0
			BEGIN
				SELECT '0' code,'Se encontro un error en el detalle del documento' as 'message'
				RETURN 
			END 

		IF (SELECT COUNT(*) FROM @taxes) = 0
			BEGIN
				SELECT '0' code,'Se encontro un error en los impuestos del documento' as 'message'
				RETURN 
			END 

		SELECT '0' code,'json Comprobabte: '+ @comprobante as 'message'
		RETURN 

		BEGIN TRAN 
			--============================================================Administracion=========================================================================================
			INSERT INTO Compra.Documento_Ingreso
			       (uniqueId,idEstablecimiento,idPuntoEmision,idProveedor,codDoc,estab,ptoEmi,fechaEmision,secuencial,totalSinImpuestos,importeTotal,fechaRegistro,idUsuario,idEntidad)
			SELECT @uniqueId,idEstablecimiento,idPuntoEmision,idProveedor,codDoc,estab,ptoEmi,fechaEmision,@secuencial,totalSinImpuestos,importeTotal,dbo.ufnGetDateEcuador(),@idUsuario,@idEntidad 
			FROM @document
			
			SET @idDocumentoIngreso = @@IDENTITY

			
			INSERT INTO Compra.Documento_Ingreso_Detail
			       (idDocumentoIngreso,idArticulo,idMedida,idBodega,codigoPrincipal,codigoAuxiliar,descripcion,cantidad,precioUnitario,descuento,precioTotalSinImpuesto,codigoPorcentaje)
			SELECT @idDocumentoIngreso,idArticulo,idMedida,idBodega,codigoPrincipal,codigoAuxiliar,descripcion,cantidad,precioUnitario,descuento,precioTotalSinImpuesto,codigoPorcentaje
			FROM @detail
			
			INSERT INTO Compra.Documento_Ingreso_Taxes
                  (idDocumentoIngreso,codigo,codigoPorcentaje,tarifa,baseImponible,valor)
			SELECT @idDocumentoIngreso,codigo,codigoPorcentaje,tarifa,baseImponible,valor
			FROM @taxes
			
			--==============================================================Inventario============================================================================================
			IF @inventory = 'SI'
				BEGIN 
					
					INSERT INTO Inventario.ControlStock
						  (idTipoDocumento,idDocumento,idArticulo,idBodega)
					SELECT idTipoDocumento = 1,d.idDocumentoIngreso,d.idArticulo,d.idBodega 
					FROM Compra.Documento_Ingreso_Detail d WITH (NOLOCK)
					INNER JOIN dbo.Articulo a WITH (NOLOCK) ON a.idArticulo = d.idArticulo
					WHERE d.idDocumentoIngreso = @idDocumentoIngreso AND a.llevaInventario = 1
				END 

			--===========================================================Contabilidad=================================================================================================
			
			INSERT INTO Contabilidad.CuentaPorPagar
                  (idEstablecimiento,idProveedor,idEstadoPago,codDoc,uniqueId,serieComprobante,identificacion,fechaEmision,importeTotal,idEntidad,idUsuario)
		    SELECT idEstablecimiento,d.idProveedor,@idEstadoPago,codDoc,uniqueId,@serieComprobante,numeroIdentificacion,fechaEmision,importeTotal,d.idEntidad,d.idUsuario
		    FROM Compra.Documento_Ingreso d WITH (NOLOCK)
		    INNER JOIN dbo.Proveedor p WITH (NOLOCK) ON p.idProveedor = d.idProveedor 
		    WHERE d.idDocumentoIngreso = @idDocumentoIngreso
			
		COMMIT TRAN 
		SELECT '0' code,'Registrado Correctamente' as 'message'
		RETURN 
	END TRY 

	BEGIN CATCH 
		SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema([token],[method],[errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'DocumentoIngreso/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END
GO

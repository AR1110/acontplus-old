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
   ,@artInfoAdicionales VARCHAR(MAX)
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
	DECLARE @fechaEmision AS DATETIME
	
	--======================Fecha Emision===============================
	DECLARE @fechaEmisionActual AS DATETIME = CAST(dbo.ufnGetDateEcuador() AS DATE) --Fecha Actual	
	DECLARE @fechaEmisionModificada AS DATETIME --fecha emision  front-end
	DEClARE @fechaEmisionTemp AS DATETIME 
	DECLARE @hora AS DATETIME = CAST(dbo.ufnGetDateEcuador() AS TIME)

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
        ,costoNeto NUMERIC (18,5)  NOT NULL
        ,descuento NUMERIC (18,5)  NOT NULL
        ,precioTotalSinImpuesto NUMERIC (18,5)  NOT NULL
        ,codigoPorcentaje VARCHAR(5) NOT NULL
	)

	DECLARE @taxes AS TABLE(
		 idArticulo INT NOT NULL
		,codigo VARCHAR(5)  NOT NULL
        ,codigoPorcentaje VARCHAR(5) NOT NULL
        ,tarifa NUMERIC(18,5) NOT NULL
        ,baseImponible NUMERIC(18,5) NOT NULL
        ,valor NUMERIC(18,5) NOT NULL
	)

	 
	DECLARE @artInfoAdicional AS TABLE (
		idArticulo INT  NOT NULL		
		,idEtiqueta INT  NOT NULL
		,jsonAdicional NVARCHAR(MAX)  NULL
		
	)
	 
	 --SELECT '0'code, 'message' = CAST(@artInfoAdicionales AS VARCHAR(MAX))
		--return
	BEGIN TRY
		SELECT @fechaEmisionModificada = fechaEmision FROM OPENJSON(@comprobante) WITH(fechaEmision DATETIME '$.fechaEmision')	
		
		IF CAST(@fechaEmisionModificada AS DATE) > @fechaEmisionActual
			BEGIN 
				SELECT '0'code, 'La fecha de emisión del documento no puede ser posterior a la fecha actual.' as 'message'
				RETURN 
			END
					
		IF CAST(@fechaEmisionModificada AS DATE) < @fechaEmisionActual
			BEGIN 
				SET @fechaEmisionTemp = DATEADD(dd, DATEDIFF(dd, 0, @fechaEmisionModificada), 0)
			END
		ELSE
			BEGIN 
				SET @fechaEmisionTemp = dbo.ufnGetDateEcuador();
			END 

		--IF @fechaEmisionModificada > dbo.ufnGetDateEcuador()
		--	BEGIN 
		--		SELECT '0'code, 'La fecha de emisión del documento no puede ser posterior a la fecha actual.' as 'message'
		--		RETURN 
		--	END

		--IF @fechaEmisionModificada < dbo.ufnGetDateEcuador()
		--	BEGIN 
		--		SET @fechaEmisionTemp = DATEADD(dd, DATEDIFF(dd, 0, @fechaEmisionModificada), 0)
		--	END
		--ELSE
		--	BEGIN 
		--		SET @fechaEmisionTemp =CAST(CAST(@fechaEmisionModificada AS DATE) AS datetime)  + @hora
		--	END
		
		

		INSERT INTO @document 
		      (idEstablecimiento,idPuntoEmision,idProveedor,estab,ptoEmi,fechaEmision,totalSinImpuestos,importeTotal,inventory)
		SELECT idEstablecimiento,idPuntoEmision,idProveedor,estab,ptoEmi,@fechaEmisionTemp,totalSinImpuestos,importeTotal,inventory
		FROM OPENJSON(@comprobante)
		WITH (idEstablecimiento INT '$.idEstablecimiento' 
			 ,idPuntoEmision INT '$.idPuntoEmision'
			 ,idProveedor INT '$.idProveedor' 
			 ,estab VARCHAR(5) '$.estab' 
			 ,ptoEmi VARCHAR(5) '$.ptoEmi' 
		     --,fechaEmision VARCHAR(150) '$.fechaEmision'
			 ,totalSinImpuestos NUMERIC (18,5) '$.totalSinImpuestos'
			 ,importeTotal NUMERIC (18,5) '$.importeTotal'
			 ,inventory VARCHAR(5) '$.inventory'
		     ) as dt
		
		INSERT INTO @detail
		      (idArticulo,idMedida,idBodega,codigoPrincipal,codigoAuxiliar,descripcion,cantidad,precioUnitario,costoNeto,descuento,precioTotalSinImpuesto,codigoPorcentaje)
		SELECT idArticulo,idMedida,idBodega,codigoPrincipal,codigoAuxiliar,descripcion,cantidad,precioUnitario,costoNeto,descuento,precioTotalSinImpuesto,codigoPorcentaje
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
		      (idArticulo,codigo,codigoPorcentaje,tarifa,baseImponible,valor)
		SELECT idArticulo,codigo,codigoPorcentaje,tarifa,baseImponible,valor
		FROM OPENJSON(@impuestos)
		WITH (
			    idArticulo INT '$.idArticulo'
			   ,codigo VARCHAR(5) '$.codigo'
			   ,codigoPorcentaje VARCHAR(5) '$.codigoPorcentaje'
		       ,tarifa NUMERIC(18,5) '$.tarifa'
               ,baseImponible NUMERIC(18,5) '$.baseImponible'
               ,valor NUMERIC(18,5) '$.valor'
			 ) as dt

		
		INSERT INTO @artInfoAdicional  (idArticulo, idEtiqueta, jsonAdicional)
		SELECT idArticulo, idEtiqueta, jsonAdicional
		FROM OPENJSON(@artInfoAdicionales) WITH (
		  idArticulo int,
		  idEtiqueta int,
		  jsonAdicional nvarchar(max) '$.jsonAdicional' AS JSON		
		) 
		
		
		----======================================Recuperar datos de las Tablas===========================================================
		SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		SELECT TOP 1 @idPuntoEmision = idPuntoEmision,@inventory = inventory,@fechaEmision = fechaEmision FROM @document
		
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


		BEGIN TRAN 
			--============================================================Administracion=========================================================================================
			INSERT INTO Compra.Documento_Ingreso
			       (uniqueId,idEstablecimiento,idPuntoEmision,idProveedor,codDoc,estab,ptoEmi,fechaEmision,secuencial,totalSinImpuestos,importeTotal,fechaRegistro,idUsuario,idEntidad)
			SELECT @uniqueId,idEstablecimiento,idPuntoEmision,idProveedor,codDoc,estab,ptoEmi,fechaEmision,@secuencial,totalSinImpuestos,importeTotal,dbo.ufnGetDateEcuador(),@idUsuario,@idEntidad 
			FROM @document
			
			SET @idDocumentoIngreso = @@IDENTITY

			
			INSERT INTO Compra.Documento_Ingreso_Detail
			       (idDocumentoIngreso,idArticulo,idMedida,idBodega,codigoPrincipal,codigoAuxiliar,descripcion,cantidad,precioUnitario,costoNeto,descuento,precioTotalSinImpuesto,codigoPorcentaje)
			SELECT @idDocumentoIngreso,idArticulo,idMedida,idBodega,codigoPrincipal,codigoAuxiliar,descripcion,cantidad,precioUnitario,costoNeto,descuento,precioTotalSinImpuesto,codigoPorcentaje
			FROM @detail
			
			INSERT INTO Compra.Documento_Ingreso_Taxes
                   (idDocumentoIngreso,idArticulo,codigo,codigoPorcentaje,tarifa,baseImponible,valor)
			SELECT @idDocumentoIngreso,idArticulo,codigo,codigoPorcentaje,tarifa,baseImponible,valor
			FROM @taxes

			---Datos Adicionales de articulo (etiquetas)
			IF EXISTS (SELECT 1 FROM @artInfoAdicional WHERE JSON_QUERY(jsonAdicional, '$') IS NOT NULL)
				BEGIN
					INSERT INTO Compra.InfoAdicional(uniqueId, idArticulo, idEtiqueta, jsonAdicional, fechaRegistro)
					SELECT @uniqueId, idArticulo, idEtiqueta, jsonAdicional, dbo.ufnGetDateEcuador() FROM @artInfoAdicional
				END
			
			
			--==============================================================Inventario============================================================================================
			IF @inventory = 'SI'
				BEGIN
					IF EXISTS (SELECT 1 FROM @detail td INNER JOIN Articulo a WITH (NOLOCK) ON td.idArticulo = a.idArticulo WHERE a.llevaInventario = 1)
						BEGIN 
							DECLARE @idArticulo INT
							DECLARE @idBodega INT
							DECLARE @idMedida INT
							DECLARE @idTarifa INT = NULL
							DECLARE @cantidad NUMERIC(18,2)
							DECLARE @precioUnitario NUMERIC(18,5)
							DECLARE @precioCosto NUMERIC(18,5) 
							DECLARE @total AS NUMERIC(18,5)

							DECLARE cursor_inventory CURSOR LOCAL FOR
							SELECT td.idArticulo, idBodega,td.idMedida,NULL,cantidad,td.precioUnitario - td.descuento,td.precioUnitario - td.descuento,td.precioTotalSinImpuesto
							FROM @detail td 
							INNER JOIN Articulo a WITH (NOLOCK) ON td.idArticulo = a.idArticulo 
							WHERE a.llevaInventario = 1

							OPEN cursor_inventory

							FETCH NEXT FROM cursor_inventory INTO @idArticulo,@idBodega,@idMedida,@idTarifa,@cantidad,@precioUnitario,@precioCosto,@total
							
							WHILE @@FETCH_STATUS = 0
							BEGIN
								--tipo transaccion Entradas
								--tipo documento Liquidacion Compra
								EXEC Inventario.Transaccion_Insert 'E', 'IV', @fechaEmision, @idDocumentoIngreso,  @idArticulo, @idBodega ,@idMedida,@idTarifa,@cantidad,@precioUnitario,@precioCosto,@total, @idUsuario
								FETCH NEXT FROM cursor_inventory INTO @idArticulo,@idBodega,@idMedida, @idTarifa,@cantidad,@precioUnitario,@precioCosto,@total
							END
							CLOSE cursor_inventory
							DEALLOCATE cursor_inventory     
						END
				END

			--===========================================================Contabilidad=================================================================================================
			
			INSERT INTO Contabilidad.CuentaPorPagar
                  (idEstablecimiento,idProveedor,idEstadoPago,codDoc,uniqueId,serieComprobante,identificacion,fechaEmision,importeTotal,idEntidad,idUsuario)
		    SELECT idEstablecimiento,d.idProveedor,@idEstadoPago,codDoc,uniqueId,@serieComprobante,numeroIdentificacion,fechaEmision,importeTotal,d.idEntidad,d.idUsuario
		    FROM Compra.Documento_Ingreso d WITH (NOLOCK)
		    INNER JOIN dbo.Proveedor p WITH (NOLOCK) ON p.idProveedor = d.idProveedor 
		    WHERE d.idDocumentoIngreso = @idDocumentoIngreso
			
		COMMIT TRAN 
		SELECT '1' code,'Registrado Correctamente' as 'message'
		RETURN 
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0'code,'Info: Error en el procedimiento : ' + ERROR_MESSAGE() as 'message'
		INSERT INTO ErroresSistema
								   (token
								   ,method
								   ,errorNumber
								   ,errorSeverity 
								   ,errorState
								   ,errorProcedure
								   ,errorLine
								   ,errorMessage
								   ,errorDate
								   ,idUsuario)
							VALUES
									(NEWID()
									,'/ComprasHabituales/Insert'
									,ERROR_NUMBER()
									,ERROR_SEVERITY()
									,ERROR_STATE()
									,ERROR_PROCEDURE()
									,ERROR_LINE()
									,ERROR_MESSAGE()
									,GETDATE()
									,@idUsuario)
	END CATCH
END
GO

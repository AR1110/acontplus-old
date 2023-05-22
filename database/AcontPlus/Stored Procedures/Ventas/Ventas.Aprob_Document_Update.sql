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
IF OBJECT_ID(N'Ventas.Aprob_Document_Update', N'P') IS NOT NULL
DROP PROCEDURE Ventas.Aprob_Document_Update 
GO
CREATE PROCEDURE Ventas.Aprob_Document_Update 
	@idUsuarioRol INT
   ,@id INT
   ,@comprobante VARCHAR(MAX)
   ,@detalle VARCHAR(MAX)
   ,@historialVenta NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEntidad INT 
	DECLARE @idUsuario INT
	DECLARE @uniqueId VARCHAR(150)
	DECLARE @idTipoDocumento INT 
	DECLARE @fechaEmision DATETIME
	DECLARE @observacion VARCHAR(300)
	DECLARE @identificacionComprador VARCHAR(20)
    DECLARE @codDoc VARCHAR(5) = '01'
    DECLARE @estab VARCHAR(5)
    DECLARE @ptoEmi VARCHAR(5)
    DECLARE @ruc VARCHAR(20)
    DECLARE @ambiente VARCHAR(5)
    DECLARE @tipoEmision VARCHAR(5) = '1'
    DECLARE @secuencial INT
    DECLARE @claveAcceso VARCHAR(50)
	DECLARE @totalSinImpuestos DECIMAL(20,5)
	DECLARE @totalDescuento DECIMAL(20,5)
	DECLARE @totalConImpuestos DECIMAL(20,5)
	DECLARE @propina DECIMAL(20,5)
	DECLARE @importeTotal DECIMAL(20,5)

	DECLARE @tbComprobante  AS TABLE (
		 idCliente INT NOT NULL
		,idPuntoEmision INT NOT NULL
		,fechaEmision VARCHAR(300)
		,codDoc VARCHAR(5) NOT NULL
		,totalSinImpuestos NUMERIC(18,5) NOT NULL
		,totalDescuento NUMERIC(18,5) NOT NULL
		,totalConImpuestos NUMERIC(18,5) NOT NULL
		,propina NUMERIC(18,5) NOT NULL
		,importeTotal NUMERIC(18,5) NOT NULL
		,codigoPorcentaje INT NOT NULL
		,docOrigen VARCHAR(15) NOT NULL
		,observacion VARCHAR(300) NULL
	)

	DECLARE @tbDetalle AS TABLE (
		 orderIndex INT NOT NULL
		,idTarifa INT NOT NULL
		,idArticulo INT NOT NULL
		,idMedida INT NOT NULL
		,idTipoIva INT NOT NULL
		,cantidad NUMERIC(18,5) NOT NULL
		,descripcion VARCHAR(300) NOT NULL
		,precioUnitario NUMERIC(18,5) NOT NULL
		,descuento NUMERIC(18,5) NOT NULL
		,precioTotalSinImpuesto NUMERIC(18,5) NOT NULL
		,codigo INT  NULL
		,codigoPorcentaje INT NOT NULL
		,tarifa NUMERIC(18,5) NOT NULL
		,baseImponible NUMERIC(18,5) NOT NULL
	)

	DECLARE @tblInfoAdicional AS TABLE (
		 nombre VARCHAR(300) NOT NULL
		,valor VARCHAR(300) NOT NULL
	)

	DECLARE @historyInfoAdicional AS TABLE(
		idArticulo INT NOT NULL,
		idInfoAdicional INT NOT NULL
	)

	BEGIN TRY 
		
		INSERT INTO @tbComprobante
		      (idCliente,idPuntoEmision,fechaEmision,codDoc,totalSinImpuestos,totalDescuento,totalConImpuestos,propina,importeTotal,codigoPorcentaje,docOrigen,observacion)
		SELECT idCliente,idPuntoEmision,fechaEmision,codDoc,totalSinImpuestos,totalDescuento,totalConImpuestos,propina,importeTotal,codigoPorcentaje,docOrigen,observacion
		FROM OPENJSON(@comprobante)
		WITH (
				idCliente                   INT '$.idCliente' 
			   ,idPuntoEmision              INT '$.idPuntoEmision' 
			   ,fechaEmision       VARCHAR(300) '$.fechaEmision'
			   ,codDoc               VARCHAR(5) '$.codDoc'
			   ,totalSinImpuestos NUMERIC(18,5) '$.totalSinImpuestos' 
			   ,totalDescuento    NUMERIC(18,5) '$.totalDescuento'
			   ,totalConImpuestos NUMERIC(18,5) '$.totalConImpuestos' 
			   ,propina           NUMERIC(18,5) '$.propina'
			   ,importeTotal      NUMERIC(18,5) '$.importeTotal'
			   ,codigoPorcentaje            INT '$.codigoPorcentaje' 
			   ,docOrigen           VARCHAR(15) '$.docOrigen'
			   ,observacion        VARCHAR(300) '$.observacion'
		     )

		INSERT INTO @tbDetalle 
			  (orderIndex, idTarifa,idArticulo,idMedida, idTipoIva, cantidad,descripcion,precioUnitario,descuento,precioTotalSinImpuesto,codigo,codigoPorcentaje,tarifa,baseImponible)
		SELECT orderIndex, idTarifa,idArticulo,idMedida, idTipoIva, cantidad,descripcion,precioUnitario,descuento,precioTotalSinImpuesto,codigo,codigoPorcentaje,tarifa,baseImponible
		FROM OPENJSON(@detalle)
		WITH (
				orderIndex                       INT '$.orderIndex',
				idTarifa                         INT '$.idTarifa'
			   ,idArticulo                       INT '$.idArticulo'
		       ,idMedida                         INT '$.idMedida' 
			   ,idTipoIva                        INT '$.idTipoIva' 
		       ,cantidad               NUMERIC(18,5) '$.cantidad' 
		       ,descripcion             VARCHAR(300) '$.descripcion' 
		       ,precioUnitario         NUMERIC(18,5) '$.precioUnitario' 
		       ,descuento              NUMERIC(18,5) '$.descuento'
		       ,precioTotalSinImpuesto NUMERIC(18,5) '$.precioTotalSinImpuesto' 
		       ,codigo                           INT '$.codigo' 
		       ,codigoPorcentaje                 INT '$.codigoPorcentaje'
		       ,tarifa                 NUMERIC(18,5) '$.tarifa'
		       ,baseImponible          NUMERIC(18,5) '$.baseImponible'
		     )

		INSERT INTO @historyInfoAdicional SELECT * FROM OPENJSON(@historialVenta)WITH(idArticulo INT, idInfoAdicional INT)

		SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		SELECT TOP 1 @ruc = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad
		SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigo = 'APR'

		SELECT 
			@uniqueId     = uniqueId
		   ,@secuencial   = secuencial 
		   ,@estab        = estab
		   ,@ptoEmi       = ptoEmi
		   ,@ambiente     = ambiente
		   ,@fechaEmision = fechaEmision
		FROM Ventas.Aprob_Document WITH (NOLOCK) WHERE idAprob_Document = @id

		SELECT	
			@observacion             = dt.observacion
		   ,@identificacionComprador = cl.numeroIdentificacion
		   ,@fechaEmision            = dt.fechaEmision
		   ,@totalSinImpuestos       = dt.totalSinImpuestos
		   ,@totalDescuento          = dt.totalDescuento 
		   ,@totalConImpuestos       = dt.totalConImpuestos 
		   ,@propina                 = dt.propina
		   ,@importeTotal            = dt.importeTotal
		FROM @tbComprobante dt
		INNER JOIN dbo.Cliente cl WITH (NOLOCK) ON cl.idCliente = dt.idCliente 
		

		SELECT @claveAcceso = dbo.ufnGeneraClaveAcceso(dbo.AFTDeleteCero(@estab)
													   ,@codDoc
													   ,CAST(@ambiente as nvarchar)
													   ,@tipoEmision
													   ,dbo.AFTConvertDate(@fechaEmision)
													   ,@ruc
													   ,@estab+@ptoEmi
													   ,dbo.AFTAutoComplete(@secuencial))


		IF (SELECT COUNT(*) FROM @tbComprobante) = 0 
			BEGIN
				SELECT '0'code,'Erro en la informacion del comprobante' as 'message'
				RETURN
			END 

		IF  CAST(@fechaEmision AS DATE)  >  CAST(dbo.ufnGetDateEcuador() AS DATE)
			BEGIN 
				SELECT '0'code, 'La fecha de emisión del documento no puede ser posterior a la fecha actual.' as 'message'
				RETURN 
			END

		IF (SELECT COUNT(*) FROM @tbDetalle) = 0 
			BEGIN
				SELECT '0'code,'Erro en la informacion del detalle' as 'message'
				RETURN
			END 

   
		IF @claveAcceso IS NULL
			BEGIN
				SELECT '0'code,'Error critico la clave de Acceso no se genero correctamente' as 'message'
				RETURN 
			END 

		IF EXISTS (SELECT 1 FROM Ventas.Aprob_Document wHERE claveAcceso = @claveAcceso AND idAprob_Document != @id)
			BEGIN
				SELECT '0'code,'Esta clave de acceso ya se encuentra registrada' as 'message'
				RETURN
			END 

		BEGIN TRAN 

			UPDATE Ventas.Aprob_Document SET 
				fechaEmision            = @fechaEmision
			   ,identificacionComprador = @identificacionComprador
			   ,claveAcceso             = @claveAcceso
			   ,totalSinImpuestos       = @totalSinImpuestos
			   ,totalDescuento          = @totalDescuento 
	           ,totalConImpuestos       = @totalConImpuestos 
	           ,propina                 = @propina
	           ,importeTotal            = @importeTotal
			   ,observacion             = @observacion 
			WHERE idAprob_Document = @id

			DELETE FROM Ventas.Aprob_Document_Detailt WHERE uniqueId = @uniqueId

			INSERT INTO Ventas.Aprob_Document_Detailt(
				uniqueId
			   ,codArticulo
			   ,idTarifa
			   ,codMedida
			   ,codigoPrincipal
			   ,codigoAuxiliar
			   ,cantidad
			   ,descripcion
			   ,precioUnitario
			   ,descuento
			   ,precioTotalSinImpuesto
			   ,codigo
			   ,codigoPorcentaje
			   ,tarifa
			   ,baseImponible
			)
			SELECT 
			    @uniqueId
			   ,ar.code_unique
			   ,dt.idTarifa
			   ,me.codigo
			   ,ar.codigo
			   ,ar.codigoAuxiliar
			   ,dt.cantidad
			   ,dt.descripcion
			   ,dt.precioUnitario
			   ,dt.descuento
			   ,dt.precioTotalSinImpuesto
			   ,im.codigo
			   ,ti.codigoPorcentaje
			   ,ti.porcentaje
			   ,dt.precioTotalSinImpuesto
			FROM @tbDetalle dt
			LEFT JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = dt.idArticulo
			LEFT JOIN dbo.TipoIva  ti WITH (NOLOCK) ON ti.idTipoIva  = dt.idTipoIva
			LEFT JOIN dbo.Impuesto im WITH (NOLOCK) ON im.idImpuesto = ti.idImpuesto
			LEFT JOIN dbo.Medida   me WITH (NOLOCK) ON me.idMedida   = dt.idMedida
			 ORDER BY dt.orderIndex ASC 

		---------------------------------------------START-INFO-ADICIONAL-ARTICULO-------------------------------------------
			UPDATE infoAdd  SET estado = 1
			FROM Compra.InfoAdicional infoAdd
			INNER JOIN Ventas.HistoryInfoAdicional h WITH(NOLOCK) ON h.idInfoAdicional = infoAdd.idInfoAdicional
			WHERE h.codDoc ='APR' AND h.idDocumento = @id

			DELETE FROM Ventas.HistoryInfoAdicional WHERE codDoc='APR' AND idDocumento = @id;

			INSERT INTO Ventas.HistoryInfoAdicional(idInfoAdicional, codDoc, idDocumento, secuencial, ptoEmi, estab)
			SELECT idInfoAdicional, 'APR', @id, @secuencial, @ptoEmi, @estab FROM @historyInfoAdicional
			
			UPDATE infoAdd  SET estado = 2 
			FROM Compra.InfoAdicional infoAdd
			INNER JOIN @historyInfoAdicional h ON h.idInfoAdicional = infoAdd.idInfoAdicional
			--------------------------------------------END-INFO-ADICIONAL-ARTICULO------------------------------
			 
			INSERT INTO @tblInfoAdicional
			SELECT j.[key] as nombre, ar.codigo + ' : ' +  STRING_AGG(j.[value], ', ') WITHIN GROUP (ORDER BY j.[value]) AS valor
			FROM Compra.InfoAdicional t WITH (NOLOCK)
			INNER JOIN Ventas.HistoryInfoAdicional h WITH (NOLOCK) ON t.idInfoAdicional = h.idInfoAdicional
			INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = t.idArticulo
			CROSS APPLY OPENJSON(t.jsonAdicional) j
			WHERE h.codDoc = 'APR' AND h.idDocumento = @id
			GROUP BY j.[key],ar.codigo

			
			--informacion Adiciomal--
			DELETE FROM dbo.InfoAdicionalDoc WHERE idComprobante = @id AND idTipoDocumento = @idTipoDocumento

			INSERT INTO dbo.InfoAdicionalDoc (idComprobante,idTipoDocumento,nombre,valor)
									      SELECT @id,@idTipoDocumento,nombre,valor FROM @tblInfoAdicional
			--informacion Adicional--

		COMMIT TRAN 
		SELECT '1'code,'Actualizado Correctamente' as 'message'
		RETURN 
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END
			SELECT '0'code,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() as  'message'
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
					,'/Aprobacion/Update'
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

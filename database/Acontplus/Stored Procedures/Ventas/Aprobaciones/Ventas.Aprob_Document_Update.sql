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
CREATE OR ALTER PROCEDURE Ventas.Aprob_Document_Update @userRoleId INT ,@id INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Globales 
    DECLARE @idTipoDocumento INT ,@idEntidad INT ,@idUsuario INT ,@uniqueId VARCHAR(150) = NEWID()

    -- Data Json
    DECLARE @comprobante VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@infoAdicionalArticulo VARCHAR(MAX) ,@infoAdicional VARCHAR(MAX)

    -->Fact.Elect
    DECLARE @fechaEmision DATETIME2 ,@codDoc VARCHAR(5) ,@estab VARCHAR(5) ,@ptoEmi VARCHAR(5) ,@ruc VARCHAR(20) ,@ambiente VARCHAR(5) ,@secuencial INT ,@claveAcceso VARCHAR(50)

     --> Aprob.ventas
	DECLARE @identificacionComprador VARCHAR(20)

	DECLARE @tbComprobante  AS TABLE (
		 idCliente INT NOT NULL
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
	)

    DECLARE @tbTaxes AS TABLE (
        TaxId INT NOT NULL 
	   ,TaxPercentId INT NOT NULL 
	   ,[Percent] NUMERIC(18,5) NOT NULL
	   ,TaxBase NUMERIC(18,5) NOT NULL
	   ,TaxValue NUMERIC(18,5) NOT NULL
       ,Discount NUMERIC(18,5) NOT NULL
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
        
        SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data Json 
        SELECT @comprobante           = comprobante
              ,@detalles              = detalles
              ,@impuestos             = impuestos
              ,@infoAdicional         = infoAdicional
              ,@infoAdicionalArticulo = infoAdicionalArticulo
        FROM OPENJSON(@json) WITH 
        (
             comprobante           NVARCHAR(MAX) as json
            ,detalles              NVARCHAR(MAX) as json
            ,impuestos             NVARCHAR(MAX) as json
            ,infoAdicional         NVARCHAR(MAX) as json
            ,infoAdicionalArticulo NVARCHAR(MAX) as json
        )

		INSERT INTO @tbComprobante
		      (idCliente,fechaEmision,totalSinImpuestos,totalDescuento,propina,importeTotal,observacion)
		SELECT idCliente,fechaEmision,totalSinImpuestos,totalDescuento,propina,importeTotal,observacion
		FROM OPENJSON(@comprobante)
		WITH (
				idCliente                   INT '$.idCliente' 
			   ,fechaEmision          DATETIME2 '$.fechaEmision'
			   ,totalSinImpuestos NUMERIC(18,5) '$.subTotalSinImpuestos' 
			   ,totalDescuento    NUMERIC(18,5) '$.totalDescuento'
			   ,propina           NUMERIC(18,5) '$.propina'
			   ,importeTotal      NUMERIC(18,5) '$.importeTotal'
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
		       ,codigoPorcentaje                 INT '$.codigoPorcentaje'
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

		INSERT INTO @historyInfoAdicional SELECT * FROM OPENJSON(@infoAdicionalArticulo) WITH (idArticulo INT, idInfoAdicional INT)

        --> Variables
		SELECT TOP 1 @ruc = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad
		
        SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigo = 'APR'

		SELECT @uniqueId     = uniqueId
		      ,@secuencial   = secuencial 
		      ,@estab        = estab
		      ,@ptoEmi       = ptoEmi
		      ,@ambiente     = ambiente
		FROM Ventas.Aprob_Document WITH (NOLOCK) WHERE idAprob_Document = @id

		SELECT @identificacionComprador = cl.numeroIdentificacion
		      ,@fechaEmision            = dt.fechaEmision
		FROM @tbComprobante dt
		INNER JOIN dbo.Cliente cl WITH (NOLOCK) ON cl.idCliente = dt.idCliente 
		

		SELECT @claveAcceso = dbo.ufnGeneraClaveAcceso(dbo.AFTDeleteCero(@estab)
													   ,'01'
													   ,CAST(@ambiente as nvarchar)
													   ,'1'
													   ,dbo.AFTConvertDate(@fechaEmision)
													   ,@ruc
													   ,@estab+@ptoEmi
													   ,dbo.AFTAutoComplete(@secuencial))


		IF (SELECT COUNT(*) FROM @tbComprobante) = 0 
			BEGIN
				SELECT '0'code,'Erro en la informacion del comprobante' as 'message'
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

			UPDATE ap SET 
			    ap.idCliente               = tb.idCliente
               ,ap.fechaEmision            = tb.fechaEmision
			   ,ap.identificacionComprador = @identificacionComprador
			   ,ap.claveAcceso             = @claveAcceso
               ,ap.totalSinImpuestos       = tb.totalSinImpuestos
               ,ap.totalDescuento          = tb.totalDescuento
               ,ap.propina                 = tb.propina
               ,ap.importeTotal            = tb.importeTotal
            FROM Ventas.Aprob_Document ap
			INNER JOIN @tbComprobante tb ON idAprob_Document  = @id

            --> Detalles 
			DELETE FROM Ventas.Aprob_Document_Detailt WHERE uniqueId = @uniqueId

			INSERT INTO Ventas.Aprob_Document_Detailt
                   (uniqueId,idArticulo,idTarifa,idBodega,idTipoIva,idMedida,cantidad,descripcion,precioUnitario,descuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,fechaEmision)
			SELECT @uniqueId,idArticulo,idTarifa,idBodega,idTipoIva,idMedida,cantidad,descripcion,precioUnitario,descuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,fechaEmision
			FROM @tbDetalle 
			ORDER BY orderIndex ASC

            --> Impuestos

            DELETE FROM Ventas.AprobVentasImpuesto WHERE AprobDocumentId = @id 

            INSERT INTO Ventas.AprobVentasImpuesto
                   (AprobDocumentId,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
            SELECT @id             ,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount FROM @tbTaxes

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
		      (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		    SELECT NEWID(),'/Aprobacion/Update',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

	END CATCH 

END
GO

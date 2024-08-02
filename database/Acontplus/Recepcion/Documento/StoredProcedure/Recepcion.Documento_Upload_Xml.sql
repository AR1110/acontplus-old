USE AcontPlus
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
-- Author:		Ivan Fernando Paz
-- Create date: 2023-05-28
-- Description: SP FOR GET DOCS RECEIVED TO DOWNLOAD XML FROM SRI
-- =============================================
--Recepcion.Doc_Service_Get 50

CREATE OR ALTER PROCEDURE Recepcion.Documento_Upload_Xml @idUsuarioRol INT
,@json VARCHAR(1000)
,@codDoc VARCHAR(2)
,@claveAcceso AS VARCHAR(49)
,@versionComp VARCHAR(5)
,@fechaEmision VARCHAR(50)
,@xmlDoc XML
AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Global
    DECLARE @idEntidad INT ,@idUsuario INT

    --> Xml
    DECLARE @fechaAutorizacion VARCHAR(50) ,@xmlQuery XML ,@xmlCompressed VARBINARY(MAX)

    --> Contabilidad
    DECLARE @idProveedor INT ,@CustomerId INT ,@subcategoryId INT ,@idCliente INT ,@idEstadoPago INT  ,@idTipoIdentificacion INT ,@fechaEmisionC DATETIME2

    --> Documento Recibido 
	DECLARE @identificacionReceptor VARCHAR(20) ,@rucReceptor VARCHAR(15) ,@rucEmisor VARCHAR(13) ,@codEstab  VARCHAR(50) ,@idEstablecimiento INT ,@idDocumento INT ,@importeTotal NUMERIC(18,5)

    DECLARE @tbDocumento AS TABLE(
        razonSocialEmisior VARCHAR(300) NOT NULL 
       ,nombreComercial VARCHAR(300) NULL
       ,rucEmisor VARCHAR(13) NOT NULL			        
       ,dirMatriz VARCHAR(300) NOT NULL
       ,estab VARCHAR(25) NOT NULL
       ,comprobante VARCHAR(50) NOT NULL
       ,ptoEmi VARCHAR(25) NOT NULL             
       ,secuencial VARCHAR(25) NOT NULL         
       ,identificacionReceptor VARCHAR(300) NOT NULL
       ,importeTotal NUMERIC(18,5) NOT NULL DEFAULT 0
       ,serieComprobante AS estab + '-' + ptoEmi + '-' + secuencial
       ,tipoEmision VARCHAR(25) DEFAULT 'NORMAL'  
    )

	BEGIN TRY
        --> Informacion General
        SELECT TOP 1 @idUsuario = idUsuario ,@idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

        --> Info Xml
        SELECT @xmlQuery =  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))) 

        SELECT @fechaAutorizacion = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion')))).value('(/autorizacion/fechaAutorizacion)[1]','VARCHAR(49)')

        SELECT @xmlCompressed = COMPRESS(CONVERT(VARBINARY(MAX), @xmlDoc))


        --> Factura 
        IF @codDoc = '01'
			BEGIN
                INSERT INTO @tbDocumento 
                (
                     razonSocialEmisior
                    ,nombreComercial
                    ,rucEmisor
                    ,dirMatriz
                    ,estab
                    ,ptoEmi
                    ,secuencial
                    ,identificacionReceptor
                    ,importeTotal
                    ,comprobante
                )
				SELECT x.y.value('(infoTributaria/razonSocial)[1]','VARCHAR(300)')          as razonSocialEmisor
                      ,x.y.value('(infoTributaria/nombreComercial)[1]','VARCHAR(300)')      as nombreComercial
                      ,x.y.value('(infoTributaria/ruc)[1]','VARCHAR(13)')			        as rucEmisor
                      ,x.y.value('(infoTributaria/dirMatriz)[1]','VARCHAR(300)')            as dirMatriz
                      ,x.y.value('(infoTributaria/estab)[1]','VARCHAR(25)')                 as estab             
                      ,x.y.value('(infoTributaria/ptoEmi)[1]','VARCHAR(25)')                as ptoEmi              
                      ,x.y.value('(infoTributaria/secuencial)[1]','VARCHAR(25)')            as secuencial
                      ,x.y.value('(infoFactura/identificacionComprador)[1]','VARCHAR(300)') as identificacionComprador
                      ,x.y.value('(infoFactura/importeTotal)[1]','NUMERIC(18,5)')			as importeTotal
                      ,'Factura'
                FROM @xmlQuery.nodes('//factura') x(y)
			END

        --> Devolucion
		IF @codDoc = '04'
			BEGIN
                INSERT INTO @tbDocumento 
                (
                     razonSocialEmisior
                    ,nombreComercial
                    ,rucEmisor
                    ,dirMatriz
                    ,estab
                    ,ptoEmi
                    ,secuencial
                    ,identificacionReceptor
                    ,importeTotal
                    ,comprobante
                )
                SELECT x.y.value('(infoTributaria/razonSocial)[1]','VARCHAR(300)')              as razonSocialEmisor
                      ,x.y.value('(infoTributaria/nombreComercial)[1]','VARCHAR(300)')          as nombreComercial
                      ,x.y.value('(infoTributaria/ruc)[1]','VARCHAR(13)')			            as rucEmisor
                      ,x.y.value('(infoTributaria/dirMatriz)[1]','VARCHAR(300)')                as dirMatriz
                      ,x.y.value('(infoTributaria/estab)[1]','VARCHAR(25)')                     as estab
                      ,x.y.value('(infoTributaria/ptoEmi)[1]','VARCHAR(25)')                    as ptoEmi
                      ,x.y.value('(infoTributaria/secuencial)[1]','VARCHAR(25)')                as secuencial
                      ,x.y.value('(infoNotaCredito/identificacionComprador)[1]','VARCHAR(300)') as identificacionComprador
                      ,x.y.value('(infoNotaCredito/valorModificacion)[1]','NUMERIC(18,5)')      as importeTotal
                      ,'Notas de Crédito'
                FROM @xmlQuery.nodes('//notaCredito') x(y)
			END

        --> Retenciones
		IF @codDoc = '07'
			BEGIN
                
                INSERT INTO @tbDocumento 
                (
                     razonSocialEmisior
                    ,nombreComercial
                    ,rucEmisor
                    ,dirMatriz
                    ,estab
                    ,ptoEmi
                    ,secuencial
                    ,identificacionReceptor
                    ,comprobante
                )
                SELECT x.y.value('(infoTributaria/razonSocial)[1]','VARCHAR(300)')                     as razonSocialEmisor
                      ,x.y.value('(infoTributaria/nombreComercial)[1]','VARCHAR(300)')                 as nombreComercial
                      ,x.y.value('(infoTributaria/ruc)[1]','VARCHAR(13)')			                   as rucEmisor
                      ,x.y.value('(infoTributaria/dirMatriz)[1]','VARCHAR(300)')                       as dirMatriz
                      ,x.y.value('(infoTributaria/estab)[1]','VARCHAR(25)')                            as estab
                      ,x.y.value('(infoTributaria/ptoEmi)[1]','VARCHAR(25)')                           as ptoEmi
                      ,x.y.value('(infoTributaria/secuencial)[1]','VARCHAR(25)')                       as secuencial
                      ,x.y.value('(infoCompRetencion/identificacionSujetoRetenido)[1]','VARCHAR(300)') as identificacionComprador
                      ,'Comprobante de Retención'
                FROM @xmlQuery.nodes('//comprobanteRetencion') x(y)

                IF @versionComp = '2.0.0'
                    BEGIN
                        SELECT @importeTotal = SUM(T.C.value('(valorRetenido)[1]', 'NUMERIC(18,5)')) 
                        FROM @xmlQuery.nodes('//comprobanteRetencion/docsSustento/docSustento/retenciones/retencion') AS T(C)
                    END 
                     
                IF @versionComp = '1.0.0'
                    BEGIN
                        SELECT @importeTotal = SUM(T.C.value('(valorRetenido)[1]', 'NUMERIC(18,5)')) 
                        FROM @xmlQuery.nodes('//comprobanteRetencion/impuestos/impuesto') AS T(C)
                    END 
			END


        SELECT TOP 1 @identificacionReceptor = identificacionReceptor, @rucEmisor = rucEmisor FROM @tbDocumento

        SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK)  WHERE codigo = 'PE'

        SELECT TOP 1 @rucReceptor = ruc FROM Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad
	
        SELECT @codEstab = codEstab, @subcategoryId = subcategoryId FROM OPENJSON(@json) WITH(codEstab VARCHAR(100), subcategoryId INT)
	
        SELECT TOP 1 @idEstablecimiento = idEstablecimiento FROM Sri.Establecimiento WITH (NOLOCK) WHERE codEstab = @codEstab

        
        --> Validacion de informacion 
        IF @codDoc NOT IN ('01','04','07')
            BEGIN
                SELECT '0' code, 'Comprobante no disponible' as 'message'
                RETURN 
            END 

        IF NOT EXISTS (SELECT 1 FROM @tbDocumento)
            BEGIN
                SELECT '0' code, 'Error en la lectura del xml' as 'message'
                RETURN 
            END

        
        IF EXISTS (SELECT 1 FROM Recepcion.DocumentoRecibido WITH (NOLOCK) WHERE claveAcceso = @claveAcceso)
            BEGIN
                SELECT '0' code, 'El comprobante ya se encuentra importado' as 'message'
                RETURN 
            END 

        IF @rucReceptor != @identificacionReceptor + IIF(LEN(@identificacionReceptor) = 10,'001','')
            BEGIN
                SELECT '0'code,'El comprobante no pertenece al Contribuyente' + ' ' +  @identificacionReceptor as 'message'
                RETURN
            END 

		BEGIN TRAN
			INSERT  INTO Recepcion.DocumentoRecibido
                   (idEstablecimiento, codEstab,comprobante,codDoc, serieComprobante,rucEmisor,razonSocialEmisior,fechaEmision,fechaAutorizacion,tipoEmision,identificacionReceptor,claveAcceso,numeroAutorizacion,importeTotal,xmlCompressed,versionComp,idUsuario,fechaRegistro,downloaded,subcategoryId)
			SELECT @idEstablecimiento,@codEstab,comprobante,@codDoc,serieComprobante,rucEmisor,razonSocialEmisior,@fechaEmision,@fechaAutorizacion,tipoEmision,identificacionReceptor,@claveAcceso,@claveAcceso,importeTotal,@xmlCompressed, @versionComp,@idUsuario,dbo.ufnGetDateEcuador(),'DE',@subcategoryId
            FROM @tbDocumento

			SET @idDocumento = SCOPE_IDENTITY()

             
            --> Valiration Sri
            IF NOT EXISTS(SELECT 1 FROM Customer.Customer WITH (NOLOCK) WHERE IDCard = LTRIM(RTRIM(@rucEmisor)))
				BEGIN
					INSERT INTO Customer.Customer WITH (ROWLOCK)
                          (IDType,IDCard,BusinessName,TradeName,[Address],SriValidation)
					SELECT '04',rucEmisor,razonSocialEmisior,nombreComercial,dirMatriz, 1 
                    FROM @tbDocumento 

                    SET @customerId = SCOPE_IDENTITY()
				END
			ELSE
				BEGIN 
					SELECT TOP 1 @customerId = ID FROM Customer.Customer WITH (NOLOCK) WHERE IDCard = LTRIM(RTRIM(@rucEmisor))
				END

            --> Procesos Internos de la empresa
			IF @codDoc IN ('01','04')
				BEGIN	
                    --> Proveedor
					IF NOT EXISTS(SELECT 1 FROM Proveedor WITH (NOLOCK) WHERE idEntidad = @idEntidad AND LTRIM(RTRIM(numeroIdentificacion)) = LTRIM(RTRIM(@rucEmisor)))
						BEGIN
                            
                            SELECT TOP 1 @idTipoIdentificacion = idTipoIdentificacion FROM TipoIdentificacion WITH (NOLOCK) WHERE codigoSri = '04'

							INSERT INTO Proveedor WITH (ROWLOCK)
                                   (idTipoIdentificacion,nombreFiscal,nombreComercial,numeroIdentificacion,direccion,idEntidad,CustomerId,validationSri)
							SELECT @idTipoIdentificacion,razonSocialEmisior,nombreComercial,rucEmisor,dirMatriz,@idEntidad,@customerId,1
                            FROM @tbDocumento 

                            SELECT @idProveedor = SCOPE_IDENTITY()
						END
                    ELSE 
                        BEGIN
                            SELECT TOP 1 @idProveedor = idProveedor FROM Proveedor WITH (NOLOCK) WHERE idEntidad = @idEntidad AND LTRIM(RTRIM(numeroIdentificacion)) = LTRIM(RTRIM(@rucEmisor)) 
                        END 

                    --> Contabilidad
                    IF NOT EXISTS (SELECT 1 FROM Contabilidad.CuentaPorPagar WHERE uniqueId = @claveAcceso)
					    BEGIN 
						    INSERT INTO Contabilidad.CuentaPorPagar
							       (idDocumento,idEstablecimiento,codDoc,serieComprobante,idUsuario, idProveedor, idEstadoPago,uniqueId,fechaEmision,importeTotal,idEntidad,subcategoryId)
						    SELECT @idDocumento,@idEstablecimiento,@codDoc,serieComprobante,@idUsuario,@idProveedor,@idEstadoPago,@claveAcceso,@fechaEmision,ISNULL(importeTotal,@importeTotal),@idEntidad,@subcategoryId
						    FROM @tbDocumento
					    END 
				END
				
                --> Cotabilidad Cuentas Por Cobrar
                IF @codDoc = '07'
                    BEGIN
                        --> Cliente
					    IF NOT EXISTS(SELECT 1 FROM dbo.Cliente WITH (NOLOCK) WHERE idEntidad = @idEntidad AND LTRIM(RTRIM(numeroIdentificacion)) = LTRIM(RTRIM(@rucEmisor)))
						    BEGIN

                                SELECT TOP 1 @idTipoIdentificacion = idTipoIdentificacion FROM TipoIdentificacion WITH (NOLOCK) WHERE codigoSri = '04'

							    INSERT INTO dbo.Cliente WITH (ROWLOCK)
                                       (idTipoIdentificacion,nombreFiscal,nombreComercial,numeroIdentificacion,direccion,idEntidad,CustomerId,validationSri)
							    SELECT @idTipoIdentificacion,razonSocialEmisior,nombreComercial,rucEmisor,dirMatriz,@idEntidad,@customerId,1
                                FROM @tbDocumento 

                                SELECT @idCliente = SCOPE_IDENTITY()
						    END
                        ELSE 
                            BEGIN
                                SELECT TOP 1 @idCliente = idCliente FROM dbo.Cliente WITH (NOLOCK) WHERE idEntidad = @idEntidad AND numeroIdentificacion = LTRIM(RTRIM(@rucEmisor)) 
                            END

                        INSERT INTO Contabilidad.CuentaPorCobrar
                               (idCliente,codDoc, fechaEmision, idEstadoPago,idDocumento,secuencial,serieComprobante,importeTotal,idEntidad,idUsuario,fechaRegistro)
                        SELECT @idCliente,@codDoc,@fechaEmision,@idEstadoPago,@idDocumento,secuencial,serieComprobante,@importeTotal,@idEntidad,@idUsuario,GETDATE() 
                        FROM @tbDocumento
                    END 

		COMMIT TRAN
        SELECT '1' code, 'Registrado Exitosamente' as 'message'
	END TRY
	BEGIN CATCH
        IF @@TRANCOUNT > 0
		    BEGIN
			    ROLLBACK TRAN;
		    END

		INSERT INTO ErroresSistema WITH (ROWLOCK)
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/DocumentoService/Update',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE() + @fechaEmision,GETDATE(),@idUsuario

        SELECT '0' code,'Info: Error en el procedimiento ' as 'message'
	END CATCH 

END
GO

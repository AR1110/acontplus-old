USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-02-21
-- Description: sp for update retencion ats
-- =============================================
CREATE OR ALTER PROCEDURE FactElect.RetencionAts_Update @idRol INT
,@id INT
,@infoCompRet VARCHAR(MAX) 
AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> GLOBAL
	DECLARE @idUsuario INT,@idEntidad INT

    --> Facturacion Electronica
	DECLARE @ruc NVARCHAR(100) ,@fechaEmision DATETIME ,@ambiente INT ,@estab VARCHAR(5) ,@ptoEmi VARCHAR(5) ,@claveAcceso NVARCHAR(50) ,@isAutomatic INT ,@uniqueId VARCHAR(150) ,@secuencial INT
           ,@idEstadoServicio INT ,@CustomerId INT 

    --> RetencionAts
	DECLARE @tipoEmision TINYINT = 1 ,@idPuntoEmision INT ,@idTipoDocumento INT ,@idProveedor INT 

			
	DECLARE @tblInfoCompRet AS TABLE(
         idRetencionAts INT NOT NULL
        ,fechaEmision DATETIME2 NOT NULL
		,codEstab VARCHAR(25) NOT NULL
		,estab VARCHAR(5) NOT NULL
		,ptoEmi VARCHAR(5) NOT NULL
		,secuencial VARCHAR(9) NOT NULL
		,contribuyentEspecial VARCHAR(13) NULL
		,obligadoContabilidad VARCHAR(2) NULL
		,tipoIdentificacionSujetoRetenido VARCHAR(2) NULL
		,tipoSujetoRetenido VARCHAR(2) NULL
		,parteRel VARCHAR(2) NOT NULL
		,idCliente INT NULL
		,razonSocialSujetoRetenido VARCHAR(300) NULL
		,identificacionSujetoRetenido VARCHAR(13) NULL
		,periodoFiscal VARCHAR(8) NULL
	) 

	BEGIN TRY
        --> Informacion General
        SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol

        --> Info Json
        INSERT INTO @tblInfoCompRet
              (idRetencionAts,codEstab,estab,ptoEmi,secuencial,fechaEmision,contribuyentEspecial,obligadoContabilidad,tipoIdentificacionSujetoRetenido,tipoSujetoRetenido,parteRel,idCliente,razonSocialSujetoRetenido,identificacionSujetoRetenido,periodoFiscal)
		SELECT @id           ,codEstab,estab,ptoEmi,secuencial,fechaEmision,contribuyentEspecial,obligadoContabilidad,tipoIdentificacionSujetoRetenido,tipoSujetoRetenido,parteRel,idCliente,razonSocialSujetoRetenido,identificacionSujetoRetenido,periodoFiscal
		FROM OPENJSON(@infoCompRet) WITH
        (
             codEstab                         VARCHAR(25)
            ,estab                            VARCHAR(5)
            ,ptoEmi                           VARCHAR(5)
            ,secuencial                       VARCHAR(6)
            ,fechaEmision                     DATETIME2
            ,contribuyentEspecial             VARCHAR(13)
            ,obligadoContabilidad             VARCHAR(2)
            ,tipoIdentificacionSujetoRetenido VARCHAR(2)
            ,tipoSujetoRetenido               VARCHAR(2)
            ,parteRel                         VARCHAR(2)
            ,idCliente                        INT
            ,razonSocialSujetoRetenido        VARCHAR(300)
            ,identificacionSujetoRetenido     VARCHAR(13)
            ,periodoFiscal                    VARCHAR(8)
		)

        --> Recuperacion de Varialbles
        SELECT TOP 1 @ruc = ruc FROM Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

        SELECT TOP 1 @secuencial = secuencial FROM FactElect.RetencionAts WITH (NOLOCK) WHERE idRetencionAts = @id

        SELECT TOP 1 @idPuntoEmision = idPuntoEmision, @ambiente = ambiente ,@fechaEmision = fechaEmision FROM @tblInfoCompRet t INNER JOIN PuntoEmision p WITH (NOLOCK) ON p.codEstab = t.codEstab

        SELECT TOP 1 @idEstadoServicio = idEstadoServicio FROM FactElect.EstadoServicio WITH (NOLOCK) WHERE codigo = 1

        SELECT TOP 1 @idProveedor = idProveedor FROM Proveedor WITH (NOLOCK) WHERE idEntidad = @idEntidad AND LTRIM(RTRIM(numeroIdentificacion)) = (SELECT LTRIM(RTRIM(identificacionSujetoRetenido))  FROM @tblInfoCompRet)

        SELECT TOP 1 @CustomerId = ISNULL(CustomerId,0) FROM dbo.Proveedor WITH (NOLOCK) WHERE idProveedor = @idProveedor

        SELECT TOP 1 @claveAcceso = dbo.ufnGeneraClaveAcceso (
                                                                dbo.AFTDeleteCero(estab)   
			                                                   ,'07'
												               ,CAST(@ambiente as nvarchar)
												               ,CAST(@tipoEmision as nvarchar)                         
			                                                   ,dbo.AFTConvertDate(@fechaEmision)                
			                                                   ,@ruc                                             
			                                                   ,estab+ptoEmi                                                     
			                                                   ,Helper.F_Auto_Sequential(@secuencial)
                                                             ) 
		FROM @tblInfoCompRet 
        
        --> Validaciones 
        IF NOT EXISTS (SELECT 1 FROM @tblInfoCompRet)
			BEGIN
				SELECT '0' code, 'Debe agregar al menos un documento de sustento' as 'message'
				RETURN
			END

        IF NOT EXISTS(SELECT 1 FROM FactElect.RetAtsDocSustento WHERE idRetencionAts = @id)
		    BEGIN
			    SELECT '0' code, 'Ingrese al menos un documento de sustento' as 'message'
			    RETURN
		    END
	
		IF NOT EXISTS(SELECT 1 FROM FactElect.RetAtsImpDocSustento WHERE idRetencionAts = @id)
		    BEGIN
				SELECT '0' code, 'Debe agregar al menos un impuesto a los documentos de sustento' as 'message'
			    RETURN
		    END

		IF NOT EXISTS(SELECT 1 FROM FactElect.RetencionAtsRet WHERE idRetencionAts = @id)
		    BEGIN
				SELECT '0' code, 'Debe agregar al menos una retencion al documento de sustento' as 'message'
			    RETURN
		    END

        IF @idProveedor IS NULL OR @idProveedor = 0
		    BEGIN
			    SELECT '0' code, 'No se encontro proveedor' as 'message'
			    RETURN
		    END

        IF EXISTS (SELECT 1 FROM @tblInfoCompRet WHERE tipoIdentificacionSujetoRetenido = '04' AND LEN(LTRIM(RTRIM(identificacionSujetoRetenido))) != 13)
		    BEGIN
			    SELECT '0' code, 'Revise el numero de identificación del proveedor' as 'message'
			    RETURN
		    END

		IF EXISTS (SELECT 1 FROM @tblInfoCompRet WHERE tipoIdentificacionSujetoRetenido = '05' AND LEN(LTRIM(RTRIM(identificacionSujetoRetenido))) != 10)
			BEGIN
				SELECT '0' code, 'Revise el numero de identificación del proveedor' as 'message'
				RETURN
			END

        IF EXISTS (SELECT 1 FROM [FactElect].[v_DocElectronico] WITH (NOLOCK) WHERE codDoc = '07' AND idDocumento = @id AND codEstado IN (4,3,6))
            BEGIN
                SELECT '0'code, 'El Documento tiene un proceso en el Sri' as 'message'
                RETURN 
            END

		BEGIN TRAN

			UPDATE ret WITH (ROWLOCK)
               SET ret.codEstab                         = t.codEstab
			      ,ret.claveAcceso                      = @claveAcceso 
			      ,ret.estab                            = t.estab
			      ,ret.ptoEmi                           = t.ptoEmi 
			      ,ret.fechaEmision                     = t.fechaEmision
			      ,ret.contribuyentEspecial             = t.contribuyentEspecial
			      ,ret.obligadoContabilidad             = t.obligadoContabilidad
			      ,ret.tipoIdentificacionSujetoRetenido = t.tipoIdentificacionSujetoRetenido
			      ,ret.tipoSujetoRetenido               = t.tipoSujetoRetenido 
			      ,ret.parteRel                         = t.parteRel
			      ,ret.idCliente                        = t.idCliente
			      ,ret.razonSocialSujetoRetenido        = t.razonSocialSujetoRetenido
			      ,ret.identificacionSujetoRetenido     = t.identificacionSujetoRetenido
			      ,ret.periodoFiscal                    = t.periodoFiscal
			      ,ret.idUsuario                        = @idUsuario
			      ,ret.idProveedor                      = @idProveedor
			FROM FactElect.RetencionAts ret
			INNER JOIN @tblInfoCompRet    t on ret.idRetencionAts = t.idRetencionAts

			UPDATE DocumentoElectronico WITH (ROWLOCK)
               SET idPuntoEmision   = @idPuntoEmision
			      ,claveAcceso      = @claveAcceso
			      ,fechaEmision     = @fechaEmision
			      ,idEstadoServicio = @idEstadoServicio
			      ,CustomerId       = @CustomerId
			WHERE idDocumento = @id 
              AND codDoc = '07' 
              AND versionComp = '2.0.0'

            UPDATE Contabilidad.CuentaPorPagar WITH (ROWLOCK)
               SET idProveedor  = @idProveedor
                  ,fechaEmision = @fechaEmision
            WHERE codDoc = '07'
              AND idDocumento = @id

		COMMIT TRAN
        SELECT '1' code, 'Retencion actualizada con exito'  as 'message'
	END TRY
	BEGIN CATCH
	    IF @@TRANCOUNT > 0
		    BEGIN
			    ROLLBACK TRAN;
		    END

		INSERT INTO ErroresSistema WITH (ROWLOCK)
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/RetencionAts/Update',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

        SELECT '0' code,'Info: Error en el procedimiento ' as 'message'
	END CATCH
END
GO

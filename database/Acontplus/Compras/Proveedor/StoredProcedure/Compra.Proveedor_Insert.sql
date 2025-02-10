USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPProveedorPost]    Script Date: 04/14/2023 4:03:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-07-29
-- Description:	SP Para registrar los tipos de personas en el sistema 
-- Modifidied by: Emilio Senguana 
-- =============================================
CREATE OR ALTER PROCEDURE Compra.Proveedor_Insert @userRoleId INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
	DECLARE @idUsuario INT ,@idEntidad INT ,@idProveedor INT ,@payload VARCHAR(MAX)
    
    --> Customer
    DECLARE @customerId INT ,@numeroIdentificacion VARCHAR(15) 


    DECLARE @tbProveedor AS TABLE
    (
         idCiudad INT NULL
        ,idTipoClienteProveedor INT NULL
        ,idTipoEntidad INT NULL
        ,idSubContribuyente INT NULL
        ,idTiempoCredito INT NULL
        ,direccion VARCHAR(300) NULL
        ,telefono VARCHAR(300) NULL
        ,correo VARCHAR(300) NULL

        --> Customer

        ,IdTypeId INT NOT NULL
        ,IdCard VARCHAR(20) UNIQUE NOT NULL
        ,BusinessName VARCHAR(300) NOT NULL
        ,TradeName VARCHAR(300) NOT NULL
        ,SriValidation BIT NOT NULL
    )

	BEGIN TRY 
        
        INSERT INTO @tbProveedor
              (idCiudad,IdTypeId,idTipoClienteProveedor,idTipoEntidad,idSubContribuyente,idTiempoCredito,IdCard,BusinessName,TradeName,direccion,telefono,correo,SriValidation)
        SELECT idCiudad,IdTypeId,idTipoClienteProveedor,idTipoEntidad,idSubContribuyente,idTiempoCredito,IdCard,BusinessName,TradeName,direccion,telefono,correo,SriValidation
        FROM OPENJSON(@json) WITH
        (
            idCiudad               INT 
           ,IdTypeId               INT          '$.idTipoIdentificacion'           
           ,idTipoClienteProveedor INT 
           ,idTipoEntidad          INT 
           ,idSubContribuyente     INT 
           ,idTiempoCredito        INT
           ,IdCard                 VARCHAR(20)  '$.numeroIdentificacion'
           ,BusinessName           VARCHAR(300) '$.nombreFiscal'
           ,TradeName              VARCHAR(300) '$.nombreComercial' 
           ,direccion              VARCHAR(300) 
           ,telefono               VARCHAR(300) 
           ,correo                 VARCHAR(300) 
           ,SriValidation          BIT          '$.validationSri'
        )

        --> Recoger Variables
        SELECT TOP 1 @idUsuario = idUsuario ,@idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        SELECT TOP 1 @numeroIdentificacion = IdCard FROM @tbProveedor

        --> Validaciones
        IF EXISTS(SELECT 1 FROM dbo.Proveedor WITH (NOLOCK) WHERE CustomerId = @customerId AND idEntidad = @idEntidad)
		    BEGIN
			    SELECT  '0'code,'El Ruc: ' + @numeroIdentificacion + ' ya se encuentra registrado'[message]
			    RETURN 
		    END 

        IF NOT EXISTS(SELECT 1 FROM @tbProveedor)
            BEGIN
			    SELECT  '0'code,'Error en la informacion'[message] 
			    RETURN 
		    END

		BEGIN TRAN
			
			IF NOT EXISTS(SELECT 1 FROM Customer.Customer WITH (NOLOCK) WHERE IDCard = LTRIM(RTRIM(@numeroIdentificacion)))
				BEGIN
					INSERT INTO Customer.Customer
                          (IdTypeId,IdCard,BusinessName,TradeName,SriValidation,email,telephone,[Address])
					SELECT IdTypeId,IdCard,BusinessName,TradeName,SriValidation,LTRIM(RTRIM(correo)),LTRIM(RTRIM(telefono)),LTRIM(RTRIM(direccion)) 
                    FROM @tbProveedor

					SET @customerId = @@IDENTITY
				END
			ELSE
				BEGIN 
					SELECT TOP 1 @customerId = Id FROM Customer.Customer WITH (NOLOCK) WHERE IDCard = LTRIM(RTRIM(@numeroIdentificacion))
				END

			INSERT INTO Proveedor 
				  (idCiudad,idTipoClienteProveedor,idTipoEntidad,idSubContribuyente,idTiempoCredito,direccion,telefono,correo,idEntidad,idUsuario ,CustomerId)
			SELECT idCiudad,idTipoClienteProveedor,idTipoEntidad,idSubContribuyente,idTiempoCredito,direccion,telefono,correo,@idEntidad,@idUsuario,@customerId
            FROM @tbProveedor

		    SET @idProveedor = @@IDENTITY

            SET @payload = (SELECT @idProveedor as idProveedor FOR JSON PATH, WITHOUT_ARRAY_WRAPPER )


		COMMIT TRAN 
        SELECT  '1'code,'Registrado exitosamente'[message],@payload as payload
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0
		    BEGIN
			    ROLLBACK TRAN ;
		    END 
		
		INSERT INTO ErroresSistema
			  (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Proveedor/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

        SELECT  '0'code,'Info: Error en el procedimiento'[message] 
	END CATCH 
END

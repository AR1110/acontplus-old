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
    DECLARE @IDType VARCHAR(2) ,@customerId INT ,@numeroIdentificacion VARCHAR(15) ,@idTipoIdentificacion INT

    DECLARE @tbProveedor AS TABLE
    (
         idCiudad INT NULL
        ,idTipoIdentificacion INT NOT NULL
        ,idTipoClienteProveedor INT NULL
        ,idTipoEntidad INT NULL
        ,idSubContribuyente INT NULL
        ,idTiempoCredito INT NULL
        ,numeroIdentificacion VARCHAR(20) UNIQUE NOT NULL
        ,nombreFiscal VARCHAR(300) NOT NULL
        ,nombreComercial VARCHAR(300) NOT NULL
        ,direccion VARCHAR(300) NULL
        ,telefono VARCHAR(300) NULL
        ,correo VARCHAR(300) NULL
        ,validationSri BIT NOT NULL
    )

	BEGIN TRY 
        
        INSERT INTO @tbProveedor
              (idCiudad,idTipoIdentificacion,idTipoClienteProveedor,idTipoEntidad,idSubContribuyente,idTiempoCredito,numeroIdentificacion,nombreFiscal,nombreComercial,direccion,telefono,correo,validationSri)
        SELECT idCiudad,idTipoIdentificacion,idTipoClienteProveedor,idTipoEntidad,idSubContribuyente,idTiempoCredito,numeroIdentificacion,nombreFiscal,nombreComercial,direccion,telefono,correo,validationSri
        FROM OPENJSON(@json) WITH
        (
            idCiudad                     INT '$.idCiudad'
           ,idTipoIdentificacion         INT '$.idTipoIdentificacion' 
           ,idTipoClienteProveedor       INT '$.idTipoClienteProveedor'
           ,idTipoEntidad                INT '$.idTipoEntidad'
           ,idSubContribuyente           INT '$.idSubContribuyente' 
           ,idTiempoCredito              INT '$.idTiempoCredito'
           ,numeroIdentificacion VARCHAR(20) '$.numeroIdentificacion' 
           ,nombreFiscal        VARCHAR(300) '$.nombreFiscal' 
           ,nombreComercial     VARCHAR(300) '$.nombreComercial' 
           ,direccion           VARCHAR(300) '$.direccion' 
           ,telefono            VARCHAR(300) '$.telefono' 
           ,correo              VARCHAR(300) '$.correo' 
           ,validationSri                BIT '$.validationSri'
        )

        --> Recoger Variables
        SELECT TOP 1 @idUsuario = idUsuario ,@idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        SELECT TOP 1 @numeroIdentificacion = numeroIdentificacion ,@idTipoIdentificacion = idTipoIdentificacion FROM @tbProveedor 

        --> Validaciones
        IF EXISTS(SELECT 1 FROM Proveedor WHERE numeroIdentificacion = @numeroIdentificacion and idEntidad = @idEntidad)
		    BEGIN
			    SELECT Common.ufnSpResponse('0','El Ruc: '+ @numeroIdentificacion+ 'ya se encuentra registrado',NULL)
			    RETURN 
		    END 

        IF (SELECT COUNT(*) FROM @tbProveedor) = 0 
            BEGIN
			    SELECT Common.ufnSpResponse('0','Error en la informacion',NULL)
			    RETURN 
		    END

		BEGIN TRAN
			
			IF NOT EXISTS(SELECT 1 FROM Customer.Customer WHERE IDCard = LTRIM(RTRIM(@numeroIdentificacion)))
				BEGIN
					SET @IDType = (SELECT codigoSri FROM TipoIdentificacion t WHERE t.idTipoIdentificacion = @idTipoIdentificacion)

					INSERT INTO Customer.Customer(IDType, IDCard, BusinessName, TradeName, email, telephone, [Address], SriValidation)
					SELECT @IDType, LTRIM(RTRIM(numeroIdentificacion)), LTRIM(RTRIM(nombreFiscal)), LTRIM(RTRIM(nombreComercial)),  LTRIM(RTRIM(correo)), LTRIM(RTRIM(telefono)), LTRIM(RTRIM(direccion)), validationSri FROM @tbProveedor

					SET @customerId = @@IDENTITY
				END
			ELSE
				BEGIN 
					SET @customerId = (SELECT ID FROM Customer.Customer WHERE IDCard = LTRIM(RTRIM(@numeroIdentificacion)))
				END

			INSERT INTO Proveedor 
				   (idCiudad,idTipoIdentificacion,idTipoClienteProveedor,idTipoEntidad,idSubContribuyente,idTiempoCredito,numeroIdentificacion,nombreFiscal,nombreComercial,direccion,telefono,correo,idEntidad,idUsuario ,CustomerId,validationSri)
			SELECT idCiudad,idTipoIdentificacion,idTipoClienteProveedor,idTipoEntidad,idSubContribuyente,idTiempoCredito,numeroIdentificacion,nombreFiscal,nombreComercial,direccion,telefono,correo,@idEntidad,@idUsuario,@customerId,validationSri
            FROM @tbProveedor

		    SET @idProveedor = @@IDENTITY

            SET @payload = (SELECT @idProveedor as idProveedor FOR JSON PATH, WITHOUT_ARRAY_WRAPPER )


		COMMIT TRAN 

        SELECT Common.ufnSpResponse('1','Registrado exitosamente',@payload)
		
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0
		BEGIN
			ROLLBACK TRAN ;
		END 
		SELECT Common.ufnSpResponse('0','Info: Error en el procedimiento', NULL)
		INSERT INTO ErroresSistema
			  (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Proveedor/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
	END CATCH 
END

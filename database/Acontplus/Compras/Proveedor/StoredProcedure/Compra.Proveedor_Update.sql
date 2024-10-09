USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPProveedorUpdate]    Script Date: 04/14/2023 4:10:59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-07-30
-- Description:	SP para acutualizar los datos de la persona 
-- =============================================
CREATE OR ALTER PROCEDURE Compra.Proveedor_Update @userRoleId INT ,@id INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH; 
	
    --> Global
    DECLARE @idUsuario INT

    --> Data Cliente
    DECLARE @IDType VARCHAR(10) ,@idTipoIdentificacion INT ,@numeroIdentificacion NVARCHAR(15) ,@customerId INT ,@nombreFiscal VARCHAR(300) ,@nombreComercial VARCHAR(300)

    DECLARE @tbProveedor AS TABLE
    (
         id INT NOT NULL
        ,idCiudad INT NULL
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
        ,estado BIT NOT NULL
    )


	BEGIN TRY 
        
        INSERT INTO @tbProveedor
               (id,idCiudad,idTipoIdentificacion,idTipoClienteProveedor,idTipoEntidad,idSubContribuyente,idTiempoCredito,numeroIdentificacion,nombreFiscal,nombreComercial,direccion,telefono,correo,validationSri, estado)
        SELECT @id,idCiudad,idTipoIdentificacion,idTipoClienteProveedor,idTipoEntidad,idSubContribuyente,idTiempoCredito,numeroIdentificacion,nombreFiscal,nombreComercial,direccion,telefono,correo,validationSri, estado
        FROM OPENJSON(@json) WITH
        (
            idCiudad               INT 
           ,idTipoIdentificacion   INT  
           ,idTipoClienteProveedor INT 
           ,idTipoEntidad          INT 
           ,idSubContribuyente     INT 
           ,idTiempoCredito        INT 
           ,numeroIdentificacion   VARCHAR(20) 
           ,nombreFiscal           VARCHAR(300) 
           ,nombreComercial        VARCHAR(300) 
           ,direccion              VARCHAR(300) 
           ,telefono               VARCHAR(300) 
           ,correo                 VARCHAR(300) 
           ,validationSri          BIT 
           ,estado                 BIT
        ) 

        --> Recuperando Informacion
        SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        SELECT TOP 1 @idTipoIdentificacion = idTipoIdentificacion 
                    ,@numeroIdentificacion = LTRIM(RTRIM(numeroIdentificacion)) 
                    ,@nombreComercial      = LTRIM(RTRIM(nombreComercial)) 
                    ,@nombreFiscal         = LTRIM(RTRIM(nombreFiscal)) 
        FROM @tbProveedor 

        SELECT TOP 1 @customerId = CustomerId FROM dbo.Proveedor WITH (NOLOCK) WHERE idProveedor = @id

        --> Validacion de informacion 
        IF NOT EXISTS(SELECT 1 FROM @tbProveedor) 
            BEGIN
                SELECT [Common].[ufnSpResponse]('0','Error en la info del proveedor', DEFAULT)
                RETURN
            END

		BEGIN TRAN 
            
            UPDATE Customer.Customer WITH (ROWLOCK) 
                SET BusinessName = LTRIM(RTRIM(@nombreFiscal)) 
                   ,TradeName    = LTRIM(RTRIM(@nombreComercial))
            WHERE Id = @customerId
            
			UPDATE pr SET 
				   pr.idCiudad               = tp.idCiudad
				  ,pr.direccion              = tp.direccion
				  ,pr.telefono               = tp.telefono
				  ,pr.correo                 = tp.correo
				  ,pr.idTipoClienteProveedor = tp.idTipoClienteProveedor
				  ,pr.idTipoEntidad          = tp.idTipoEntidad
				  ,pr.idSubContribuyente     = tp.idSubContribuyente
				  ,pr.idTiempoCredito        = tp.idTiempoCredito
				  ,pr.estado                 = tp.estado
                  ,pr.UpdatedAt              = GETDATE()
                  ,pr.UpdatedByUserId        = @idUsuario
            FROM dbo.Proveedor      pr WITH (ROWLOCK)
            INNER JOIN @tbProveedor tp ON tp.id = pr.idProveedor 
			WHERE idProveedor = @id 

		COMMIT TRAN 
		SELECT Common.ufnSpResponse('1','Actualizado Exitosamente',NULL)
	END TRY 

	BEGIN CATCH
		IF @@TRANCOUNT > 0
		    BEGIN
			    ROLLBACK TRAN ;
		    END 
		
		INSERT INTO ErroresSistema
		       (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Proveedor/Update',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

        SELECT Common.ufnSpResponse('0','Info: Error en el procedimiento', NULL)
	END CATCH 

END

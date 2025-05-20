USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPMovimientoCajaGet]    Script Date: 2/6/2023 9:25:59 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE Contabilidad.Anticipo_Report
	 @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT ,@idEntidad INT ,@idUsuario INT

    --> Filters
    DECLARE @id INT
	
    --> Recuperacion de variables
	SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    --> Reporte  
    IF @tipo = 1
        BEGIN 
            
            SET @tableNames = 'mainDs'

            SELECT TOP 1 @id = id FROM OPENJSON(@json) WITH (id INT)
            
            SELECT a.entidad
		          ,a.establecimiento
		          ,a.ruc
		          ,a.dirEstablecimiento                        as dirMatriz
		          ,a.idAnticipo
		          ,a.estab+ '-'+ dbo.AFTAutoComplete(a.nroDoc) as nroDocumento
		          ,a.fechaEmision
		          ,CAST(a.valor AS numeric(18,2))              as valorTotal
		          ,a.observaciones                             as observacion
		          ,a.numeroIdentificacion                      as identificacionComprador
		          ,a.nombreFiscal                              as cliente
		          ,a.direccionCliente
		          ,a.entidadFinanciera 
		          ,a.estadoDoc  
		          ,'A'                                         as codDoc
		          ,usuario = a.nombreUsuario
	        FROM v_Anticipo a WITH (NOLOCK)
	        WHERE a.idAnticipo = @id

            RETURN 
        END 
END

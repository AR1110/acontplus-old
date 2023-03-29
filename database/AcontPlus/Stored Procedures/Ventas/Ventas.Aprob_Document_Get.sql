USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[Cliente_Get]    Script Date: 12/15/2022 11:21:36 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-10-06
-- Description:	SP para listar los clietes
-- =============================================
--Ventas.Aprob_Document_Get 38,'[]'
IF OBJECT_ID(N'Ventas.Aprob_Document_Get', N'P') IS NOT NULL
DROP PROCEDURE Ventas.Aprob_Document_Get 
GO
CREATE PROCEDURE Ventas.Aprob_Document_Get @idRol INT, @json NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEntidad INT 
	DECLARE @totalRecords INT 
	DECLARE @dataExists CHAR(2)
	DECLARE @bySearch VARCHAR(MAX)

	DECLARE @tipoFecha VARCHAR(10)
    DECLARE @checkBoxFecha BIT 
    DECLARE @checkBoxCliente BIT
    DECLARE @checkBoxEstado BIT 
    DECLARE @checkBoxUsuario BIT
    DECLARE @checkBoxDefault BIT
    DECLARE @codDoc VARCHAR(20)
    DECLARE @codEstab VARCHAR(25) 
    DECLARE @byCliente INT 
    DECLARE @codEstado VARCHAR(5) 
    DECLARE @byUsuario INT 
    DECLARE @dateStart DATETIME 
    DECLARE @dateEnd DATETIME  

	DECLARE @params NVARCHAR(MAX) = '@idEntidad INT,
									 @codEstab  VARCHAR(25),
									 @idCliente INT, 
									 @codEstado VARCHAR(5),
									 @idUsuario INT,
									 @dateStart DATETIME,
									 @dateEnd   DATETIME,
									 @typeDate  NVARCHAR(50)'



	DECLARE @sql NVARCHAR(MAX) = 'SELECT TOP 50 
										 idAprob_Document        = ad.idAprob_Document
										,uniqueId                = ad.uniqueId
										,fechaEmision            = CONVERT(NVARCHAR,FORMAT(ad.fechaEmision, ''dd/MM/yyyy HH:mm''))
										,serie                   = ad.estab+''-''+ad.ptoEmi+''-''+Helper.F_Auto_Sequential(ad.secuencial)
										,identificacionComprador = ad.identificacionComprador
										,razonSocialComprador	 = cl.nombreFiscal
										,total                   = ad.importeTotal
										,codEstado               = ad.codEstado
										,estado			         = ep.descripcion
										,colorFila               = CASE ad.codEstado WHEN ''A'' THEN ''table-danger'' 
																					 WHEN ''APR'' THEN  ''table-success''
																					 ELSE '''' END 
								  FROM Ventas.Aprob_Document ad
								  INNER JOIN dbo.EstadoPago ep ON ep.codigo = ad.codEstado
								  INNER JOIN dbo.Cliente cl ON cl.idCliente = ad.idCliente
								  WHERE ad.idEntidad = @idEntidad '

	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @idRol

	SELECT 
		 @checkBoxFecha   = checkBoxFecha
		,@checkBoxCliente = checkBoxCliente
		,@checkBoxEstado  =  checkBoxEstado
		,@checkBoxUsuario = checkBoxUsuario
		,@checkBoxDefault = checkBoxDefault
		,@codEstab        = codEstab
		,@byCliente       = byCliente
		,@codEstado       = byEstado
		,@byUsuario       = byUsuario
		,@dateStart       = fechaInicio
		,@dateEnd         = fechaFin
		,@tipoFecha       = tipoFecha
	FROM OPENJSON(@json) 
	WITH(checkBoxFecha   BIT         '$.checkBoxFecha'
		,checkBoxCliente BIT         '$.checkBoxCliente'
		,checkBoxEstado  BIT         '$.checkBoxEstado'
		,checkBoxUsuario BIT         '$.checkBoxUsuario'
		,checkBoxDefault BIT         '$.checkBoxDefault'
		,codEstab        VARCHAR(25) '$.codEstab'
		,byCliente       INT         '$.byCliente'
		,byEstado        VARCHAR(5)  '$.byEstado'
		,byUsuario       INT         '$.byUsuario'
		,fechaInicio     DATETIME    '$.fechaInicio'
		,fechaFin        DATETIME    '$.fechaFin'
		,tipoFecha       VARCHAR(50) '$.tipoFecha')


	BEGIN TRY
		--------------------------------------------BUSQUEDA INDIVIDUAL POR PARAMETRO-------------------------------------------------------------------
		IF @checkBoxCliente = 1
			BEGIN
				SET @sql = @sql + ' AND ad.idCliente = @idCliente '
			END 

		IF @checkBoxEstado = 1
			BEGIN
				 SET @sql = @sql + ' AND ad.codEstado = @codEstado'
			END

		IF @checkBoxUsuario = 1
			BEGIN
				SET @sql = @sql + ' AND ad.idUsuario = @idUsuario '
			END 
			
		IF @checkBoxFecha = 1 
			BEGIN
				SET @sql = @sql + ' AND CAST(ad.fechaEmision as date) BETWEEN CAST(@dateStart as date) AND CAST(@dateEnd as date) '
			END

		IF @checkBoxDefault = 1
			BEGIN
				SET @sql = @sql + ' AND CAST(ad.fechaEmision AS DATE) = CAST(dbo.ufnGetDateEcuador() AS DATE) '
			END 

		SET @sql= @sql + ' ORDER BY ad.idAprob_Document DESC '

		EXEC sp_executesql 
			    @sql
			    ,@params 
			    ,@idEntidad    = @idEntidad
				,@codEstab     = @codEstab
				,@idCliente    = @byCliente
				,@codEstado    = @codEstado 
				,@idUsuario    = @byUsuario
				,@dateStart    = @dateStart
				,@dateEnd      = @dateEnd
				,@typeDate     = @tipoFecha				
	
			RETURN 
		END TRY 
	
		BEGIN CATCH 
			SELECT '0'code,'Error en el procedimiento de listar '+ ERROR_MESSAGE() as 'message','Aprobación Comprobante' as 'titleSms'
			RETURN 
		END CATCH



END

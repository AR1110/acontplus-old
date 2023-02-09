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
--[Ventas].[Cliente_Get] 38,'[]'
IF OBJECT_ID(N'Ventas.Aprob_Document_Get', N'P') IS NOT NULL
DROP PROCEDURE Ventas.Aprob_Document_Get 
GO
CREATE PROCEDURE Ventas.Aprob_Document_Get @idRol INT ,@json NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEntidad INT 
	DECLARE @totalRecords INT 
	DECLARE @dataExists CHAR(2)
	DECLARE @bySearch VARCHAR(MAX)
	DECLARE @params NVARCHAR(MAX) = '@idEntidad INT'

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
								  FROM Ventas.Aprob_Document ad
								  INNER JOIN dbo.EstadoPago ep ON ep.codigo = ad.codEstado
								  INNER JOIN dbo.Cliente cl ON cl.idCliente = ad.idCliente
								  WHERE ad.idEntidad = @idEntidad '

	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @idRol


	SET @sql= @sql+'ORDER BY ad.idAprob_Document DESC'
		
	EXEC sp_executesql 
				 @sql
				,@params 
				,@idEntidad = @idEntidad



END

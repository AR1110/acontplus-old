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
IF OBJECT_ID(N'Contabilidad.ControlCaja_Report_Movement', N'P') IS NOT NULL
DROP PROCEDURE Contabilidad.ControlCaja_Report_Movement
GO
CREATE PROCEDURE Contabilidad.ControlCaja_Report_Movement @idRol INT, @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF (OBJECT_ID(N'tempdb..#tableDocument') IS NOT NULL)
	BEGIN
	  DROP TABLE #tableDocument;
	END;

	DECLARE @idEntidad INT
	DECLARE @tipoDoc VARCHAR(5)
	DECLARE @fechaInicio DATETIME 
	DECLARE @fechaFin DATETIME
	

	CREATE TABLE #tableDocument(
		 idUsuario INT NOT NULL
		,idSubEntidadFinanciiera INT NULL
		,idCliente INT NULL
		,idEmpleado INT NULL
		,idUsario INT NOT NULL
		,tipoDoc VARCHAR(5) NOT NULL
		,fechaEmison DATETIME NOT NULL
		,serieComprobante VARCHAR(20) NOT NULL
		,clienteEmpleado VARCHAR(150) NOT NULL
		,valor NUMERIC(18,2) NOT NULL
		,entidadFinenaciera VARCHAR(100) NOT NULL
		,observaciones VARCHAR(300) NULL
		,usuario VARCHAR(150) NOT NULL
    )

	SELECT TOP 1 @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @idRol

	SELECT @tipoDoc     = tipoDoc
	      ,@fechaInicio = fechaInicio
		  ,@fechaFin    = fechaFin
	FROM OPENJSON(@json) 
	WITH (tipoDoc      VARCHAR(10) '$.tipoDoc'
		 ,fechaInicio VARCHAR(100) '$.fechaInicio'
		 ,fechaFin    VARCHAR(100) '$.fechaFin'
	)

	SELECT * 
	FROM dbo.Anticipo an WITH (NOLOCK) 
	WHERE an.idEntidad = @idEntidad 

END
GO

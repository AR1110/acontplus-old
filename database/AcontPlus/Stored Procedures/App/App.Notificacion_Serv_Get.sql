

USE [AcontPlus]

IF OBJECT_ID('App.Notificacion_Serv_Get') IS NOT NULL
	DROP PROCEDURE App.Notificacion_Serv_Get
GO

CREATE PROCEDURE App.Notificacion_Serv_Get @cantidad INT 
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;


	SELECT TOP (@cantidad) * FROM App.Notificacion WHERE estado='NE'



END 
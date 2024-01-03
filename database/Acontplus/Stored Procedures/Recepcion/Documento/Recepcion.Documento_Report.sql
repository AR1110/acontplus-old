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
-- Create date: 2022-07-31
-- Description:	SP PARA LISTAR LOS COMPROBANTES ELECTRONICOS DEL SRI IMPORTADOS
-- =============================================

CREATE OR ALTER PROCEDURE Recepcion.Documento_Report 
     @userRoleId INT
    ,@json VARCHAR(MAX)
	,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global 
    DECLARE @tipo INT ,@idEntidad INT

    --> Sql 
    DECLARE @sql NVARCHAR(MAX), @params NVARCHAR(MAX)

    -->Filter
    DECLARE @codEstab VARCHAR(100) ,@ckFecha BIT ,@fechaInicio DATETIME2 ,@fechaFin DATETIME2 ,@ckRetencion BIT ,@identificacion VARCHAR(20) ,@idUsuario INT

    --> Recuperar Datos
    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    SELECT TOP 1 @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    --> Reporte de Facturas
    IF @tipo = 1
        BEGIN
            
            SET @tableNames = 'dataEntidad,comprobantes'

            SELECT @codEstab       = codEstab
                  ,@ckFecha        = ckFecha
                  ,@fechaInicio    = fechaInicio
                  ,@fechaFin       = fechaFin
                  ,@ckRetencion    = ckRetencion
                  ,@identificacion = identificacion
                  ,@idUsuario      = idUsuario
            FROM OPENJSON(@json) WITH 
            (
                codEstab       VARCHAR(100)
               ,ckFecha        BIT
               ,fechaInicio    DATETIME2
               ,fechaFin       DATETIME2
               ,ckRetencion    BIT
               ,identificacion VARCHAR(20)
               ,idUsuario      INT
            )

            SET @params = '@idEntidad       INT
                          ,@codEstab        VARCHAR(100)
                          ,@fechaInicio     DATETIME2
                          ,@fechaFin        DATETIME2
                          ,@identificacion  VARCHAR(20)
                          ,@idUsuario       INT'

            SET @sql = 'SELECT * FROM 
                        (
                            
                              SELECT es.idEstablecimiento
									,es.nombreComercial
									,serieComprobante 
									,claveAcceso 	
									,FORMAT(CONVERT(DATE,dr.fechaEmision,103),''dd/MM/yyyy'') as fechaEmision
									,rucEmisor 
									,razonSocialEmisior 
									,us.nombreUsuario as usuario
									,CAST(ISNULL(dc.subTotalExento,0) as NUMERIC(18,2)) as subTotalExento 
									,CAST(ISNULL(dc.subTotalNoIva,0) as NUMERIC(18,2))  as subTotalNoIva
									,CAST(ISNULL(dc.subTotal0,0) as NUMERIC(18,2))		as subTotal0
									,CAST(ISNULL(dc.subTotalIva,0) as NUMERIC(18,2))	as subTotalIva
									,CAST(ISNULL(dc.descuento,0) as NUMERIC(18,2))		as descuento
									,CAST(ISNULL(dc.iva,0) as NUMERIC(18,2))   			as iva
									,CAST(ISNULL(dc.totalIce,0) as NUMERIC(18,2))		as totalIce
									,CAST(dr.importeTotal as NUMERIC(18,2))				as importeTotal
									,(
		
									    SELECT TOP 1 rt.estab + ''-'' + rt.ptoEmi + ''-'' + Helper.F_Auto_Sequential(rt.secuencial)
									    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
									    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
									    WHERE ds.numAutDocSustento = dr.claveAcceso
									      AND rt.anuladaSri = 0 

									) as nroRetencion

									,ISNULL((
		
									    SELECT CAST(SUM(ir.valorRetenido) as numeric(18,2))
									    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
									    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
									    INNER JOIN FactElect.RetencionAtsRet   ir WITH (NOLOCK) ON ir.idRetencionAts = rt.idRetencionAts
									    WHERE ds.numAutDocSustento = dr.claveAcceso
	 								      AND rt.anuladaSri = 0 
								          AND ir.codigo = 1

									),0) as retRenta

									,ISNULL((
		
									    SELECT CAST(SUM(ir.valorRetenido) as numeric(18,2))
									    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
									    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
									    INNER JOIN FactElect.RetencionAtsRet   ir WITH (NOLOCK) ON ir.idRetencionAts = rt.idRetencionAts
									    WHERE ds.numAutDocSustento = dr.claveAcceso
	 								      AND rt.anuladaSri = 0 
									      AND ir.codigo = 2

									),0) as retIva
							FROM Recepcion.f_Comprobante_01(@idEntidad) dc
							INNER JOIN Recepcion.DocumentoRecibido      dr WITH (NOLOCK) ON dr.idDocumento  = dc.idDocumento
							INNER JOIN Sri.Establecimiento              es WITH (NOLOCK) ON es.codEstab     = dr.codEstab	
							INNER JOIN dbo.Usuario                      us WITH (NOLOCK) ON us.idUsiaro     = dr.idUsuario

                        ) as dt'

            SELECT entidad as razonSocial 
                  ,rucEmpresa as ruc
                  ,telefono 
                  ,nombreUsuario as usuario
                  ,'Comprobantes Recibidos - Factura' as nombreReporte
                  ,FORMAT(@fechaInicio, 'dd/MM/yyyy') + ' a ' + FORMAT( @fechaFin, 'dd/MM/yyyy') as filtroFechas
            FROM v_usuario
            WHERE idUsuarioRol = @userRoleId

            EXEC sp_executesql @sql
							  ,@params 
							  ,@idEntidad      = @idEntidad
                              ,@codEstab       = @codEstab
                              ,@fechaInicio    = @fechaInicio
                              ,@fechaFin       = @fechaFin
                              ,@identificacion = @identificacion
                              ,@idUsuario      = @idUsuario

            print @sql

            RETURN 
        END 

END
GO



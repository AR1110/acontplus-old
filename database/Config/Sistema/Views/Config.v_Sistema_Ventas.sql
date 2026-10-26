USE [Acontplus]
GO 

CREATE OR ALTER VIEW Config.v_Sistema_Ventas WITH SCHEMABINDING AS (
	SELECT 
		 j.idCliente
		,j.idArticulo
		,ISNULL(j.searchCode, 0)         AS searchCode
		,ISNULL(j.printerAutomatic, 0)  AS printerAutomatic
		,ISNULL(j.payAutomatic, 0)      AS payAutomatic
		,ISNULL(j.multipleVendedor, 0)  AS multipleVendedor
		,ISNULL(j.detailDuplicate, 0)   AS detailDuplicate
		,ISNULL(j.idFormaPagoSri, 0)    AS idFormaPagoSri
		,j.cc
		,j.subject
		,ISNULL(j.configDeuda, 0)        AS configDeuda
		,j.tipoConfig
		,j.interes
		,ISNULL(j.diasGracia, 0)         AS diasGracia
		,ISNULL(j.diasAntesCaducidad, 0) AS diasAntesCaducidad
		,cs.idEntidad
		,cs.idSistema
	FROM Config.Sistema cs
	CROSS APPLY OPENJSON(REPLACE(REPLACE(cs.jsonConfig, '[', ''), ']', ''))
	WITH (
		idCliente              VARCHAR(50)     '$.idCliente',
		idArticulo             VARCHAR(50)     '$.idArticulo',
		searchCode             BIT             '$.searchCode',
		printerAutomatic       BIT             '$.printerAutomatic',
		payAutomatic           BIT             '$.payAutomatic',
		multipleVendedor       BIT             '$.multipleVendedor',
		detailDuplicate        BIT             '$.detailDuplicate',
		idFormaPagoSri         INT             '$.idFormaPagoSri',
		cc                     VARCHAR(MAX)    '$.cc',
		subject                VARCHAR(250)    '$.subject',
		configDeuda            BIT             '$.configInteres',
		tipoConfig             VARCHAR(50)     '$.infoInteres.tipoConfig',
		interes                NUMERIC(18,5)   '$.infoInteres.interes',
		diasGracia             INT             '$.infoInteres.diasGracia',
		diasAntesCaducidad     INT             '$.diasAntesCaducidad'
	) j
	WHERE cs.codConfig = 'CV'
)
GO

use acontplus
go
--select
--(
--SELECT 
--        CONCAT(
--            JSON_VALUE(UserAgent, '$.browser.name'), ' ',
--            JSON_VALUE(UserAgent, '$.browser.version')
--        ) AS browser,
--        CONCAT(
--             JSON_VALUE(UserAgent, '$.os.name'), ' ',
--            JSON_VALUE(UserAgent, '$.os.version')
--        ) AS os
--    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
--)
--FROM Seguridad.LoginHistory lh
--WHERE LEN(JSON_VALUE(UserAgent, '$.browser.name')) > 0 


UPDATE lh SET lh.userAgent = (
SELECT 'acontplus-web' as 'application',
        CONCAT(
            JSON_VALUE(UserAgent, '$.browser.name'), ' ',
            JSON_VALUE(UserAgent, '$.browser.version')
        ) AS browser,
        CONCAT(
             JSON_VALUE(UserAgent, '$.os.name'), ' ',
            JSON_VALUE(UserAgent, '$.os.version')
        ) AS os
    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
)
FROM Seguridad.LoginHistory lh
WHERE LEN(JSON_VALUE(UserAgent, '$.browser.name')) > 0 

GO

UPDATE lh SET lh.userAgent = (
		SELECT 'acontplus-web' as 'application',
        CONCAT(
			JSON_VALUE(
				JSON_VALUE(UserAgent, '$.userAgent'),
				'$.browser.name'
			 ), ' ',
            JSON_VALUE(JSON_VALUE(UserAgent, '$.userAgent'),
				'$.browser.version'
			 )) AS browser,

			 CONCAT(
			JSON_VALUE(
				JSON_VALUE(UserAgent, '$.userAgent'),
				'$.os.name'
			 ), ' ',
            JSON_VALUE(JSON_VALUE(UserAgent, '$.userAgent'),
				'$.os.version')) AS os

			FOR JSON PATH, WITHOUT_ARRAY_WRAPPER		
	),
   ipaddress =  IiF(LEN(JSON_VALUE(UserAgent, '$.ipAddress')) = 13, JSON_VALUE(UserAgent, '$.ipAddress') , NULL) 
FROM 
    seguridad.LoginHistory lh
WHERE 
    LEN(JSON_VALUE(UserAgent, '$.userAgent')) > 0;


--select * from Seguridad.LoginFailed
--select top 10 * from Seguridad.LoginHistory order by Id desc

--select top 10 * from Seguridad.LoginFailed order by Id desc
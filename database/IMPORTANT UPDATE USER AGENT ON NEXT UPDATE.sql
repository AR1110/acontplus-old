use acontplus
go
--select CONCAT(
--    'Browser: ', JSON_VALUE(UserAgent, '$.browser.name'), ' ',
--    JSON_VALUE(UserAgent, '$.browser.version'), ', ',
--    'OS: ', JSON_VALUE(UserAgent, '$.os.name'), ' ',
--    JSON_VALUE(UserAgent, '$.os.version')
--) from seguridad.LoginHistory


--UPDATE seguridad.LoginHistory
--SET UserAgent = CONCAT(
--    'Browser: ', JSON_VALUE(UserAgent, '$.browser.name'), ' ',
--    JSON_VALUE(UserAgent, '$.browser.version'), ', ',
--    'OS: ', JSON_VALUE(UserAgent, '$.os.name'), ' ',
--    JSON_VALUE(UserAgent, '$.os.version')
--); search only values in this format not restaurant

--select * from Seguridad.LoginFailed
select top 10 * from Seguridad.LoginHistory order by Id desc

select top 10 * from Seguridad.LoginFailed order by Id desc
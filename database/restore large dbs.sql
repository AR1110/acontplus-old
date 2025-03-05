--USE master;
--GO
--ALTER DATABASE Acontplus SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
--GO
--DROP DATABASE Acontplus;
--GO

------CREATE DATABASE Acontplus
------GO

--permissions
----ls -l /var/opt/mssql/data/acontplus_20250227.bak

----sudo chown mssql:mssql /var/opt/mssql/data/acontplus_20250227.bak

----sudo chmod 644 /var/opt/mssql/data/acontplus_20250227.bak

--RESTORE FILELISTONLY FROM DISK = '/var/opt/mssql/data/acontplus_20250305.bak';
--GO

--RESTORE DATABASE Acontplus
--FROM DISK = '/var/opt/mssql/data/acontplus_20250305.bak'
--WITH MOVE 'db_a7a679_acontplus_Data' TO '/var/opt/mssql/data/Acontplus_Data.mdf',
--MOVE 'db_a7a679_acontplus_Log' TO '/var/opt/mssql/data/Acontplus_Log.ldf',
--REPLACE;
--GO


--use master
--go

--create database Acontplus

--EXEC [msdb].[dbo].[rds_backup_database]
--@source_db_name='Acontplus',
--@s3_arn_to_backup_to = N'arn:aws:s3:::acontplus/mssql_backups/acontplus_bk_2023-08-01.bak'

 --exec msdb.dbo.rds_restore_database 
 --   @restore_db_name='Acontplus', 
 --   @s3_arn_to_restore_from= N'arn:aws:s3:::acontplus/mssql_backups/acontplus_bk_2023-08-01.bak'

EXEC [msdb].[dbo].[rds_task_status]
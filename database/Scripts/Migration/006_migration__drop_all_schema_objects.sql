use acontplus
go
DECLARE @SchemaName SYSNAME = 'utils';  -- Reemplaza con el nombre real del esquema
DECLARE @sql NVARCHAR(MAX) = '';

-- 1. ELIMINAR CLAVES FORÁNEAS (salientes y entrantes)
SELECT @sql += 'ALTER TABLE [' + SCHEMA_NAME(t.schema_id) + '].[' + t.name + '] DROP CONSTRAINT [' + fk.name + '];' + CHAR(13)
FROM sys.foreign_keys fk
JOIN sys.tables t ON fk.parent_object_id = t.object_id
WHERE SCHEMA_NAME(t.schema_id) = @SchemaName
   OR EXISTS (
       SELECT 1
       FROM sys.tables rt
       WHERE rt.object_id = fk.referenced_object_id
         AND SCHEMA_NAME(rt.schema_id) = @SchemaName
   );

-- 2. ELIMINAR CONSTRAINTS (PK, UQ, CHECK, DEFAULT)
SELECT @sql += 'ALTER TABLE [' + @SchemaName + '].[' + t.name + '] DROP CONSTRAINT [' + c.name + '];' + CHAR(13)
FROM sys.objects c
JOIN sys.tables t ON c.parent_object_id = t.object_id
WHERE SCHEMA_NAME(t.schema_id) = @SchemaName
  AND c.type IN ('D', 'C', 'PK', 'UQ');

-- 3. ELIMINAR VISTAS
SELECT @sql += 'DROP VIEW [' + @SchemaName + '].[' + v.name + '];' + CHAR(13)
FROM sys.views v
WHERE SCHEMA_NAME(v.schema_id) = @SchemaName;

-- 4. ELIMINAR FUNCIONES
SELECT @sql += 'DROP FUNCTION [' + @SchemaName + '].[' + o.name + '];' + CHAR(13)
FROM sys.objects o
WHERE SCHEMA_NAME(o.schema_id) = @SchemaName
  AND o.[type] IN ('FN', 'IF', 'TF');

-- 5. ELIMINAR PROCEDIMIENTOS
SELECT @sql += 'DROP PROCEDURE [' + @SchemaName + '].[' + p.name + '];' + CHAR(13)
FROM sys.procedures p
WHERE SCHEMA_NAME(p.schema_id) = @SchemaName;

-- 6. ELIMINAR SINÓNIMOS
SELECT @sql += 'DROP SYNONYM [' + @SchemaName + '].[' + s.name + '];' + CHAR(13)
FROM sys.synonyms s
WHERE SCHEMA_NAME(s.schema_id) = @SchemaName;

-- 7. ELIMINAR TABLAS
SELECT @sql += 'DROP TABLE [' + @SchemaName + '].[' + t.name + '];' + CHAR(13)
FROM sys.tables t
WHERE SCHEMA_NAME(t.schema_id) = @SchemaName;

-- 8. ELIMINAR TIPOS DEFINIDOS POR USUARIO
SELECT @sql += 'DROP TYPE [' + @SchemaName + '].[' + t.name + '];' + CHAR(13)
FROM sys.types t
WHERE t.is_user_defined = 1
  AND SCHEMA_NAME(t.schema_id) = @SchemaName;

-- 9. ELIMINAR EL ESQUEMA
SET @sql += 'DROP SCHEMA [' + @SchemaName + '];' + CHAR(13);

-- EJECUTAR EL SCRIPT GENERADO
EXEC sp_executesql @sql;

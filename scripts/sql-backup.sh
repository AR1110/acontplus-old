#!/usr/bin/env bash

# --- CONFIGURACIÓN DE ENTORNO ---
# Cron tiene PATH mínimo, agregar rutas necesarias
export PATH="/opt/mssql-tools18/bin:/opt/mssql-tools/bin:/usr/local/bin:/usr/bin:/bin:$PATH"
export LD_LIBRARY_PATH="/opt/mssql/lib:$LD_LIBRARY_PATH"

# --- CONFIGURACIÓN ---
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="/var/opt/mssql/backups"
S3_BUCKET="acontplusbackups"
S3_PREFIX="mssql/prd"
MAX_LOCAL_BACKUPS=1  # Máximo de backups locales a conservar si falla S3

# Credenciales
SQL_USER="sa"
SQL_PASSWORD=""
SQL_SERVER="localhost"

# Bases de datos
DATABASES="Acontplus AcontplusAdmin"

# Log file para cron
LOG_FILE="/var/log/mssql-backup.log"

# Redireccionar salida a log (útil para debugging en cron)
exec 1>>"$LOG_FILE" 2>&1

echo "========================================"
echo "Inicio de ejecución: $(date)"
echo "PATH actual: $PATH"

# Crear directorio si no existe
mkdir -p "$BACKUP_DIR"

# --- VALIDACIÓN DE ESPACIO EN DISCO ---
MIN_SPACE_GB=20  # Mínimo 20GB libres
AVAILABLE_SPACE=$(df -BG "$BACKUP_DIR" | awk 'NR==2 {print $4}' | sed 's/G//')
if [ "$AVAILABLE_SPACE" -lt "$MIN_SPACE_GB" ]; then
    echo "❌ ERROR CRÍTICO: Espacio insuficiente en disco."
    echo "   Disponible: ${AVAILABLE_SPACE}GB | Requerido: ${MIN_SPACE_GB}GB"
    exit 1
fi
echo "✓ Espacio disponible: ${AVAILABLE_SPACE}GB"

# --- VALIDACIÓN DE SQL SERVER ---
if ! pgrep -x sqlservr > /dev/null; then
    echo "❌ ERROR CRÍTICO: SQL Server no está corriendo."
    echo "   Iniciar con: sudo systemctl start mssql-server"
    exit 1
fi
echo "✓ SQL Server está corriendo"

# Validaciones - buscar sqlcmd en ubicaciones comunes
SQLCMD_PATH=""
for path in /opt/mssql-tools18/bin/sqlcmd /opt/mssql-tools/bin/sqlcmd /usr/bin/sqlcmd; do
    if [ -x "$path" ]; then
        SQLCMD_PATH="$path"
        echo "✓ sqlcmd encontrado en: $SQLCMD_PATH"
        break
    fi
done

if [ -z "$SQLCMD_PATH" ]; then
    echo "❌ Error: sqlcmd no encontrado en ubicaciones comunes."
    echo "Intentar: sudo apt-get install mssql-tools18 -y"
    exit 1
fi

if ! command -v aws &> /dev/null; then
    echo "❌ Error: AWS CLI no encontrado."
    exit 1
fi

# --- PROCESO DE BACKUP ---
for DB in $DATABASES; do
  echo "------------------------------------------------"
  echo "📦 Iniciando backup de $DB a las $(date)"

  BACKUP_FILE="$BACKUP_DIR/${DB}-${DATE}.bak"

  # 1. BACKUP NATIVO CON COMPRESIÓN
  # Nota: mssql-tools18 requiere -C (confiar en certificado) o configurar TLS
  "$SQLCMD_PATH" -S "$SQL_SERVER" -U "$SQL_USER" -P "$SQL_PASSWORD" -C \
    -Q "BACKUP DATABASE [$DB] TO DISK = N'$BACKUP_FILE' WITH COMPRESSION, INIT, NAME = '$DB-Full', STATS = 10"

  if [ $? -ne 0 ] || [ ! -f "$BACKUP_FILE" ]; then
      echo "❌ Error: Falló el backup local de $DB. Saltando..."
      continue
  fi

  # Validar tamaño mínimo (detectar backups corruptos)
  BACKUP_SIZE_MB=$(du -m "$BACKUP_FILE" | cut -f1)
  MIN_SIZE_MB=10  # Mínimo 10MB esperado

  if [ "$BACKUP_SIZE_MB" -lt "$MIN_SIZE_MB" ]; then
      echo "⚠️  ADVERTENCIA: Backup sospechosamente pequeño (${BACKUP_SIZE_MB}MB)"
      echo "   Podría estar corrupto. Revisar manualmente."
  fi

  echo "✓ Backup local generado: $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"

  # 2. SUBIDA A S3
  echo "☁️  Subiendo a S3..."
  aws s3 cp "$BACKUP_FILE" "s3://$S3_BUCKET/$S3_PREFIX/$DB/" --storage-class STANDARD_IA

  if [ $? -ne 0 ]; then
      echo "❌ ERROR CRÍTICO: Falló la subida a S3."
      echo "⚠️  El archivo se mantiene local por seguridad: $BACKUP_FILE"

      # LIMPIEZA DE EMERGENCIA: Borrar backups locales viejos para liberar espacio
      echo "🧹 Limpiando backups locales antiguos (manteniendo los últimos $MAX_LOCAL_BACKUPS)..."
      ls -t $BACKUP_DIR/${DB}-*.bak 2>/dev/null | tail -n +$((MAX_LOCAL_BACKUPS + 1)) | xargs -r rm

      echo "⚡ ACCIÓN REQUERIDA: Verifica los permisos de S3 o conectividad de red."
  else
      # 3. LIMPIEZA NORMAL: Subida exitosa, borrar archivo local
      rm "$BACKUP_FILE"
      echo "✓ Subida exitosa y archivo local eliminado."
  fi

  echo "✅ Fin del proceso para $DB"
done

echo "------------------------------------------------"
echo "🎉 Todos los backups finalizados a las $(date)"
echo "========================================"

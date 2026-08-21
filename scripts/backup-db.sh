#!/bin/bash
# Vyroh Database Automated Backup Script
# Dumps PostgreSQL + pgvector data and syncs to S3-compatible storage

set -e

BACKUP_DIR="/var/backups/vyroh"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/vyroh_backup_${TIMESTAMP}.sql.gz"
DB_CONTAINER="vyroh-postgres"
DB_USER="vyroh_user"
DB_NAME="vyroh_db"
S3_BUCKET="${BACKUP_S3_BUCKET:-s3://vyroh-backups}"

mkdir -p "${BACKUP_DIR}"

echo "[$(date)] Starting backup of ${DB_NAME}..."
docker exec -t ${DB_CONTAINER} pg_dump -U ${DB_USER} -d ${DB_NAME} --clean --if-exists | gzip > "${BACKUP_FILE}"

echo "[$(date)] Backup created at ${BACKUP_FILE} ($(du -h ${BACKUP_FILE} | cut -f1))"

# If AWS CLI or MinIO Client is configured, upload to off-site S3 bucket
if command -v aws &> /dev/null; then
    echo "[$(date)] Uploading to S3 bucket ${S3_BUCKET}..."
    aws s3 cp "${BACKUP_FILE}" "${S3_BUCKET}/" --storage-class STANDARD_IA
fi

# Retention: Delete local backups older than 30 days
find "${BACKUP_DIR}" -type f -name "vyroh_backup_*.sql.gz" -mtime +30 -delete
echo "[$(date)] Retention cleanup completed. Backup successful."

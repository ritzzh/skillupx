param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("Full", "Schema")]
    [string]$Mode
)

# -------------------------------------------------
# PostgreSQL Sync Script (Windows PowerShell)
# LOCAL → VPS with two modes:
#   Full   = wipe VPS db + restore full local db
#   Schema = update schema only (keep VPS data)
# -------------------------------------------------

# Local DB Credentials
$LOCAL_DB       = "skillupx"
$LOCAL_USER     = "postgres"
$LOCAL_HOST     = "localhost"
$LOCAL_PASSWORD = "jelly@3!"      # <-- local password

# VPS Credentials
$VPS_IP         = "31.97.233.174"      # <-- VPS IP
$VPS_USER       = "root"
$VPS_DB         = "skillupx"
$VPS_PASSWORD   = "jelly@3!"      # <-- VPS postgres password

# Dump file names
$FULL_DUMP  = "skillupx_full.sql"
$SCHEMA_DUMP = "skillupx_schema.sql"

Write-Host "Selected Mode: $Mode"

# -------------------------------
# STEP 1: Create dumps
# -------------------------------

$env:PGPASSWORD = $LOCAL_PASSWORD

if ($Mode -eq "Full") {
    Write-Host "Creating FULL dump..."
    pg_dump -U $LOCAL_USER -h $LOCAL_HOST -d $LOCAL_DB -f $FULL_DUMP
    $DumpToUpload = $FULL_DUMP
}

if ($Mode -eq "Schema") {
    Write-Host "Creating SCHEMA-ONLY dump..."
    pg_dump -s -U $LOCAL_USER -h $LOCAL_HOST -d $LOCAL_DB -f $SCHEMA_DUMP
    $DumpToUpload = $SCHEMA_DUMP
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Dump failed."
    exit 1
}

# -------------------------------
# STEP 2: Upload dump to VPS
# -------------------------------

Write-Host "Uploading dump to VPS..."
$scpTarget = "${VPS_USER}@${VPS_IP}:/root/$DumpToUpload"
scp $DumpToUpload $scpTarget

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Upload failed."
    exit 1
}

Write-Host "Upload complete."

# -------------------------------
# STEP 3: VPS Restore Logic
# -------------------------------

if ($Mode -eq "Full") {
    Write-Host "Dropping and recreating VPS schema..."
    ssh "$VPS_USER@$VPS_IP" "PGPASSWORD='$VPS_PASSWORD' psql -U postgres -d $VPS_DB -c \"DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO postgres; GRANT ALL ON SCHEMA public TO public;\""
}

Write-Host "Restoring dump on VPS..."
ssh "$VPS_USER@$VPS_IP" "PGPASSWORD='$VPS_PASSWORD' psql -U postgres -d $VPS_DB -f /root/$DumpToUpload"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Restore failed."
    exit 1
}

Write-Host "Sync completed successfully in $Mode mode."


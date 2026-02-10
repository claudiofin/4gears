#!/bin/bash

# 4Gears Handover Setup Script
# Questo script configura il database di produzione per il tuo progetto Expo.

echo "🚀 Inizio configurazione Backend 4Gears..."

# Check dependencies
if ! command -v npx &> /dev/null
then
    echo "❌ Errore: Node/npm non trovato. Installa Node.js prima di continuare."
    exit
fi

# Ask for credentials
echo ""
echo "📝 Inserisci le tue credenziali Supabase:"
read -p "Database URL (Postgres Connection String): " DB_URL
read -p "Supabase Project URL: " SUPA_URL
read -p "Supabase Anon Key: " ANON_KEY

# Update .env
cat <<EOF > .env
DATABASE_URL="$DB_URL"
EXPO_PUBLIC_SUPABASE_URL="$SUPA_URL"
EXPO_PUBLIC_SUPABASE_ANON_KEY="$ANON_KEY"
EXPO_PUBLIC_DATA_SOURCE="REAL"
EOF

echo "✅ File .env creato con successo."

# Run Prisma Push
echo ""
echo "⚙️  Sincronizzazione Schema Database con Prisma..."
npx prisma db push

if [ $? -eq 0 ]; then
    echo "✅ Database sincronizzato correttamente!"
else
    echo "❌ Errore durante la sincronizzazione del database."
    exit 1
fi

# Generate Client
npx prisma generate

echo ""
echo "🎉 Setup completato! Ora puoi lanciare l'app con: npx expo start"
echo "💡 Nota: L'agente AI nel progetto ora ha accesso al tuo database reale."

#!/bin/bash

# Supabase Migration Setup Script
# This script helps configure your project for Supabase

set -e

echo "=================================================="
echo "AuditProp - Neon to Supabase Migration Setup"
echo "=================================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env with your Supabase credentials:"
    echo "   - DATABASE_URL: Get from Supabase Dashboard → Settings → Database"
    echo "   - SESSION_SECRET: Generate a random string or use: $(openssl rand -base64 32)"
    echo ""
else
    echo "✓ .env file already exists"
fi

echo ""
echo "Checking Node.js version..."
node_version=$(node -v)
echo "✓ Node.js $node_version"

echo ""
echo "Installing dependencies..."
npm install

echo ""
echo "=================================================="
echo "Setup Complete!"
echo "=================================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Edit .env with your Supabase credentials:"
echo "   - Go to https://supabase.com/dashboard"
echo "   - Create a new project or select existing one"
echo "   - Get CONNECTION STRING from Settings → Database"
echo "   - Paste into DATABASE_URL in .env"
echo ""
echo "2. Initialize database:"
echo "   npm run db:push"
echo ""
echo "3. Start development server:"
echo "   npm run dev"
echo ""
echo "4. Monitor logs for connection status"
echo ""
echo "For detailed migration guide, see: SUPABASE_MIGRATION_GUIDE.md"
echo ""

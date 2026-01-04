#!/usr/bin/env bash
# Render.com build script

echo "Installing dependencies..."
npm install

echo "Building TypeScript..."
npm run build

echo "Build completed successfully!"

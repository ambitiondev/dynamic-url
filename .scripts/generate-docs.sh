#!/bin/bash
# Generate TypeDoc documentation and organize output

pnpm typedoc

if [ -d "docs" ]; then
  # Rename the main class documentation file
  if [ -f "docs/Class.DynamicURL.md" ]; then
    mv docs/Class.DynamicURL.md docs/api.md
  fi
  
  # Remove duplicate README
  if [ -f "docs/README.md" ]; then
    rm docs/README.md
  fi
  
  # Remove "Defined in:" lines from api.md (must come after rename)
  if [ -f "docs/api.md" ]; then
    sed -i '' '/^Defined in:/d' docs/api.md
    echo "✅ API documentation generated at docs/api.md"
  else
    echo "❌ api.md not found"
    exit 1
  fi
else
  echo "❌ Failed to generate documentation"
  exit 1
fi

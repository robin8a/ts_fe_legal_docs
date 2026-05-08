#!/bin/bash
# Script to update all GraphQL API calls to use the new helper functions

# Find all JSX files and update imports and API calls
find src/components/Admin -name "*.jsx" -type f | while read file; do
  # Skip files we've already updated
  if grep -q "graphqlClient" "$file"; then
    continue
  fi
  
  # Add import if file uses API.graphql
  if grep -q "API.graphql" "$file"; then
    # Add import after existing imports
    sed -i '' '/^import.*aws-amplify/a\
import { graphqlQuery, graphqlMutation } from "../../../utils/graphqlClient";
' "$file"
    
    # Replace API.graphql(graphqlOperation(...)) with graphqlQuery/graphqlMutation
    # This is a simplified version - may need manual review
    perl -i -pe 's/API\.graphql\(\s*graphqlOperation\(([^,]+),\s*\{?\s*([^}]*)\}?\s*\)\s*\)/graphqlQuery($1, { $2 })/g' "$file"
  fi
done

echo "Update complete. Please review the changes."


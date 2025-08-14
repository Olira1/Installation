#!/bin/bash

# Ask for project name
read -p "Enter your project name: " PROJECT_NAME

# Create React + Vite project
npm create vite@latest "$PROJECT_NAME" -- --template react

# Go into project folder
cd "$PROJECT_NAME" || exit

# Install dependencies
npm install

# Install ESLint + Prettier
npm install --save-dev eslint prettier eslint-plugin-react eslint-plugin-react-hooks eslint-config-prettier eslint-plugin-prettier

# Create ESLint config
cat > .eslintrc.json <<EOL
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended"
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["react", "react-hooks", "prettier"],
  "rules": {
    "prettier/prettier": "error"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
EOL

# Create Prettier config
cat > .prettierrc <<EOL
{
  "singleQuote": true,
  "semi": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
EOL

# Ensure vite.config.js only uses React plugin
cat > vite.config.js <<EOL
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
EOL

# Clean default App.jsx content
cat > src/App.jsx <<EOL
function App() {
  return (
    <div>
      {/* Your app starts here */}
    </div>
  )
}

export default App
EOL

# Clean App.css
cat > src/App.css <<EOL
/* Styles for your App component */
EOL

# Clean main CSS file
cat > src/index.css <<EOL
/* Add your global styles here */
EOL

# Remove the Vite + React logo images
rm -f src/assets/*

# Remove vite.svg from public folder
rm -f public/vite.svg

# --- Auto-fix ESLint & Prettier issues ---
echo "🔍 Running ESLint auto-fix..."
npx eslint . --fix || echo "⚠️ ESLint found issues or is not configured properly."

echo "🔍 Running Prettier auto-fix..."
npx prettier --write .

echo "✅ ESLint & Prettier formatting complete."



# Run development server
npm run dev

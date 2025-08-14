import React, { useState, useEffect } from 'react';

const Tried = () => {
  const [copiedStates, setCopiedStates] = useState({
    react: false,
    tailwind: false,
    vite: false
  });

  // Automatic page visit tracking
  useEffect(() => {
    const trackPageVisit = () => {
      try {
        // Get existing stats from localStorage
        const existingStats = localStorage.getItem('triedPageStats');
        let stats = existingStats ? JSON.parse(existingStats) : {
          totalUsers: 0,
          weeklyUsers: 0,
          uniqueUsers: [],
          weeklyData: [],
          lastReset: new Date().toISOString()
        };

        // Generate a unique visitor ID (using IP + user agent + timestamp)
        const visitorId = generateVisitorId();
        
        // Check if this is a new visitor or returning visitor
        const isNewVisitor = !stats.uniqueUsers.some(user => user.visitorId === visitorId);
        
        // Create visit record
        const now = new Date();
        const visitRecord = {
          id: Date.now(),
          visitorId: visitorId,
          name: isNewVisitor ? `Anonymous User ${stats.uniqueUsers.length + 1}` : 'Returning User',
          email: '',
          visitTime: now.toISOString(),
          weekNumber: getWeekNumber(now),
          userAgent: navigator.userAgent,
          timestamp: now.getTime(),
          isNewVisitor: isNewVisitor
        };

        // Update stats
        if (isNewVisitor) {
          stats.totalUsers += 1;
          stats.uniqueUsers.push(visitRecord);
        }
        
        stats.weeklyUsers += 1;
        stats.weeklyData.push(visitRecord);

        // Save updated stats
        localStorage.setItem('triedPageStats', JSON.stringify(stats));
        
        console.log(`Page visit tracked: ${isNewVisitor ? 'New' : 'Returning'} visitor`);
      } catch (error) {
        console.error('Error tracking page visit:', error);
      }
    };

    // Track the visit when component mounts
    trackPageVisit();
  }, []);

  // Helper function to generate a unique visitor ID
  const generateVisitorId = () => {
    const userAgent = navigator.userAgent;
    const screenRes = `${screen.width}x${screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    
    // Create a hash-like ID from visitor characteristics
    const visitorString = `${userAgent}-${screenRes}-${timezone}-${language}`;
    return btoa(visitorString).substring(0, 16);
  };

  // Helper function to get week number
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const copyToClipboard = async (text, dashboard) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [dashboard]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [dashboard]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const CodeBlock = ({ code, language, onCopy, isCopied }) => (
    <div className="relative bg-gray-900 rounded-lg p-4 font-mono text-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-xs uppercase tracking-wide">{language}</span>
        <button
          onClick={onCopy}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
            isCopied
              ? 'bg-green-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
          }`}
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="text-gray-100 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Development Setup Dashboards
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            1.Dura file setup.sh ummadhu. Ergasi code "Create React App" jedhu irra jiru file setup.sh jedhu kessatti copy taasisi.
            <br />
            2. code chmod.sh irra jiru path file setup.sh jedhu irratti terminal kee banun copy godhi.
            <br />
            3. Yoo Tailwind CSS fayyadamu barbaadde immoo code "Install Tailwind" jedhu irra jiru terminal kee iratti copy taasisi.   
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* React Setup Dashboard */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">React Setup</h2>
                <p className="text-gray-600">Complete React installation guide</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1. Create React App</h3>
                <CodeBlock
                  code={`#!/bin/bash

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
`}
                  language="bash"
                  onCopy={() => copyToClipboard(`#!/bin/bash

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
`, 'react')}
                  isCopied={copiedStates.react}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2. chmod.sh</h3>
                <CodeBlock
                  code={`chmod +x setup.sh
./setup.sh
`}
                  language="jsx"
                  onCopy={() => copyToClipboard(`chmod +x setup.sh
./setup.sh
`, 'react')}
                  isCopied={copiedStates.react}
                />
              </div>
            </div>
          </div>

          {/* Tailwind CSS Dashboard */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Tailwind CSS</h2>
                <p className="text-gray-600">Utility-first CSS framework setup</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1. Install Tailwind</h3>
                <CodeBlock
                  code={`# 1️⃣ Install Tailwind CSS and the Vite plugin
npm install tailwindcss @tailwindcss/vite

# 2️⃣ Configure vite.config.js
cat > vite.config.js <<EOL
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
EOL

# 3️⃣ Import Tailwind in your CSS
echo '@import "tailwindcss";' > src/index.css

# 4️⃣ Create Component folder and Tried.jsx (background appears only after click)
mkdir -p src/Component
cat > src/Component/Tried.jsx <<EOL
import { useState } from "react";

export default function Tried() {
  const [clicked, setClicked] = useState(false);

  return (
    <div
      className={
        "flex items-center justify-center h-screen relative transition-all duration-500 " +
        (clicked ? "bg-cover bg-center" : "bg-yellow-300")
      }
      style={
        clicked
          ? { backgroundImage: "url('https://wallpapers.com/images/featured/jesus-in-heaven-pictures-77z32ognn0qg5keo.jpg')" }
          : {}
      }
      onClick={() => setClicked(!clicked)}
    >
      {/* Overlay (only when clicked) */}
      {clicked && <div className="absolute inset-0 bg-yellow-400/30"></div>}

      {/* Centered clickable text */}
      <p
        className={
          "font-bold text-center cursor-pointer text-4xl tracking-wider drop-shadow-lg z-10 transform transition-all duration-500 " +
          (clicked ? "text-white scale-105" : "text-[#1f1d1d] scale-100")
        }
      >
        {clicked
          ? "We have shone a light on darkness through Jesus"
          : "We were dark, and it was scary."}
      </p>
    </div>
  );
}
EOL

# 5️⃣ Integrate Tried.jsx into App.jsx
cat > src/App.jsx <<EOL
import Tried from "./Component/Tried";

export default function App() {
  return (
    <div>
      <Tried />
    </div>
  );
}
EOL

# 6️⃣ Start the development server
npm run dev
`}
                  language="bash"
                  onCopy={() => copyToClipboard(`# 1️⃣ Install Tailwind CSS and the Vite plugin
npm install tailwindcss @tailwindcss/vite

# 2️⃣ Configure vite.config.js
cat > vite.config.js <<EOL
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
EOL

# 3️⃣ Import Tailwind in your CSS
echo '@import "tailwindcss";' > src/index.css

# 4️⃣ Create Component folder and Tried.jsx (background appears only after click)
mkdir -p src/Component
cat > src/Component/Tried.jsx <<EOL
import { useState } from "react";

export default function Tried() {
  const [clicked, setClicked] = useState(false);

  return (
    <div
      className={
        "flex items-center justify-center h-screen relative transition-all duration-500 " +
        (clicked ? "bg-cover bg-center" : "bg-yellow-300")
      }
      style={
        clicked
          ? { backgroundImage: "url('https://wallpapers.com/images/featured/jesus-in-heaven-pictures-77z32ognn0qg5keo.jpg')" }
          : {}
      }
      onClick={() => setClicked(!clicked)}
    >
      {/* Overlay (only when clicked) */}
      {clicked && <div className="absolute inset-0 bg-yellow-400/30"></div>}

      {/* Centered clickable text */}
      <p
        className={
          "font-bold text-center cursor-pointer text-4xl tracking-wider drop-shadow-lg z-10 transform transition-all duration-500 " +
          (clicked ? "text-white scale-105" : "text-[#1f1d1d] scale-100")
        }
      >
        {clicked
          ? "We have shone a light on darkness through Jesus"
          : "We were dark, and it was scary."}
      </p>
    </div>
  );
}
EOL

# 5️⃣ Integrate Tried.jsx into App.jsx
cat > src/App.jsx <<EOL
import Tried from "./Component/Tried";

export default function App() {
  return (
    <div>
      <Tried />
    </div>
  );
}
EOL

# 6️⃣ Start the development server
npm run dev
`, 'tailwind')}
                  isCopied={copiedStates.tailwind}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2. Configure tailwind.config.js</h3>
                <CodeBlock
                  code={`/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`}
                  language="javascript"
                  onCopy={() => copyToClipboard(`/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`, 'tailwind')}
                  isCopied={copiedStates.tailwind}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3. Add to CSS</h3>
                <CodeBlock
                  code={`@tailwind base;
@tailwind components;
@tailwind utilities;`}
                  language="css"
                  onCopy={() => copyToClipboard(`@tailwind base;
@tailwind components;
@tailwind utilities;`, 'tailwind')}
                  isCopied={copiedStates.tailwind}
                />
              </div>
            </div>
          </div>

          {/* Vite Configuration Dashboard */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 7H7v6h6V7z" />
                  <path fillRule="evenodd" d="M7 2a1 1 0 000 2h6a1 1 0 100-2H7zm0 14a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Vite Config</h2>
                <p className="text-gray-600">Fast build tool configuration</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1. Install Vite</h3>
                <CodeBlock
                  code={`npm create vite@latest my-app -- --template react
cd my-app
npm install`}
                  language="bash"
                  onCopy={() => copyToClipboard(`npm create vite@latest my-app -- --template react
cd my-app
npm install`, 'vite')}
                  isCopied={copiedStates.vite}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2. vite.config.js</h3>
                <CodeBlock
                  code={`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})`}
                  language="javascript"
                  onCopy={() => copyToClipboard(`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})`, 'vite')}
                  isCopied={copiedStates.vite}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3. Run Development Server</h3>
                <CodeBlock
                  code={`npm run dev`}
                  language="bash"
                  onCopy={() => copyToClipboard(`npm run dev`, 'vite')}
                  isCopied={copiedStates.vite}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-full">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">All code snippets are ready to copy!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tried;

#!/bin/bash

# React Version Compatibility Test Script
# Tests that @pullreque.st/button can be installed with different React versions

set -e

PACKAGE_DIR=$(pwd)
TEMP_DIR=$(mktemp -d)

echo "🧪 Testing React version compatibility..."
echo "📦 Package directory: $PACKAGE_DIR"
echo "🗂️  Temp directory: $TEMP_DIR"
echo ""

# Build the package first
echo "📦 Building package..."
npm run build
echo ""

# Test React versions
REACT_VERSIONS=("16.8.0" "17.0.0" "18.0.0" "19.0.0")

for VERSION in "${REACT_VERSIONS[@]}"; do
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Testing React $VERSION"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Create test directory
    TEST_DIR="$TEMP_DIR/react-$VERSION"
    mkdir -p "$TEST_DIR"
    cd "$TEST_DIR"

    # Initialize package.json
    cat > package.json << EOF
{
  "name": "react-compat-test-$VERSION",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "$VERSION",
    "react-dom": "$VERSION"
  }
}
EOF

    # Install React
    echo "  📥 Installing React $VERSION..."
    npm install --silent

    # Install our package (using file: protocol to test local build)
    echo "  📥 Installing @pullreque.st/button..."
    npm install "$PACKAGE_DIR" --silent

    # Create a simple test file
    cat > test.js << 'EOF'
// Test that package can be imported
const headless = require('@pullreque.st/button/react/headless');

if (!headless.FeedbackProvider) {
    console.error('❌ FeedbackProvider not found');
    process.exit(1);
}

if (!headless.useFeedback) {
    console.error('❌ useFeedback not found');
    process.exit(1);
}

console.log('✅ All exports found');
EOF

    # Run the test
    echo "  🧪 Testing imports..."
    if node test.js; then
        echo "  ✅ React $VERSION: PASSED"
    else
        echo "  ❌ React $VERSION: FAILED"
        exit 1
    fi

    echo ""
done

# Cleanup
cd "$PACKAGE_DIR"
rm -rf "$TEMP_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All React versions tested successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

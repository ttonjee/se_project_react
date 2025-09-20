#!/bin/bash

# Fix nginx configuration for React SPA
echo "Fixing nginx configuration for SPA routing..."

# Backup the current configuration
sudo cp /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/default.backup

# Fix the try_files directive
sudo sed -i 's/try_files $uri $uri\/ \/index.html =404;/try_files $uri $uri\/ \/index.html;/g' /etc/nginx/sites-enabled/default

# Test nginx configuration
echo "Testing nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "Configuration is valid. Reloading nginx..."
    sudo systemctl reload nginx
    echo "Nginx reloaded successfully!"
    echo ""
    echo "Your React app should now be accessible at https://www.flexx.crabdance.com/"
else
    echo "Configuration test failed. Restoring backup..."
    sudo cp /etc/nginx/sites-enabled/default.backup /etc/nginx/sites-enabled/default
    echo "Backup restored. Please check the configuration manually."
fi

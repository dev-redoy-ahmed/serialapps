# Dokploy Deployment Troubleshooting Guide

## Quick Diagnostic Steps:

### 1. Check if your application starts locally:
```bash
npm run build
npm start
```

### 2. Verify Environment Variables in Dokploy:
Make sure these are set in your Dokploy application environment:
- MONGODB_URI
- NODE_ENV=production
- PORT=3000

### 3. Domain Configuration Checklist:
- [ ] Domain DNS A record points to Dokploy server IP
- [ ] Domain is added in Dokploy application settings
- [ ] SSL certificate is generated and active
- [ ] No conflicting subdomains or redirects

### 4. Common Dokploy Issues:
- [ ] Application container is running (check container logs)
- [ ] Port 3000 is properly exposed
- [ ] Health check endpoint is responding
- [ ] No firewall blocking connections

### 5. Test URLs:
- http://YOUR_DOMAIN (if SSL not working)
- https://YOUR_DOMAIN (preferred)
- https://YOUR_DOMAIN/api/health (health check)
- SERVER_IP:3000 (direct IP access)

### 6. Check Dokploy Logs:
Look for these error patterns:
- "ECONNREFUSED"
- "Cannot connect to MongoDB"
- "Port already in use"
- "Certificate error"
- "DNS resolution failed"

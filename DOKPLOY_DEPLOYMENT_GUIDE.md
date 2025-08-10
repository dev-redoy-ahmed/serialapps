# Dokploy Deployment Guide

## 1. Project Configuration ✅

### package.json
- ✅ Updated start script: `"start": "next start -p 3000 -H 0.0.0.0"`
- ✅ Added Node.js engine requirement: `"node": ">=18"`

### Dockerfile
- ✅ Optimized multi-stage build
- ✅ Uses Node.js 18 Alpine
- ✅ Exposes port 3000
- ✅ Production-ready configuration

### .dockerignore
- ✅ Created to optimize build size
- ✅ Excludes node_modules, .git, .env files

## 2. Dokploy Service Setup

### Repository Settings
- **Repo Source**: Your GitHub repository
- **Dockerfile Path**: `./Dockerfile`
- **Build Context**: `./`
- **Container Port**: `3000`

### Environment Variables
Add these in Dokploy:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://banglaserial:we1we2we3@banglaserial.rkn4sgi.mongodb.net/banglaserial?retryWrites=true&w=majority&appName=banglaserial
PORT=3000
HOSTNAME=0.0.0.0
```

## 3. DNS Configuration

### Domain Setup
1. Go to your domain registrar (Namecheap, GoDaddy, etc.)
2. Add A record:
   ```
   Host: putki.banglaserial.live
   Value: <your-dokploy-server-ip>
   TTL: 300 (5 minutes)
   ```
3. Wait for DNS propagation (check with `nslookup putki.banglaserial.live`)

## 4. Server Firewall Configuration

### Ubuntu/Debian Server
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw reload
```

### Cloud Provider (AWS/DigitalOcean/etc.)
- Allow inbound traffic on ports 80 and 443
- Configure security groups/firewall rules

## 5. HTTPS Setup in Dokploy

1. Go to your service → **Domain settings**
2. Add domain: `putki.banglaserial.live`
3. Enable **HTTPS/Let's Encrypt**
4. **Redeploy** the service

## 6. Deployment Process

1. **Push code** to your main branch
2. **Dokploy builds** Docker image from repository
3. **Container runs** on port 3000
4. **Reverse proxy** maps 80/443 → 3000
5. **HTTPS certificate** installed automatically
6. **App accessible** via `https://putki.banglaserial.live`

## 7. Testing After Deployment

### On Server
```bash
# Check if app responds inside container
curl -I http://127.0.0.1:3000

# Check proxy listens on HTTP/HTTPS
ss -tulpn | grep -E ':80|:443'
```

### From External
```bash
curl -I http://putki.banglaserial.live
curl -I https://putki.banglaserial.live
```

## 8. Health Check

Your app has a health check endpoint at `/api/health`. Configure Dokploy to use this for health monitoring.

## 9. Troubleshooting

### Common Issues:
- ❌ **Connection Refused**: Check firewall ports 80/443
- ❌ **DNS Issues**: Verify A record points to correct IP
- ❌ **Container Not Starting**: Check environment variables
- ❌ **Build Failures**: Verify Dockerfile and dependencies

### Debug Commands:
```bash
# Check container logs in Dokploy
# Verify DNS resolution
nslookup putki.banglaserial.live

# Test local container access
curl -I http://127.0.0.1:3000/api/health
```

## 10. Production Checklist

- ✅ Package.json configured for production
- ✅ Dockerfile optimized
- ✅ Environment variables set
- ✅ DNS A record configured
- ✅ Firewall ports opened
- ✅ HTTPS enabled in Dokploy
- ✅ Health check endpoint available
- ✅ .dockerignore created

## Next Steps

1. Push these changes to GitHub
2. Configure Dokploy service with above settings
3. Set up DNS A record
4. Deploy and test!

Your app should be accessible at: `https://putki.banglaserial.live`
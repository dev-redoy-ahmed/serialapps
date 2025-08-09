// Simple test endpoint to verify server is reachable
export default function handler(req, res) {
  const serverInfo = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: req.headers,
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
    hostname: process.env.HOSTNAME,
    cloudflare: {
      connecting_ip: req.headers['cf-connecting-ip'],
      ray_id: req.headers['cf-ray'],
      visitor: req.headers['cf-visitor']
    }
  };

  res.status(200).json(serverInfo);
}

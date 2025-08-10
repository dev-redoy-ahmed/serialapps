export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({
      ok: true,
      status: 'healthy',
      time: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 3000,
      hostname: process.env.HOSTNAME || 'localhost'
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

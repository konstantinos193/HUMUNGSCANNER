// pages/api/image-proxy.js
export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).send('Missing url');
    const response = await fetch(url);
    if (!response.ok) return res.status(500).send('Failed to fetch image');
    res.setHeader('Content-Type', response.headers.get('content-type'));
    response.body.pipe(res);
  }
// Vercel Serverless Function: Cloud Incidents Sync Engine

let cloudIncidents = [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, incidents: cloudIncidents });
  }

  if (req.method === 'POST') {
    const { incident, incidents } = req.body || {};
    if (Array.isArray(incidents)) {
      cloudIncidents = incidents;
    } else if (incident) {
      const idx = cloudIncidents.findIndex(i => i.id === incident.id);
      if (idx >= 0) {
        cloudIncidents[idx] = incident;
      } else {
        cloudIncidents.unshift(incident);
      }
    }
    return res.status(200).json({ success: true, incidents: cloudIncidents });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}

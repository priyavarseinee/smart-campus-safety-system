// Vercel Serverless Function: Cloud Student Registry & Password Sync Engine

let cloudStudents = null;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, students: cloudStudents });
  }

  if (req.method === 'POST') {
    const { student, students } = req.body || {};
    if (Array.isArray(students)) {
      cloudStudents = students;
    } else if (student && cloudStudents) {
      const idx = cloudStudents.findIndex(s => s.regNo.toLowerCase() === student.regNo.toLowerCase());
      if (idx >= 0) {
        cloudStudents[idx] = { ...cloudStudents[idx], ...student };
      } else {
        cloudStudents.push(student);
      }
    }
    return res.status(200).json({ success: true, students: cloudStudents });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}

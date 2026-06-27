// ══════════════════════════════════════════════════════
// Netlify Serverless Function — TMDB Proxy
// Skedari: netlify/functions/tmdb.js
// ══════════════════════════════════════════════════════

const TMDB_API_KEY = '210d4ba4c64cda2a582dd55aa7bfe92e';  // ← zëvendëso me key-in tënd

exports.handler = async function(event) {
  const path   = event.queryStringParameters?.path || '';
  const params = { ...event.queryStringParameters };
  delete params.path;

  if (!path) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Missing path parameter' })
    };
  }

  const qs  = new URLSearchParams({ ...params, api_key: TMDB_API_KEY }).toString();
  const url = `https://api.themoviedb.org/3${path}?${qs}`;

  try {
    const res  = await fetch(url);
    const data = await res.json();
    return {
      statusCode: res.status,
      headers: {
        'Content-Type':                'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};

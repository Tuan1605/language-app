export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const url = new URL(req.url);
    const file = url.searchParams.get('file');
    
    if (!file) {
      return new Response('Missing file parameter', { status: 400 });
    }

    const targetUrl = `https://github.com/Tuan1605/language-app/releases/download/v1.0/${encodeURIComponent(file)}`;
    
    const response = await fetch(targetUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Vercel-Edge-Function'
      }
    });

    if (!response.ok) {
      return new Response(`Failed to proxy: ${response.status} ${response.statusText}`, { status: response.status });
    }

    const headers = new Headers(response.headers);
    // Overwrite CORS headers
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    // Ensure it's inline, not attachment
    headers.delete('content-disposition');
    headers.set('content-type', 'application/pdf');

    return new Response(response.body, {
      status: response.status,
      headers
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

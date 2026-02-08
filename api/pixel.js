// api/pixel.js
export default async function handler(req, res) {
  // Configuração de CORS para aceitar requisições do seu GitHub Pages
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Substitua '*' pelo link do seu GitHub após publicar
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { eventName, eventData, userAgent, ip } = req.body;
  const PIXEL_ID = 'SEU_ID_DO_PIXEL_AQUI';
  const ACCESS_TOKEN = 'SEU_TOKEN_DE_ACESSO_CAPI_AQUI'; // Pegue no Gerenciador de Eventos

  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [
          {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            user_data: {
              client_ip_address: ip,
              client_user_agent: userAgent,
              // Adicione e-mails hash se tiver
            },
            custom_data: eventData,
            action_source: "website"
          }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json({ success: true, facebook: data });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar para o Facebook' });
  }
}

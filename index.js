const bedrock = require('bedrock-protocol');
const http = require('http');

const CONFIG = {
  host: 'limaduo526.mcsh.io',
  port: 19132,
  username: '24/7',
  version: '1.21.90'
};

http.createServer((req, res) => {
  res.end('Bot is running!');
}).listen(process.env.PORT || 3000);

function createBot() {
  console.log(`Connecting ke ${CONFIG.host}...`);

  const client = bedrock.createClient({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    version: CONFIG.version,
    offline: true
  });

  client.on('spawn', () => {
    console.log('✅ Bot masuk server!');
    startAntiAFK(client);
  });

  client.on('text', (packet) => {
    console.log('💬', packet.message);
    if (packet.message.includes('!ping')) {
      client.queue('text', {
        type: 'chat',
        needs_translation: false,
        source_name: CONFIG.username,
        xuid: '',
        platform_chat_id: '',
        message: 'Pong! 🏓'
      });
    }
  });

  client.on('kick', () => setTimeout(createBot, 5000));
  client.on('close', () => setTimeout(createBot, 5000));
  client.on('error', () => setTimeout(createBot, 5000));
}

function startAntiAFK(client) {
  setInterval(() => {
    try {
      client.queue('player_action', {
        runtime_entity_id: client.entityId || BigInt(1),
        action: 'jump',
        block_position: { x: 0, y: 0, z: 0 },
        result_position: { x: 0, y: 0, z: 0 },
        face: 0
      });
      console.log('🦘 Anti-AFK jump');
    } catch (e) {}
  }, 3 * 60 * 1000);
}

createBot();
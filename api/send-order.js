module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, cart, total } = req.body;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ error: "Ошибка Vercel: Не найден TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID!" });
  }

  let itemsList = cart.map((item, index) => `${index + 1}. ${item.name} (Размер: ${item.size}, Цвет: ${item.color}) — ${item.price} ₸`).join('\n');
  let message = `🔥 Новый заказ в Velutto Studio!\n\n` +
                `👤 Имя: ${name}\n` +
                `📞 Телефон: ${phone}\n\n` +
                `📦 Товары:\n${itemsList}\n\n` +
                `💰 Итого: ${total} ₸`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return res.status(400).json({ error: "Telegram API error: " + JSON.stringify(data) });
    }
    
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Server fetch error: " + err.message });
  }
};
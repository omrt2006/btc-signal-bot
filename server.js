const express = require("express");
const app = express();

app.use(express.static("."));

app.get("/api/health", (req, res) => {
  res.json({ status: "online" });
});

app.get("/api/btc", async (req, res) => {
  try {
    const r = await fetch(
      "https://api.kraken.com/0/public/Ticker?pair=XBTUSD"
    );
    if (!r.ok) throw new Error("Kraken no responde");

    const j = await r.json();
    if (j.error?.length) throw new Error(j.error.join(", "));

    const key = Object.keys(j.result)[0];
    res.json({
      success: true,
      price: Number(j.result[key].c[0])
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.get("/api/btc-candles", async (req, res) => {
  try {
    const r = await fetch(
      "https://api.kraken.com/0/public/OHLC?pair=XBTUSD&interval=5"
    );
    if (!r.ok) throw new Error("Error obteniendo velas");

    const j = await r.json();
    if (j.error?.length) throw new Error(j.error.join(", "));

    const key = Object.keys(j.result).find(k => k !== "last");
    const candles = j.result[key].slice(-100).map(v => [
      Number(v[0]) * 1000,
      Number(v[1]),
      Number(v[2]),
      Number(v[3]),
      Number(v[4]),
      Number(v[6])
    ]);

    res.json(candles);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("BTC Signal Bot online");
});

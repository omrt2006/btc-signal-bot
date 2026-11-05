const express = require("express");
const app = express();

app.use(express.static("."));

app.get("/api/btc", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.kraken.com/0/public/Ticker?pair=XBTUSD"
    );

    if (!response.ok) throw new Error("Error Kraken");

    const data = await response.json();
    const price = Number(
      Object.values(data.result)[0].c[0]
    );

    res.json({
      success: true,
      symbol: "BTC/USD",
      price
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "online" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("BTC Signal Bot online on port " + PORT);
});

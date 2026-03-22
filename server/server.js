require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const sdk = require("microsoft-cognitiveservices-speech-sdk");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const SPEECH_REGION = process.env.AZURE_SPEECH_REGION;

if (!SPEECH_KEY || !SPEECH_REGION) {
  console.error("Missing Azure Speech credentials in environment variables.");
  process.exit(1);
}

const rootDir = path.join(__dirname, "..");
app.use(express.static(rootDir));

app.post("/api/tts", async (req, res) => {
  try {
    const { text, language = "en", style = "feminine" } = req.body || {};

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Missing text" });
    }

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      SPEECH_KEY,
      SPEECH_REGION
    );

    speechConfig.speechSynthesisOutputFormat =
      sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

    let voice = "en-US-AriaNeural";

    if (language === "tl" || language === "ilo") {
      voice = style === "masculine"
        ? "fil-PH-AngeloNeural"
        : "fil-PH-BlessicaNeural";
    } else {
      voice = style === "masculine"
        ? "en-US-GuyNeural"
        : "en-US-AriaNeural";
    }

    speechConfig.speechSynthesisVoiceName = voice;

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    synthesizer.speakTextAsync(
      text,
      (result) => {
        const audio = Buffer.from(result.audioData);
        res.setHeader("Content-Type", "audio/mpeg");
        res.send(audio);
        synthesizer.close();
      },
      (error) => {
        synthesizer.close();
        res.status(500).json({ error: String(error) });
      }
    );
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(rootDir, "login.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
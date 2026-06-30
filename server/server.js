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
const ALLOWED_VOICES = {
  en: ["en-US-AriaNeural", "en-US-GuyNeural"],
  fil: ["fil-PH-BlessicaNeural", "fil-PH-AngeloNeural"]
};

if (!SPEECH_KEY || !SPEECH_REGION) {
  console.warn("Azure Speech credentials are missing. The website will run, but voice features will be unavailable.");
}

const rootDir = path.join(__dirname, "..");

/* Serve all frontend files (index.html, login.html, story.html, style.css, script.js, etc.) */
app.use(express.static(rootDir));

/* Default route */
app.get("/", (req, res) => {
  res.sendFile(path.join(rootDir, "login.html"));
});

/* Azure TTS endpoint */
app.post("/api/tts", async (req, res) => {
  try {
    const { text, language = "en", style = "feminine", voice = "" } = req.body || {};

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Missing text" });
    }

    if (!SPEECH_KEY || !SPEECH_REGION) {
      return res.status(503).json({
        error: "Voice service is not configured yet."
      });
    }

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      SPEECH_KEY,
      SPEECH_REGION
    );

    speechConfig.speechSynthesisOutputFormat =
      sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

    const voiceGroup = language === "en" ? "en" : "fil";
    let selectedVoice;

    if (ALLOWED_VOICES[voiceGroup].includes(voice)) {
      selectedVoice = voice;
    } else if (voiceGroup === "fil") {
      selectedVoice = style === "masculine"
        ? "fil-PH-AngeloNeural"
        : "fil-PH-BlessicaNeural";
    } else {
      selectedVoice = style === "masculine"
        ? "en-US-GuyNeural"
        : "en-US-AriaNeural";
    }

    speechConfig.speechSynthesisVoiceName = selectedVoice;

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    synthesizer.speakTextAsync(
      text,
      (result) => {
        try {
          if (
            result.reason !== sdk.ResultReason.SynthesizingAudioCompleted ||
            !result.audioData
          ) {
            console.error("Azure TTS canceled:", result.errorDetails || result.reason);
            return res.status(502).json({
              error:
                "Azure Speech rejected the request. Check that the key, region, and Speech resource are still active."
            });
          }

          const audio = Buffer.from(result.audioData);
          res.setHeader("Content-Type", "audio/mpeg");
          res.send(audio);
        } finally {
          synthesizer.close();
        }
      },
      (error) => {
        try {
          console.error("Azure TTS error:", error);
          res.status(500).json({ error: String(error) });
        } finally {
          synthesizer.close();
        }
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: String(error) });
  }
});

/* Optional: health check */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/* Start server */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

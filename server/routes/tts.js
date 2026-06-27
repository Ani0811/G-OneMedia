import express from 'express'

const router = express.Router()

router.post('/tts', async (req, res) => {
  const defaultVoice = process.env.ELEVENLABS_VOICE_ID || process.env.VITE_ELEVENLABS_VOICE_ID || 'Xb7hH8MSUJpSbSDYk0k2'
  const { text, voiceId = defaultVoice } = req.body
  if (!text) return res.status(400).json({ error: 'Text is required' })

  const apiKey = process.env.ELEVENLABS_API_KEY || process.env.VITE_ELEVENLABS_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'ElevenLabs API key not configured' })

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    })

    if (!response.ok) {
      let details = ''
      try {
        const errJson = await response.json()
        details = JSON.stringify(errJson)
      } catch {
        try {
          details = await response.text()
        } catch {
          details = 'Unknown response'
        }
      }
      throw new Error(`ElevenLabs API returned status ${response.status}: ${details}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.length
    })
    res.send(buffer)
  } catch (error) {
    console.error('TTS error:', error)
    res.status(500).json({ error: error.message || 'Failed to generate audio' })
  }
})

export default router

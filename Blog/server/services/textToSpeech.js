const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Convert blog text to speech audio file
 * @param {string} blogText - The blog text to convert to speech
 * @param {string} modelId - ID of the AI model (used for file naming)
 * @returns {Promise<string>} - Path to the generated audio file
 */
async function convertToSpeech(blogText, modelId) {
  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../uploads/audio');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate a filename based on model ID and timestamp
    const fileName = `${modelId}-${Date.now()}.mp3`;
    const filePath = path.join(uploadsDir, fileName);

    // Split blog text into chunks if too long (max 4096 tokens for TTS API)
    // This is a simple split by paragraphs that can be improved
    const paragraphs = blogText.split('\n\n');
    let currentChunk = '';
    const chunks = [];

    for (const paragraph of paragraphs) {
      // Simple token estimation: ~1.3 tokens per word
      const estimatedTokens = paragraph.split(' ').length * 1.3;
      
      if ((currentChunk.split(' ').length * 1.3) + estimatedTokens > 4000) {
        chunks.push(currentChunk);
        currentChunk = paragraph;
      } else {
        currentChunk += '\n\n' + paragraph;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk);
    }

    // Process the first chunk only for now (for simplicity)
    // In a production app, you'd want to process all chunks and concatenate
    const chunk = chunks[0];

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: chunk,
    });

    // Convert response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Write to file
    fs.writeFileSync(filePath, buffer);

    // Return the relative path to the file that can be used in API responses
    return `/uploads/audio/${fileName}`;
  } catch (error) {
    console.error('Error converting text to speech:', error);
    throw new Error('Failed to convert blog to speech');
  }
}

module.exports = { convertToSpeech }; 
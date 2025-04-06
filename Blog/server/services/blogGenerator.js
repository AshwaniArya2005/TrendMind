const { OpenAI } = require('openai');
const dotenv = require('dotenv');

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate a blog about an AI model using OpenAI
 * @param {Object} modelInfo - Information about the AI model
 * @param {string} modelInfo.name - Name of the AI model
 * @param {string} modelInfo.description - Short description of the model
 * @param {string} modelInfo.paperUrl - URL to the research paper
 * @param {string} modelInfo.githubUrl - URL to the GitHub repository
 * @param {Array} modelInfo.keyFeatures - Key features of the model
 * @param {Array} modelInfo.userReviews - Array of user reviews
 * @returns {Promise<string>} - Generated blog content
 */
async function generateBlog(modelInfo) {
  try {
    const {
      name, 
      description, 
      paperUrl, 
      githubUrl, 
      keyFeatures = [], 
      userReviews = []
    } = modelInfo;

    // Format user reviews for prompt
    const formattedReviews = userReviews.map(review => 
      `- ${review.user} (${review.rating}/5): "${review.comment}"`
    ).join('\n');

    // Format key features for prompt
    const formattedFeatures = keyFeatures.map(feature => 
      `- ${feature}`
    ).join('\n');

    const prompt = `Generate a comprehensive blog post about the AI model "${name}".

Basic Information:
${description}

Key Features:
${formattedFeatures}

GitHub Repository: ${githubUrl}
Research Paper: ${paperUrl}

User Reviews:
${formattedReviews}

Instructions:
1. Write a professional blog post (around 800-1000 words).
2. Include an introduction explaining what the model is and its significance.
3. Explain the key features and capabilities in detail.
4. Discuss the technical architecture briefly.
5. Mention real-world applications and use cases.
6. Include a section that summarizes what users are saying (based on the reviews).
7. Conclude with future prospects and recommendations.
8. Use a professional but engaging tone.
9. Structure the blog with clear headings and subheadings.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: [
        {
          role: "system",
          content: "You are an AI technology expert who writes informative and engaging blog posts about AI models, machine learning systems, and deep learning architectures."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating blog:', error);
    throw new Error('Failed to generate blog content');
  }
}

module.exports = { generateBlog }; 
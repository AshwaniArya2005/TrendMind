// Hugging Face API Service
// Documentation: https://huggingface.co/docs/api-inference/index

// Note: For production, you would need a Hugging Face API Token
// const HF_API_TOKEN = process.env.REACT_APP_HF_API_TOKEN;
const HF_API_URL = 'https://huggingface.co/api';

/**
 * Fetch trending models from Hugging Face
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of models to fetch (default: 20)
 * @param {string} options.sort - Sort by (downloads, likes, trending)
 * @param {string} options.filter - Filter by tag
 * @returns {Promise<Array>} - List of models
 */
export const fetchModels = async (options = {}) => {
  const { limit = 20, sort = 'trending', filter = '' } = options;
  
  try {
    // Construct the URL with query parameters
    let url = `${HF_API_URL}/models?limit=${limit}`;
    
    if (sort) {
      url += `&sort=${sort}`;
    }
    
    if (filter) {
      url += `&filter=${filter}`;
    }
    
    console.log('Fetching models from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const responseText = await response.text();
    console.log('API Raw Response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      throw new Error('Failed to parse API response');
    }
    
    if (!Array.isArray(data)) {
      console.error('Unexpected API response format:', data);
      throw new Error('API response is not an array');
    }
    
    console.log('Retrieved', data.length, 'models from API');
    
    // Transform data to match our app's model structure
    return data.map(model => ({
      id: model.id,
      name: model.id ? (model.id.split('/').pop() || model.id) : 'Unknown Model',
      description: model.description || 'No description available',
      tags: model.tags || [],
      imageUrl: model.id ? `https://huggingface.co/${model.id}/resolve/main/thumbnail.png` : null,
      compareEnabled: true,
      author: model.id && model.id.includes('/') ? model.id.split('/')[0] : 'Unknown',
      downloadCount: model.downloads || 0,
      likes: model.likes || 0,
      lastUpdated: model.lastModified || new Date().toISOString(),
      huggingFaceUrl: model.id ? `https://huggingface.co/${model.id}` : null
    }));
  } catch (error) {
    console.error('Error fetching models from Hugging Face:', error);
    throw error;
  }
};

/**
 * Fetch a specific model by ID
 * @param {string} modelId - The model ID in format "owner/name"
 * @returns {Promise<Object>} - Model details
 */
export const fetchModelById = async (modelId) => {
  try {
    console.log('Fetching model details for:', modelId);
    
    const response = await fetch(`${HF_API_URL}/models/${modelId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const responseText = await response.text();
    console.log('API Response Length:', responseText.length);
    
    let model;
    try {
      model = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      throw new Error('Failed to parse API response');
    }
    
    if (!model || typeof model !== 'object') {
      console.error('Unexpected API response format:', model);
      throw new Error('API response is not a valid model object');
    }
    
    return {
      id: model.id || modelId,
      name: model.id ? (model.id.split('/').pop() || model.id) : modelId.split('/').pop() || modelId,
      description: model.description || 'No description available',
      tags: model.tags || [],
      imageUrl: `https://huggingface.co/${modelId}/resolve/main/thumbnail.png`,
      compareEnabled: true,
      author: modelId.includes('/') ? modelId.split('/')[0] : 'Unknown',
      downloadCount: model.downloads || 0,
      likes: model.likes || 0,
      lastUpdated: model.lastModified || new Date().toISOString(),
      huggingFaceUrl: `https://huggingface.co/${modelId}`,
      githubUrl: model.github || null,
      paperUrl: model.arxiv || null,
      license: model.license || 'Unknown'
    };
  } catch (error) {
    console.error(`Error fetching model details for ${modelId}:`, error);
    throw error;
  }
};

/**
 * Store user favorites in localStorage
 * @param {string} userId - User ID
 * @param {Array<string>} favorites - Array of model IDs
 */
export const saveFavorites = (userId, favorites) => {
  try {
    localStorage.setItem(`hf_favorites_${userId}`, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

/**
 * Get user favorites from localStorage
 * @param {string} userId - User ID
 * @returns {Array<string>} - Array of favorite model IDs
 */
export const getFavorites = (userId) => {
  try {
    const favorites = localStorage.getItem(`hf_favorites_${userId}`);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites from localStorage:', error);
    return [];
  }
};

/**
 * Fetch full details of favorite models
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - List of favorite model details
 */
export const fetchFavoriteModels = async (userId) => {
  try {
    const favoriteIds = getFavorites(userId);
    
    if (!favoriteIds.length) {
      return [];
    }
    
    // Fetch each model's details in parallel
    const favoriteModels = await Promise.all(
      favoriteIds.map(id => fetchModelById(id))
    );
    
    return favoriteModels;
  } catch (error) {
    console.error('Error fetching favorite models:', error);
    return [];
  }
}; 
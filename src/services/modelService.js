// Client-side service for Hugging Face API
// Direct API calls to Hugging Face

// Import mock data for fallback
import mockModels from '../data/mockModels';

// Direct Hugging Face API endpoint
const HF_API_URL = 'https://huggingface.co/api';
const FALLBACK_TO_MOCK = true; // In case API calls fail, fall back to mock data
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Basic client-side caching
const cache = {
  models: {},
  modelDetails: {},
  lastFetched: null
};

/**
 * Fetch trending models from Hugging Face API
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of models to fetch (default: 20)
 * @param {string} options.sort - Sort by (downloads, likes, trending)
 * @param {string} options.filter - Filter by tag
 * @param {boolean} options.refresh - Force refresh from API even if cache exists
 * @returns {Promise<Array>} - List of models
 */
export const getModels = async (options = {}) => {
  const { limit = 20, sort = 'trending', filter = '', refresh = false } = options;
  
  try {
    // Check if we have cached data that's still fresh
    const cacheKey = `${sort}-${filter}-${limit}`;
    const now = Date.now();
    
    if (!refresh && 
        cache.models[cacheKey] && 
        cache.lastFetched && 
        (now - cache.lastFetched) < CACHE_TTL) {
      console.log('Using cached model data');
      return cache.models[cacheKey];
    }
    
    // Try direct Hugging Face API first
    try {
      // Construct the URL with query parameters
      const url = `${HF_API_URL}/models?limit=${limit}${sort ? `&sort=${sort}` : ''}${filter ? `&filter=${filter}` : ''}`;
      console.log('Fetching models directly from HF API:', url);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (Array.isArray(data)) {
          console.log('Retrieved', data.length, 'models from HF API');
          
          // Transform data
          const transformedModels = data.map(model => ({
            id: model.id,
            name: model.id ? (model.id.split('/').pop() || model.id) : 'Unknown Model',
            description: model.description || 'No description available',
            tags: model.tags || [],
            imageUrl: model.id ? `https://huggingface.co/${model.id}/resolve/main/thumbnail.png` : null,
            compareEnabled: true,
            author: model.id && model.id.includes('/') ? model.id.split('/')[0] : 'Unknown',
            downloadCount: model.downloads || 0,
            likes: model.likes || 0,
            lastUpdated: model.lastModified || new Date(),
            huggingFaceUrl: model.id ? `https://huggingface.co/${model.id}` : null
          }));
          
          // Update cache
          cache.models[cacheKey] = transformedModels;
          cache.lastFetched = now;
          
          return transformedModels;
        }
      } else {
        console.warn('Failed to fetch from Hugging Face API:', response.status, response.statusText);
      }
    } catch (apiError) {
      console.error('Hugging Face API Error:', apiError);
      // Continue to fallback
    }
    
    // Try server API as fallback
    try {
      const serverUrl = `/api/models?limit=${limit}${sort ? `&sort=${sort}` : ''}${filter ? `&filter=${filter}` : ''}`;
      console.log('Falling back to server API:', serverUrl);
      
      const response = await fetch(serverUrl);
      
      if (response.ok) {
        const data = await response.json();
        let models = data.models || data;
        
        // Ensure models have the right format
        if (Array.isArray(models) && models.length > 0) {
          console.log('Retrieved', models.length, 'models from server');
          
          // Update cache
          cache.models[cacheKey] = models;
          cache.lastFetched = now;
          
          return models;
        }
      }
    } catch (serverError) {
      console.error('Server API Error:', serverError);
      // Continue to fallback
    }
    
    // Fallback to mock data
    if (FALLBACK_TO_MOCK) {
      console.log('Falling back to mock model data');
      
      // Filter and sort mock data
      let filteredModels = [...mockModels];
      
      // Filter by tags
      if (filter) {
        filteredModels = filteredModels.filter(model => 
          model.tags && model.tags.includes(filter)
        );
      }
      
      // Sort according to requested order
      switch(sort) {
        case 'downloads':
          filteredModels.sort((a, b) => b.downloadCount - a.downloadCount);
          break;
        case 'likes':
          filteredModels.sort((a, b) => b.likes - a.likes);
          break;
        case 'trending':
          // Best approximation of trending
          filteredModels.sort((a, b) => {
            if (b.likes !== a.likes) return b.likes - a.likes;
            if (b.downloadCount !== a.downloadCount) return b.downloadCount - a.downloadCount;
            return new Date(b.lastUpdated) - new Date(a.lastUpdated);
          });
          break;
        case 'modified':
          filteredModels.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
          break;
        default:
          filteredModels.sort((a, b) => b.likes - a.likes);
      }
      
      // Apply limit
      const limitedModels = filteredModels.slice(0, limit);
      
      // Update cache
      cache.models[cacheKey] = limitedModels;
      cache.lastFetched = now;
      
      return limitedModels;
    }
    
    throw new Error('Failed to fetch models from all sources');
    
  } catch (error) {
    console.error('Error in getModels:', error);
    throw error;
  }
};

/**
 * Get a specific model by ID from Hugging Face API
 * @param {string} modelId - The model ID in format "owner/name"
 * @param {boolean} refresh - Force refresh from API
 * @returns {Promise<Object>} - Model details
 */
export const getModelById = async (modelId, refresh = false) => {
  try {
    const now = Date.now();
    
    // Try to get from cache first
    if (!refresh && 
        cache.modelDetails[modelId] && 
        cache.modelDetails[modelId].lastFetched && 
        (now - cache.modelDetails[modelId].lastFetched) < CACHE_TTL) {
      console.log('Using cached model details');
      return cache.modelDetails[modelId];
    }
    
    // Try direct Hugging Face API first
    try {
      const url = `${HF_API_URL}/models/${modelId}`;
      console.log('Fetching model details directly from HF API:', url);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const modelData = await response.json();
        
        // Transform and cache
        const modelToSave = {
          id: modelData.id || modelId,
          name: modelData.id ? (modelData.id.split('/').pop() || modelData.id) : modelId.split('/').pop() || modelId,
          description: modelData.description || 'No description available',
          tags: modelData.tags || [],
          imageUrl: `https://huggingface.co/${modelId}/resolve/main/thumbnail.png`,
          compareEnabled: true,
          author: modelId.includes('/') ? modelId.split('/')[0] : 'Unknown',
          downloadCount: modelData.downloads || 0,
          likes: modelData.likes || 0,
          lastUpdated: modelData.lastModified || new Date(),
          huggingFaceUrl: `https://huggingface.co/${modelId}`,
          githubUrl: modelData.github || null,
          paperUrl: modelData.arxiv || null,
          license: modelData.license || 'Unknown',
          lastFetched: now
        };
        
        // Update cache
        cache.modelDetails[modelId] = modelToSave;
        
        return modelToSave;
      } else {
        console.warn('Failed to fetch model details from Hugging Face API:', response.status, response.statusText);
      }
    } catch (apiError) {
      console.error('Hugging Face API Error:', apiError);
      // Continue to fallback
    }
    
    // Try server API as fallback
    try {
      const serverUrl = `/api/models/${modelId}`;
      console.log('Falling back to server API for model details:', serverUrl);
      
      const response = await fetch(serverUrl);
      
      if (response.ok) {
        const modelData = await response.json();
        
        if (modelData && modelData.id) {
          console.log('Retrieved model details from server');
          
          // Update cache
          cache.modelDetails[modelId] = modelData;
          
          return modelData;
        }
      }
    } catch (serverError) {
      console.error('Server API Error:', serverError);
      // Continue to fallback
    }
    
    // Fallback to mock data
    if (FALLBACK_TO_MOCK) {
      console.log('Falling back to mock data for model details');
      
      const mockModel = mockModels.find(model => model.id === modelId);
      
      if (mockModel) {
        cache.modelDetails[modelId] = mockModel;
        return mockModel;
      }
      
      // Create a generic model if not found
      const genericModel = {
        id: modelId,
        name: modelId.split('/').pop() || modelId,
        description: 'No description available',
        tags: [],
        imageUrl: `https://huggingface.co/${modelId}/resolve/main/thumbnail.png`,
        compareEnabled: true,
        author: modelId.includes('/') ? modelId.split('/')[0] : 'Unknown',
        downloadCount: 0,
        likes: 0,
        lastUpdated: new Date(),
        huggingFaceUrl: `https://huggingface.co/${modelId}`,
        lastFetched: now
      };
      
      cache.modelDetails[modelId] = genericModel;
      return genericModel;
    }
    
    throw new Error(`Model not found: ${modelId}`);
  } catch (error) {
    console.error(`Error in getModelById for ${modelId}:`, error);
    throw error;
  }
};

/**
 * Get favorite models with full details
 * @param {Array<string>} modelIds - List of model IDs
 * @returns {Promise<Array>} - Array of model details
 */
export const getFavoriteModels = async (modelIds) => {
  try {
    if (!modelIds || !modelIds.length) {
      return [];
    }
    
    // Fetch all models individually (will use cache if available)
    const favoriteModels = await Promise.all(
      modelIds.map(async (id) => {
        try {
          return await getModelById(id);
        } catch (err) {
          console.error(`Error fetching model ${id}:`, err);
          // Return placeholder for failed fetches
          return {
            id,
            name: id.split('/').pop() || id,
            description: 'Could not load model details',
            error: true
          };
        }
      })
    );
    
    return favoriteModels;
  } catch (error) {
    console.error('Error in getFavoriteModels:', error);
    return [];
  }
};

/**
 * Search models by name or description
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise<Array>} - List of matching models
 */
export const searchModels = async (query, options = {}) => {
  const { limit = 20 } = options;
  
  try {
    if (!query) {
      return [];
    }
    
    // Fetch models and search locally
    const allModels = await getModels({ limit: 100 });
    
    // Simple case-insensitive search
    const searchQuery = query.toLowerCase();
    const searchResults = allModels.filter(model => {
      const modelText = `${model.name} ${model.description}`.toLowerCase();
      return modelText.includes(searchQuery);
    }).slice(0, limit);
    
    return searchResults;
  } catch (error) {
    console.error('Error in searchModels:', error);
    throw error;
  }
}; 
/**
 * Model type definition (for documentation only)
 * No MongoDB dependencies
 * 
 * @typedef {Object} Model
 * @property {string} id - Unique identifier for the model (format: "owner/name")
 * @property {string} name - Display name of the model
 * @property {string} description - Description of the model
 * @property {string[]} tags - List of tags associated with the model
 * @property {string} imageUrl - URL to the model's thumbnail image
 * @property {boolean} compareEnabled - Whether the model is enabled for comparison
 * @property {string} author - Author/owner of the model
 * @property {number} downloadCount - Number of downloads
 * @property {number} likes - Number of likes
 * @property {Date|string} lastUpdated - When the model was last updated
 * @property {string} huggingFaceUrl - URL to the model's Hugging Face page
 * @property {string|null} githubUrl - URL to the model's GitHub repository
 * @property {string|null} paperUrl - URL to the model's research paper
 * @property {string} license - License of the model
 */

// Export nothing - this file is just for documentation
export default {}; 
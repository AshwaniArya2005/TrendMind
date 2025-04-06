// Mock data for models
const mockModels = [
  {
    id: "meta-llama/Llama-2-7b-chat-hf",
    name: "Llama-2-7b-chat-hf",
    description: "Llama 2 is a collection of pretrained and fine-tuned generative text models ranging in scale from 7 billion to 70 billion parameters.",
    tags: ["natural-language-processing", "text-generation", "conversational"],
    imageUrl: "https://huggingface.co/meta-llama/Llama-2-7b-chat-hf/resolve/main/thumbnail.png",
    compareEnabled: true,
    author: "meta-llama",
    downloadCount: 2500000,
    likes: 12000,
    lastUpdated: "2023-10-15T12:30:00.000Z",
    huggingFaceUrl: "https://huggingface.co/meta-llama/Llama-2-7b-chat-hf",
    lastFetched: new Date()
  },
  {
    id: "mistralai/Mistral-7B-Instruct-v0.2",
    name: "Mistral-7B-Instruct-v0.2",
    description: "The Mistral-7B-Instruct-v0.2 Large Language Model (LLM) is an improved instruct fine-tuned version of Mistral-7B.",
    tags: ["natural-language-processing", "text-generation"],
    imageUrl: "https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2/resolve/main/thumbnail.png",
    compareEnabled: true,
    author: "mistralai",
    downloadCount: 1800000,
    likes: 9500,
    lastUpdated: "2023-12-02T15:45:00.000Z",
    huggingFaceUrl: "https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2",
    lastFetched: new Date()
  },
  {
    id: "stabilityai/stable-diffusion-2",
    name: "stable-diffusion-2",
    description: "Stable Diffusion 2 is a latent text-to-image diffusion model capable of generating photo-realistic images given any text input.",
    tags: ["computer-vision", "diffusion-models", "text-to-image"],
    imageUrl: "https://huggingface.co/stabilityai/stable-diffusion-2/resolve/main/thumbnail.png",
    compareEnabled: true,
    author: "stabilityai",
    downloadCount: 3200000,
    likes: 15000,
    lastUpdated: "2023-09-20T10:15:00.000Z",
    huggingFaceUrl: "https://huggingface.co/stabilityai/stable-diffusion-2",
    lastFetched: new Date()
  },
  {
    id: "microsoft/phi-2",
    name: "phi-2",
    description: "Phi-2 is a 2.7 billion parameter language model that demonstrates outstanding reasoning and language understanding capabilities.",
    tags: ["natural-language-processing", "text-generation"],
    imageUrl: "https://huggingface.co/microsoft/phi-2/resolve/main/thumbnail.png",
    compareEnabled: true,
    author: "microsoft",
    downloadCount: 1200000,
    likes: 7500,
    lastUpdated: "2023-12-15T11:20:00.000Z",
    huggingFaceUrl: "https://huggingface.co/microsoft/phi-2",
    lastFetched: new Date()
  },
  {
    id: "BAAI/bge-large-en-v1.5",
    name: "bge-large-en-v1.5",
    description: "BGE is a general embedding model that achieves state-of-the-art performance on text embedding tasks.",
    tags: ["natural-language-processing", "feature-extraction", "sentence-similarity"],
    imageUrl: "https://huggingface.co/BAAI/bge-large-en-v1.5/resolve/main/thumbnail.png",
    compareEnabled: true,
    author: "BAAI",
    downloadCount: 900000,
    likes: 5200,
    lastUpdated: "2023-11-05T14:10:00.000Z",
    huggingFaceUrl: "https://huggingface.co/BAAI/bge-large-en-v1.5",
    lastFetched: new Date()
  },
  {
    id: "google/flan-t5-xxl",
    name: "flan-t5-xxl",
    description: "Flan-T5 is an instruction-tuned model built on top of the T5 model with 11B parameters.",
    tags: ["natural-language-processing", "text2text-generation"],
    imageUrl: "https://huggingface.co/google/flan-t5-xxl/resolve/main/thumbnail.png",
    compareEnabled: true,
    author: "google",
    downloadCount: 1100000,
    likes: 6800,
    lastUpdated: "2023-08-10T09:30:00.000Z",
    huggingFaceUrl: "https://huggingface.co/google/flan-t5-xxl",
    lastFetched: new Date()
  },
  {
    id: "openai/clip-vit-base-patch32",
    name: "clip-vit-base-patch32",
    description: "CLIP (Contrastive Language-Image Pre-Training) model with ViT-B/32, matching images and text.",
    tags: ["computer-vision", "multimodal", "contrastive-learning"],
    imageUrl: "https://huggingface.co/openai/clip-vit-base-patch32/resolve/main/thumbnail.png",
    compareEnabled: true,
    author: "openai",
    downloadCount: 1500000,
    likes: 8200,
    lastUpdated: "2023-07-01T16:40:00.000Z",
    huggingFaceUrl: "https://huggingface.co/openai/clip-vit-base-patch32",
    lastFetched: new Date()
  },
  {
    id: "runwayml/stable-diffusion-v1-5",
    name: "stable-diffusion-v1-5",
    description: "Stable Diffusion is a text-to-image latent diffusion model created by the researchers and engineers from CompVis, Stability AI, and LAION.",
    tags: ["computer-vision", "diffusion-models", "text-to-image"],
    imageUrl: "https://huggingface.co/runwayml/stable-diffusion-v1-5/resolve/main/thumbnail.png",
    compareEnabled: true,
    author: "runwayml",
    downloadCount: 2900000,
    likes: 13800,
    lastUpdated: "2023-06-15T13:25:00.000Z",
    huggingFaceUrl: "https://huggingface.co/runwayml/stable-diffusion-v1-5",
    lastFetched: new Date()
  },
  {
    id: "facebook/bart-large-mnli",
    name: "bart-large-mnli",
    description: "BART model fine-tuned on MultiNLI for zero-shot text classification.",
    tags: ["natural-language-processing", "zero-shot-classification"],
    imageUrl: "https://huggingface.co/facebook/bart-large-mnli/resolve/main/thumbnail.png",
    compareEnabled: true,
    author: "facebook",
    downloadCount: 850000,
    likes: 4800,
    lastUpdated: "2023-05-20T08:15:00.000Z",
    huggingFaceUrl: "https://huggingface.co/facebook/bart-large-mnli",
    lastFetched: new Date()
  },
  {
    id: "gpt2",
    name: "gpt2",
    description: "GPT-2 is a transformers model pretrained on a very large corpus of English data in a self-supervised fashion.",
    tags: ["natural-language-processing", "text-generation"],
    imageUrl: "https://huggingface.co/gpt2/resolve/main/thumbnail.png",
    compareEnabled: true,
    author: "openai",
    downloadCount: 2200000,
    likes: 10500,
    lastUpdated: "2023-04-10T17:50:00.000Z",
    huggingFaceUrl: "https://huggingface.co/gpt2",
    lastFetched: new Date()
  }
];

// Add 20 more generic models for better pagination testing
for (let i = 1; i <= 20; i++) {
  mockModels.push({
    id: `generic/model-${i}`,
    name: `Generic Model ${i}`,
    description: `This is a generic model #${i} for testing purposes.`,
    tags: ["testing", i % 2 === 0 ? "even-numbered" : "odd-numbered"],
    imageUrl: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg",
    compareEnabled: true,
    author: "generic",
    downloadCount: Math.floor(Math.random() * 1000000),
    likes: Math.floor(Math.random() * 5000),
    lastUpdated: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
    huggingFaceUrl: `https://huggingface.co/generic/model-${i}`,
    lastFetched: new Date()
  });
}

export default mockModels; 
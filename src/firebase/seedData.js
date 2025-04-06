import { db } from './config';

// Mock data for models with actual Hugging Face models
const modelsData = [
  {
    id: '1',
    name: 'Llama 3',
    description: 'Llama 3 is a powerful, high-performing open source language model created by Meta AI that excels at reasoning, coding, and instruction following tasks.',
    tags: ['LLM', 'Text Generation', 'Open-Source'],
    imageUrl: 'https://huggingface.co/meta-llama/Llama-3-8b/resolve/main/llama.png',
    compareEnabled: true,
    author: 'Meta AI',
    downloadCount: 8750000,
    likes: 29534,
    lastUpdated: '2024-04-18',
    huggingFaceUrl: 'https://huggingface.co/meta-llama/Llama-3-8b',
  },
  {
    id: '2',
    name: 'SDXL',
    description: 'Stable Diffusion XL (SDXL) is a text-to-image model that generates high-quality images from natural language descriptions.',
    tags: ['Diffusion', 'Image Generation', 'Text-to-Image'],
    imageUrl: 'https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/stacked-waveform.png',
    compareEnabled: true,
    author: 'Stability AI',
    downloadCount: 4275000,
    likes: 18745,
    lastUpdated: '2023-07-26',
    huggingFaceUrl: 'https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0',
  },
  {
    id: '3',
    name: 'Whisper Large v3',
    description: 'OpenAI\'s latest ASR (Automatic Speech Recognition) model with superior performance in various languages, environments, and diverse audio inputs.',
    tags: ['ASR', 'Speech Recognition', 'Transcription'],
    imageUrl: 'https://huggingface.co/openai/whisper-large-v3/resolve/main/thumbnail.png',
    compareEnabled: true,
    author: 'OpenAI',
    downloadCount: 3210000,
    likes: 13652,
    lastUpdated: '2023-12-14',
    huggingFaceUrl: 'https://huggingface.co/openai/whisper-large-v3',
  },
  {
    id: '4',
    name: 'CLIP ViT-L-14',
    description: 'CLIP (Contrastive Language-Image Pre-Training) model that connects text and images, enabling powerful zero-shot classification and image retrieval.',
    tags: ['Vision', 'Multimodal', 'Zero-Shot'],
    imageUrl: 'https://huggingface.co/openai/clip-vit-large-patch14/resolve/main/clip-vit-large-patch14-pytorch-architecture.jpg',
    compareEnabled: true,
    author: 'OpenAI',
    downloadCount: 1645000,
    likes: 8976,
    lastUpdated: '2021-01-05',
    huggingFaceUrl: 'https://huggingface.co/openai/clip-vit-large-patch14',
  },
  {
    id: '5',
    name: 'Mistral 7B Instruct',
    description: 'Mistral 7B is a powerful, instruction-tuned language model optimized for chat and instruction-following applications with strong reasoning capabilities.',
    tags: ['LLM', 'Instruct', 'Chat'],
    imageUrl: 'https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2/resolve/main/mistral-logo.png',
    compareEnabled: true,
    author: 'Mistral AI',
    downloadCount: 5760000,
    likes: 17823,
    lastUpdated: '2023-12-19',
    huggingFaceUrl: 'https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2',
  },
  {
    id: '6',
    name: 'CodeLlama 34B',
    description: 'A code-specialized version of Llama 2 that excels at code completion, code generation, and code understanding across various programming languages.',
    tags: ['LLM', 'Code Generation', 'Programming'],
    imageUrl: 'https://huggingface.co/codellama/CodeLlama-34b-Instruct-hf/resolve/main/codellama.png',
    compareEnabled: true,
    author: 'Meta AI',
    downloadCount: 2130000,
    likes: 11456,
    lastUpdated: '2023-08-24',
    huggingFaceUrl: 'https://huggingface.co/codellama/CodeLlama-34b-Instruct-hf',
  },
  {
    id: '7',
    name: 'GPT-2',
    description: 'The influential language model that revolutionized text generation, providing the foundation for future advancements in natural language processing.',
    tags: ['LLM', 'Text Generation', 'Transformer'],
    imageUrl: 'https://huggingface.co/gpt2/resolve/main/thumbnail.png',
    compareEnabled: true,
    author: 'OpenAI',
    downloadCount: 6890000,
    likes: 15789,
    lastUpdated: '2019-02-14',
    huggingFaceUrl: 'https://huggingface.co/gpt2',
  },
  {
    id: '8',
    name: 'YOLOv8',
    description: 'State-of-the-art real-time object detection model with excellent accuracy and speed, ideal for computer vision applications from edge devices to cloud.',
    tags: ['Computer Vision', 'Object Detection', 'Real-time'],
    imageUrl: 'https://huggingface.co/Ultralytics/yolov8/resolve/main/YOLOv8-architecture.png',
    compareEnabled: true,
    author: 'Ultralytics',
    downloadCount: 3450000,
    likes: 9876,
    lastUpdated: '2023-06-30',
    huggingFaceUrl: 'https://huggingface.co/Ultralytics/yolov8',
  }
];

// Function to seed the database with models
export const seedModels = async () => {
  try {
    const modelsCollection = db.collection('models');
    const batch = db.batch();
    
    // Check if models already exist
    const existingModels = await modelsCollection.get();
    if (!existingModels.empty) {
      console.log('Models data already exists. Skipping seeding.');
      return;
    }
    
    // Add each model to the batch
    modelsData.forEach(model => {
      const modelRef = modelsCollection.doc(model.id);
      batch.set(modelRef, model);
    });
    
    // Commit the batch
    await batch.commit();
    console.log('Successfully seeded models data!');
  } catch (error) {
    console.error('Error seeding models data:', error);
  }
}; 
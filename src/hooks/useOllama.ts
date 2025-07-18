import { useState, useEffect } from 'react';
import { OllamaService } from '../services/ollamaApi';

export const useOllama = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('llama3.2:3b');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ollamaService = OllamaService.getInstance();

  const checkConnection = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const connected = await ollamaService.testConnection();
      setIsConnected(connected);
      
      if (connected) {
        const availableModels = await ollamaService.getModels();
        setModels(availableModels);
        
        // Set default model if available
        if (availableModels.length > 0) {
          const defaultModel = availableModels.find(m => m.includes('llama3.2:3b')) || availableModels[0];
          setSelectedModel(defaultModel);
        }
      } else {
        setError('Cannot connect to Ollama. Please ensure Ollama is running on http://localhost:11434');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const generateResponse = async (prompt: string): Promise<string> => {
    if (!isConnected) {
      throw new Error('Not connected to Ollama');
    }

    return await ollamaService.generateResponse({
      model: selectedModel,
      prompt,
      stream: false
    });
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return {
    isConnected,
    models,
    selectedModel,
    setSelectedModel,
    isLoading,
    error,
    checkConnection,
    generateResponse
  };
};
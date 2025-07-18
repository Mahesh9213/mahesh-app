import { useState, useCallback } from 'react';
import { Message } from '../types/chat';
import { v4 as uuidv4 } from 'uuid';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const addMessage = useCallback((content: string, isUser: boolean): Message => {
    const message: Message = {
      id: uuidv4(),
      content,
      isUser,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    return message;
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const sendMessage = useCallback(async (
    content: string,
    generateResponse: (prompt: string) => Promise<string>
  ) => {
    // Add user message
    addMessage(content, true);
    
    setIsGenerating(true);
    try {
      // Generate AI response
      const response = await generateResponse(content);
      addMessage(response, false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      addMessage(`Error: ${errorMessage}`, false);
    } finally {
      setIsGenerating(false);
    }
  }, [addMessage]);

  return {
    messages,
    isGenerating,
    sendMessage,
    clearMessages
  };
};
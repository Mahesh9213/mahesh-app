import React, { useEffect, useRef } from 'react';
import { MessageSquare, Settings, Trash2, Wifi, WifiOff } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ModelSelector } from './components/ModelSelector';
import { ErrorMessage } from './components/ErrorMessage';
import { LoadingMessage } from './components/LoadingMessage';
import { useOllama } from './hooks/useOllama';
import { useChat } from './hooks/useChat';

function App() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    isConnected,
    models,
    selectedModel,
    setSelectedModel,
    isLoading,
    error,
    checkConnection,
    generateResponse
  } = useOllama();
  
  const { messages, isGenerating, sendMessage, clearMessages } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content, generateResponse);
  };

  const handleClearChat = () => {
    clearMessages();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Ollama Chat</h1>
              <div className="flex items-center gap-2 text-sm">
                {isConnected ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <Wifi className="w-4 h-4" />
                    <span>Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600">
                    <WifiOff className="w-4 h-4" />
                    <span>Disconnected</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isConnected && models.length > 0 && (
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-400" />
                <ModelSelector
                  models={models}
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  disabled={isGenerating}
                />
              </div>
            )}
            
            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                disabled={isGenerating}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col">
        {/* Connection Error */}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={checkConnection}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Connecting to Ollama...</p>
            </div>
          </div>
        )}

        {/* Welcome Message */}
        {!isLoading && isConnected && messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Ollama Chat</h2>
            <p className="text-gray-600 mb-4">
              Connected to model: <span className="font-medium">{selectedModel}</span>
            </p>
            <p className="text-gray-500 text-sm">
              Start a conversation by typing a message below
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isGenerating && <LoadingMessage />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={!isConnected || isGenerating}
          />
          
          {!isConnected && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Please ensure Ollama is running on http://localhost:11434 and try refreshing the page
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}

export default App;
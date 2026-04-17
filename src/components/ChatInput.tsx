import React, { useState } from 'react';
import { tokens } from '../design-system';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '1rem',
        backgroundColor: tokens.colors.surfaceContainerLowest,
        borderTop: `1px solid ${tokens.colors.outlineVariant}30`,
      }}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask the assistant (e.g., 'Shoes under ₹4000')"
        disabled={disabled}
        aria-label="Chat input"
        style={{
          flex: 1,
          padding: '0.75rem 1rem',
          borderRadius: tokens.roundness.full,
          border: `1px solid ${tokens.colors.outlineVariant}`,
          backgroundColor: tokens.colors.surfaceContainerLow,
          ...tokens.typography.bodyLg,
          outline: 'none',
        }}
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        aria-label="Send message"
        style={{
          backgroundColor: tokens.colors.primary,
          color: tokens.colors.onPrimary,
          border: 'none',
          width: '3rem',
          height: '3rem',
          borderRadius: tokens.roundness.full,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled || !input.trim() ? 0.6 : 1,
          transition: 'all 0.2s',
        }}
      >
        <Send size={20} />
      </button>
    </form>
  );
};

export default ChatInput;

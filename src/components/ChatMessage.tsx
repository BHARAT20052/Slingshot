import React from 'react';
import { tokens } from '../design-system';

interface ChatMessageProps {
  role: 'user' | 'model';
  text: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, text }) => {
  const isUser = role === 'user';
  
  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '1rem',
        padding: '0 1rem'
      }}
    >
      <div 
        style={{
          maxWidth: '80%',
          backgroundColor: isUser ? tokens.colors.primary : tokens.colors.surfaceContainerHigh,
          color: isUser ? tokens.colors.onPrimary : tokens.colors.onSurface,
          padding: '0.75rem 1rem',
          borderRadius: tokens.roundness.lg,
          borderBottomRightRadius: isUser ? '0' : tokens.roundness.lg,
          borderBottomLeftRadius: isUser ? tokens.roundness.lg : '0',
          ...tokens.typography.bodyLg,
          fontSize: '0.95rem',
          boxShadow: isUser ? 'none' : tokens.shadows.ambient,
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default ChatMessage;

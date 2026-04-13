import './App.css';
import type { ComponentType } from 'react';

declare const ChatInterface: ComponentType;
export default ChatInterface;

function App() {
  return (
    <ChatInterface />
  );
}
import { useState, useRef, useEffect } from 'react';
import { api } from '../lib/api';

const TOOL_CONFIGS = [
  { key: 'bio', icon: '✨', bg: 'rgba(108,99,255,0.2)', title: 'Generate Bio', desc: 'Create a professional bio instantly', welcome: "Hello! I'm your AI assistant. I'll help you generate a professional bio. Tell me about your experience, skills, and what kind of roles you're targeting." },
  { key: 'headline', icon: '🚀', bg: 'rgba(0,212,255,0.1)', title: 'Developer Headline', desc: 'Craft a punchy professional headline', welcome: "Let's craft an attention-grabbing headline! What is your current role and primary expertise?" },
  { key: 'review', icon: '📋', bg: 'rgba(255,107,107,0.1)', title: 'Portfolio Review', desc: 'Get AI feedback on your portfolio', welcome: "I can review your current portfolio data and provide constructive feedback. Just say 'Review my portfolio' to begin." },
  { key: 'project', icon: '💡', bg: 'rgba(74,222,128,0.1)', title: 'Project Description', desc: 'Write compelling project summaries', welcome: "Need help summarizing a project? Tell me the tech stack and what the project does." },
  { key: 'skills', icon: '🎯', bg: 'rgba(251,191,36,0.1)', title: 'Skill Recommendations', desc: 'Discover skills to boost your profile', welcome: "I can suggest skills based on your target role. What job are you aiming for?" }
];

export default function AIStudioPage() {
  const [activeTool, setActiveTool] = useState(TOOL_CONFIGS[0]);
  const [messages, setMessages] = useState([{ role: 'ai', text: TOOL_CONFIGS[0].welcome }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const changeTool = (tool) => {
    setActiveTool(tool);
    setMessages([{ role: 'ai', text: tool.welcome }]);
  };

  const simulateTyping = async (fullText) => {
    setMessages(prev => [...prev, { role: 'ai', text: '' }]);
    const chunks = fullText.split('');
    let currentText = '';
    
    for (let i = 0; i < chunks.length; i++) {
      currentText += chunks[i];
      setMessages(prev => {
        const newMsg = [...prev];
        newMsg[newMsg.length - 1] = { role: 'ai', text: currentText };
        return newMsg;
      });
      await new Promise(r => setTimeout(r, 15 + Math.random() * 20));
    }
  };

  const sendChat = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      if (activeTool.key === 'bio') {
        const res = await api.ai.generateBio({ role: 'Developer', skills: '', experience: text });
        await simulateTyping("Here is a premium bio for you:\n\n" + (res.bio || 'No bio generated.'));
      } else if (activeTool.key === 'review') {
        const res = await api.ai.reviewPortfolio();
        await simulateTyping("Here is my review:\n\n" + (res.review || 'No review generated.'));
      } else {
        // Mock response for other tools
        await new Promise(r => setTimeout(r, 800));
        await simulateTyping(`Based on your input "${text.slice(0, 30)}...", I suggest refining your approach. Try adding more specific metrics or outcomes!`);
      }
    } catch (err) {
      await simulateTyping('Error generating content: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '.5rem' }}>AI Studio</h2>
      <p style={{ color: 'var(--muted)', fontSize: '.9rem', marginBottom: '1.5rem' }}>
        Your AI-powered developer branding workspace
      </p>

      <div className="ai-studio-grid">
        {/* Tools Sidebar */}
        <div className="ai-tools">
          {TOOL_CONFIGS.map(tool => (
            <div 
              key={tool.key}
              className={`ai-tool-btn ${activeTool.key === tool.key ? 'active' : ''}`}
              onClick={() => changeTool(tool)}
            >
              <div className="ai-tool-icon" style={{ background: tool.bg }}>{tool.icon}</div>
              <div>
                <h4>{tool.title}</h4>
                <p>{tool.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <div className="ai-chat">
          <div className="chat-header">🤖 <span>{activeTool.title}</span></div>
          
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.role}`}>
                {msg.text.split('\n').map((line, j) => (
                  <span key={j}>{line}<br/></span>
                ))}
              </div>
            ))}
            {loading && (
              <div className="msg ai typing">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-row">
            <input 
              placeholder="Type your message..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChat()}
              disabled={loading}
            />
            <button className="chat-send" onClick={sendChat} disabled={loading || !input.trim()}>
              ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

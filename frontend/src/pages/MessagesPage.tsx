import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Send, User, Clock, Check,
  CheckCheck, Search, AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Conversation, Message } from '../types';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      setConversations(res.data);
      if (res.data.length > 0 && !activeConv) {
        setActiveConv(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (convId: number) => {
    try {
      const res = await api.get(`/messages/conversations/${convId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv.id);
      // Polite refresh every 10 seconds for current active conversation
      const interval = setInterval(() => fetchMessages(activeConv.id), 10000);
      return () => clearInterval(interval);
    }
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv || !inputText.trim()) return;

    setSendingMessage(true);
    const content = inputText.trim();
    setInputText('');

    try {
      const res = await api.post(`/messages/conversations/${activeConv.id}/messages`, {
        content
      });
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const getOtherParticipant = (conv: Conversation) => {
    if (conv.participant1_id === user?.id) {
      return conv.participant2;
    }
    return conv.participant1;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176B3A] mb-1">
          <MessageSquare className="w-4 h-4" />
          <span>Real-Time Agricultural Communications</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          In-App Messages
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Coordinate schedules, negotiate produce prices, and clarify equipment specifications directly with verified users.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[70vh] min-h-[550px]">
        {/* Conversation List (Left Column) */}
        <div className="border-r border-gray-100 flex flex-col h-full bg-stone-50/40">
          <div className="p-4 border-b border-gray-100">
            <span className="font-bold text-xs uppercase tracking-wider text-gray-700">
              Conversations ({conversations.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {isLoading ? (
              <div className="p-6 text-center text-xs text-gray-400">Loading conversations...</div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400">No active conversations yet.</div>
            ) : (
              conversations.map((c) => {
                const other = getOtherParticipant(c);
                const isSelected = activeConv?.id === c.id;

                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveConv(c)}
                    className={`p-4 cursor-pointer transition-colors flex items-start gap-3 ${
                      isSelected
                        ? 'bg-emerald-50/80 border-l-4 border-[#176B3A]'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#176B3A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {other?.full_name?.charAt(0) || 'U'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-gray-900 truncate">{other?.full_name}</h4>
                        {c.unread_count > 0 && (
                          <span className="w-4 h-4 rounded-full bg-[#176B3A] text-white text-[10px] font-bold flex items-center justify-center">
                            {c.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">{c.subject || 'Direct message'}</p>
                      {c.last_message && (
                        <p className="text-xs text-gray-600 truncate mt-1">
                          {c.last_message.content}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Message Thread (Right 2 Columns) */}
        <div className="md:col-span-2 flex flex-col h-full bg-white">
          {activeConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#176B3A] flex items-center justify-center font-bold text-xs">
                    {getOtherParticipant(activeConv)?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">
                      {getOtherParticipant(activeConv)?.full_name}
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      {activeConv.subject || 'Agricultural Discussion'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/30">
                {messages.map((m) => {
                  const isMe = m.sender_id === user?.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMe
                            ? 'bg-[#176B3A] text-white rounded-br-xs'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-xs shadow-2xs'
                        }`}
                      >
                        <p>{m.content}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 px-1">
                        {m.created_at?.slice(11, 16)}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 flex items-center gap-2 bg-white">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type message to coordinate..."
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#176B3A]"
                />
                <button
                  type="submit"
                  disabled={sendingMessage || !inputText.trim()}
                  className="p-2.5 rounded-xl bg-[#176B3A] text-white hover:bg-[#173D2A] disabled:opacity-30 transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-gray-400">
              Select a conversation to start messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

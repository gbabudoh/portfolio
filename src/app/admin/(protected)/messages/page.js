'use client';

import { useState, useEffect } from 'react';
import { Mail, Eye, Trash2, CheckCircle, Clock, X, RefreshCw } from 'lucide-react';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact');
      const data = await response.json();
      if (data.success) {
        // Convert read field from 0/1 to boolean
        const messagesWithBooleanRead = data.data.map(msg => ({
          ...msg,
          read: Boolean(msg.read)
        }));
        setMessages(messagesWithBooleanRead);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const refreshMessages = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await fetchMessages();
      setSuccess('Messages refreshed successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to refresh messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update the local state immediately for better UX
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === id ? { ...msg, read: true } : msg
          )
        );
        
        // Update selected message if it's the one being marked as read
        if (selectedMessage?.id === id) {
          setSelectedMessage(prev => ({ ...prev, read: true }));
        }
        
        setSuccess('Message marked as read');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to mark message as read');
        // Fallback to refetch if local update fails
        fetchMessages();
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
      setError('Network error. Please try again.');
      // Fallback to refetch on error
      fetchMessages();
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await fetch(`/api/contact/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchMessages();
          if (selectedMessage?.id === id) {
            setSelectedMessage(null);
          }
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = messages.filter(msg => !msg.read).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Contact Messages
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage contact form submissions from your portfolio
            </p>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={refreshMessages}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
        
        {unreadCount > 0 && (
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
            <Mail className="w-4 h-4 mr-2" />
            {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
          </div>
        )}
        
        {/* Success/Error Messages */}
        {success && (
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg text-sm font-medium">
            <CheckCircle className="w-4 h-4 mr-2" />
            {success}
          </div>
        )}
        {error && (
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg text-sm font-medium">
            <X className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  All Messages ({messages.length})
                </h3>
                <button
                  onClick={refreshMessages}
                  disabled={loading}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh messages"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  No messages yet
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => setSelectedMessage(message)}
                      className={`p-4 cursor-pointer transition-colors duration-200 ${
                        selectedMessage?.id === message.id
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      } ${!message.read ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {message.name}
                            </p>
                            {!message.read && (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {message.subject}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {formatDate(message.created_at)}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-2">
                          {!message.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(message.id);
                              }}
                              disabled={loading}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Mark as read"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMessage(message.id);
                            }}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete message"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Message Details
                  </h3>
                  <div className="flex items-center space-x-2">
                    {!selectedMessage.read && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Unread
                      </span>
                    )}
                    <button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete message"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    From
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedMessage.name}
                    </p>
                    <p className="text-blue-600 dark:text-blue-400">
                      {selectedMessage.email}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Subject
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedMessage.subject}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Message
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Received
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-900 dark:text-white">
                      {formatDate(selectedMessage.created_at)}
                    </p>
                  </div>
                </div>

                {!selectedMessage.read && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => markAsRead(selectedMessage.id)}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{loading ? 'Marking...' : 'Mark as Read'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
              <Mail className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select a Message
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose a message from the list to view its details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

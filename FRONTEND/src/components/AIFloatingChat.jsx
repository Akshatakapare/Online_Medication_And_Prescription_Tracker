import { useState } from 'react'
import { askAI } from '../api'

/**
 * AI FLOATING CHAT - WITH QUICK OPTIONS
 * =======================================
 * Bottom-right floating button
 * Opens chat popup with quick suggestion buttons
 */

function AIFloatingChat() {

    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { type: 'ai', text: 'Hi! 👋 I am your AI Health Assistant. Ask me anything about medicines or health!' }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    // Quick suggestion questions
    const quickSuggestions = [
        { icon: '💊', text: 'What is Paracetamol used for?', question: 'What is Paracetamol used for and what is the dosage?' },
        { icon: '🤒', text: 'How to reduce fever?', question: 'How to reduce fever naturally without medicine?' },
        { icon: '⚠️', text: 'Side effects of Antibiotics?', question: 'What are common side effects of antibiotics?' },
        { icon: '🩺', text: 'When to see a doctor?', question: 'What symptoms indicate I should see a doctor immediately?' }
    ]

    function toggleChat() {
        setIsOpen(!isOpen)
    }

    // Send quick question
    function handleQuickQuestion(question) {
        setInput(question)
        handleSend(question)
    }

    // Send message
    async function handleSend(customQuestion = null) {
        const questionToSend = customQuestion || input.trim()
        
        if (!questionToSend || loading) return

        // Add user message
        setMessages(prev => [...prev, { type: 'user', text: questionToSend }])
        setInput('')
        setLoading(true)

        try {
            const response = await askAI(questionToSend)

            if (response.success) {
                setMessages(prev => [...prev, { type: 'ai', text: response.answer }])
            } else {
                setMessages(prev => [...prev, { 
                    type: 'ai', 
                    text: response.answer || 'Sorry, please try again.' 
                }])
            }
        } catch (error) {
            setMessages(prev => [...prev, { 
                type: 'ai', 
                text: 'Connection error. Please try again.' 
            }])
        }

        setLoading(false)
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            handleSend()
        }
    }

    return (
        <>
            {/* ===== FLOATING BUTTON ===== */}
            <button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50 flex items-center justify-center"
                title="AI Health Assistant"
            >
                {isOpen ? (
                    <span className="text-xl">✕</span>
                ) : (
                    <span className="text-2xl">🤖</span>
                )}
            </button>

            {/* ===== CHAT POPUP ===== */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-fade-in border border-gray-200">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🤖</span>
                            <div>
                                <p className="font-bold text-sm">AI Health Assistant</p>
                                <p className="text-xs text-indigo-200">Powered by Google Gemini</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 h-80">
                        
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                                    msg.type === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-sm'
                                        : 'bg-white text-gray-800 shadow-sm rounded-bl-sm border border-gray-200'
                                }`}>
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}

                        {/* Loading Animation */}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                                        <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quick Suggestions - Show when chat just started */}
                        {messages.length === 1 && !loading && (
                            <div className="space-y-2 pt-2">
                                <p className="text-xs text-gray-500 px-1">💡 Try asking:</p>
                                {quickSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuickQuestion(suggestion.question)}
                                        className="w-full text-left px-3 py-2 bg-white text-sm text-gray-700 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition flex items-center gap-2"
                                    >
                                        <span className="text-lg">{suggestion.icon}</span>
                                        <span className="flex-1">{suggestion.text}</span>
                                        <span className="text-indigo-400 text-xs">→</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t bg-white">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your question..."
                                disabled={loading}
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-indigo-500 disabled:bg-gray-100"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={loading || !input.trim()}
                                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? '⏳' : '📤'}
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 text-center mt-1.5">
                            ⚠️ AI provides general info. Consult a doctor for medical advice.
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}

export default AIFloatingChat
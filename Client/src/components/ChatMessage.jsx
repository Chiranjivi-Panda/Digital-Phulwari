import React from 'react'
import { Bot, User } from 'lucide-react'

const ChatMessage = ({ message, isUser }) => {
  return (
    <div className={`flex mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center mr-2 shrink-0 mt-1">
          <Bot size={15} />
        </div>
      )}

      <div
        className={`max-w-[80%] sm:max-w-[70%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
          isUser
            ? 'bg-primary-600 text-white rounded-br-md'
            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-600 rounded-bl-md'
        }`}
      >
        {message}
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 flex items-center justify-center ml-2 shrink-0 mt-1">
          <User size={15} />
        </div>
      )}
    </div>
  )
}

export default ChatMessage
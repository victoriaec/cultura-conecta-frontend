import React from "react"

export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-w-2xl w-full bg-white rounded-lg p-6 z-10">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600">✕</button>
        {children}
      </div>
    </div>
  )
}
import React from 'react'


function TheLoad() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F0F0]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E91908] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[#505050] text-sm mt-4">Loading...</p>
        </div>
      </div>
  )
}

export default TheLoad
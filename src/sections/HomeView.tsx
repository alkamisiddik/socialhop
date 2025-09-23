import PostGenerator from '@/components/PostGenerator'
import React from 'react'

const HomeView = () => {
  return (
    <div className="rounded-2xl flex flex-col lg:flex-row justify-center-safe gap-40 !px-0">
      {/* Main feed */}
      <div className="flex-1 flex flex-col max-w-[55rem] mx-auto gap-4">
        <PostGenerator />
      </div>

      {/* Sidebar (hidden on small, visible on large) */}
      <aside className="hidden lg:flex flex-col flex-[0.35] max-w-[20rem] gap-4">
        <div className="!p-4 bg-white rounded-2xl shadow">
          <span className="font-semibold">Trends</span>
          {/* Replace with trends list */}
        </div>
        <div className="!p-4 bg-white rounded-2xl shadow">
          <span className="font-semibold">Sponsored</span>
          {/* Replace with ads */}
        </div>
      </aside>
    </div>
  )
}

export default HomeView

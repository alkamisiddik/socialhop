import HomeView from '@/sections/HomeView'
import React from 'react'

export const metadata = () => {
  return {
    title: "Home - Socialhop",
    description: "Welcome to SOcialhop, your gateway to seamless social media management and growth.",
  }
}

const HomePage = () => {
  return (
    <div>
      <HomeView />
    </div>

  )
}

export default HomePage

import Box from '@/components/Box'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { SettingsContextProvider } from '@/context/settings/settings-provider'
import ThemeProvider from '@/lib/ThemeProvider'
import React from 'react'

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SettingsContextProvider>
            <ThemeProvider>
                <Box
                    type='baseBg'
                    style={{
                        position: "relative",
                        width: "100vw",
                        height: "100vh",
                    }}>
                    <div className='fixed top-[85px] min-h-[calc(100vh-90px)] min-w-full flex flex-col overflow-auto'>
                        <Header />

                        <div className='flex gap-4 p-4 flex-grow max-[440px]:p-2'>
                            <Sidebar/>
                        </div>
                    </div>
                </Box>
            </ThemeProvider>
        </SettingsContextProvider>
    )
}

export default HomeLayout

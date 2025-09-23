import Box from '@/components/Box'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { SettingsContextProvider } from '@/context/settings/settings-provider'
import ThemeProvider from '@/lib/ThemeProvider'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import React from 'react'
import { Toaster } from 'react-hot-toast'

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();
    return (
        <SettingsContextProvider>
            <ThemeProvider>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <Box
                        type='baseBg'
                        style={{
                            position: "relative",
                            width: "100vw",
                            height: "100vh",
                        }}>
                        <div className='fixed top-[85px] min-h-[calc(100vh-85px)] min-w-full flex flex-col overflow-auto'>
                            <Header />

                            <div className='flex gap-4 flex-grow max-[440px]:p-2'>
                                <Sidebar />
                                <div className='flex-1'>{children}</div>
                            </div>
                        </div>
                    </Box>
                </HydrationBoundary>
                <Toaster position='top-right'/>
            </ThemeProvider>
        </SettingsContextProvider>
    )
}

export default HomeLayout

import React from 'react'
import Box from './Box'
import Image from 'next/image'
import { Flex } from 'antd'
import ModeButton from './ModeButton'
import { UserButton } from '@clerk/nextjs'
import SidebarButton from './SidebarButton'

const Header = () => {

    const userButtonAppearance = {
        elements: {
            userButtonAvatarBox: "!w-10 !h-10", // Example using Tailwind CSS classes
        },
    };

    return (
        <div className='fixed top-0 w-full h-[72px] overflow-hidden z-[999]'>
            <Box style={{ height: "100%" }}>
                <div className='flex items-center justify-between !py-4 !px-8 h-full'>
                    {/* Sidebar button */}
                    <div className='hidden max-[1268px]:block'>
                        <SidebarButton />
                    </div>
                    
                    {/* logo Left side */}
                    <Image
                        src={"/images/logo.png"}
                        alt='logo'
                        width={150}
                        height={40}
                        className='max-[1268px]:hidden'
                    />

                    {/* Right side */}
                    <Flex gap={25} align='center'>
                        {/* mode button */}
                        <ModeButton />

                        {/* user button */}
                        <UserButton appearance={userButtonAppearance} forceRedirectUrl='/sign-in' />
                    </Flex>
                </div>
            </Box>
        </div>
    )
}

export default Header

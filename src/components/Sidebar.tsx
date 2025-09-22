'use client'
import { sidebarRoute } from '@/lib/sidebarRoute'
import { Icon } from '@iconify/react'
import Link from "next/link"
import React, { useCallback } from 'react'
import Box from './Box'
import { useRouter, usePathname } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
import { Typography } from 'antd'
import SidebarContainer from './SidebarContainer'
import { useSettingsContext } from '@/context/settings/settings-context'

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useClerk();
  // Common classes for all sidebar items
  const itemClasses = "flex items-center gap-4 !px-6 !py-4 rounded-[5px] capitalize no-underline font-semibold transition-colors duration-200 hover:cursor-pointer hover:bg-[var(--primary-low)]";
  const {
    settings: { isSidebarOpen },
    setSettings,
  } = useSettingsContext();

  const handleDrawerClose = useCallback(() => {
    setSettings((prev) => ({ ...prev, isSidebarOpen: false }));
  }, [setSettings]);

  return (
    <SidebarContainer
      isDrawrOpen={isSidebarOpen}
      setIsDrawerOpen={handleDrawerClose}
    >
      <div className="pt-[72px] min-w-[18rem] rounded-2xl overflow-hidden flex min-h-[88vh]">
        <Box className="flex flex-col gap-2 w-full !p-2">
          {/* Sidebar routes */}
          {sidebarRoute().map((route, index) => (
            <Link
              href={route.route}
              key={index}
              className={`${itemClasses} ${pathname === route.route ? "bg-[var(--primary-low)]" : ""}`}
            >
              <Typography
                style={{
                  color: pathname === route.route ? "var(--primary)" : "",
                }}
              >
                <Icon icon={route.icon} width="20px" />
              </Typography>
              <Typography
                style={{
                  color: pathname === route.route ? "var(--primary)" : "",
                }}
              >
                <span>{route.name}</span>
              </Typography>
            </Link>
          ))}

          {/* Sign out */}
          <button
            onClick={() => signOut(() => router.push("/sign-in"))}
            className={`${itemClasses} text-left`}
          >
            <Typography>
              <Icon icon="solar:logout-2-bold" width="20px" />
            </Typography>

            <Typography>
              <span>Sign out</span>
            </Typography>
          </button>
        </Box>
      </div>
    </SidebarContainer>
  );
};

export default Sidebar;

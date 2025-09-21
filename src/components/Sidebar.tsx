'use client'
import { sidebarRoute } from '@/lib/sidebarRoute'
import { Icon } from '@iconify/react'
import Link from "next/link"
import React from 'react'
import Box from './Box'
import { useRouter, usePathname } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useClerk();

  // Common classes for all sidebar items
  const itemClasses =
    "flex items-center gap-4 py-4 px-6 rounded-[10px] capitalize no-underline font-semibold transition-colors duration-200 hover:cursor-pointer hover:bg-[var(--primary-low)]";

  return (
    <div className="pt-[72px] min-w-[18rem] rounded-2xl overflow-hidden flex min-h-[88vh] m-4">
      <Box className="flex flex-col gap-2 w-full p-2">
        {/* Sidebar routes */}
        {sidebarRoute().map((route, index) => (
          <Link
            href={route.route}
            key={index}
            className={`${itemClasses} ${pathname === route.route ? "bg-[var(--primary-low)]" : ""}`}
          >
            <Icon icon={route.icon} width="20px" />
            <span>{route.name}</span>
          </Link>
        ))}

        {/* Sign out */}
        <button
          onClick={() => signOut(() => router.push("/sign-in"))}
          className={`${itemClasses} text-left`}
        >
          <Icon icon="solar:logout-2-bold" width="20px" />
          <span>Sign out</span>
        </button>
      </Box>
    </div>
  );
};

export default Sidebar;

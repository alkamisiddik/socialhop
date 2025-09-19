import { type Metadata } from 'next'
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Social Hop',
  description: 'Social hope',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          card: "my-cl-card-no-shadow",
        },
        signIn: {
          variables: { colorPrimary: "#F9AA11" },
        },
        signUp: {
          variables: { colorPrimary: "#F9AA11" },
        },
      }}>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <AntdRegistry>{children}</AntdRegistry>
        </body>
      </html>
    </ClerkProvider>
  )
}
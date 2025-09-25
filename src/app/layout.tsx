import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Public_Sans } from 'next/font/google'
import '@ant-design/v5-patch-for-react-19';
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry';
import QueryProvider from '@/lib/QueryProvider';
import AntdRenderPatch from './AntdRenderPatch';

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Social Hop',
  description: 'A social media management tool to help you manage all your social media accounts in one place.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        theme: 'simple',
        signIn: {
          variables: { colorPrimary: "#F9AA11" },
        },
        signUp: {
          variables: { colorPrimary: "#F9AA11" },
        },
      }}>
      <html lang="en">
        <body className={publicSans.className}>
          <QueryProvider>
            <AntdRegistry>
              <AntdRenderPatch />
              {children}</AntdRegistry>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
import './globals.css';
import { Inter } from 'next/font/google';
import ClientLayout from '../components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PR Dev Tool',
  description: 'AI-powered pull request review tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen mt-10`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

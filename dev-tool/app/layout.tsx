import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
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
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
          <nav className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-3">
              <div className="flex justify-between items-center">
                <Link href="/" className="text-xl font-semibold text-gray-800">PR Dev Tool</Link>
                <ClientLayout>
                  {children}
                </ClientLayout>
              </div>
            </div>
          </nav>
        </div>
      </body>
    </html>
  );
}

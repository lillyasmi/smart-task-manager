import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata = {
  title: 'TaskFlow — Smart Task Manager',
  description: 'AI-powered task management app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0D0D0D',
              color: '#F5F2EB',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'DM Sans, sans-serif',
            },
            success: { iconTheme: { primary: '#4A7C6F', secondary: '#F5F2EB' } },
            error: { iconTheme: { primary: '#C0533A', secondary: '#F5F2EB' } },
          }}
        />
        {children}
      </body>
    </html>
  );
}

const React = require('react');
const Head = require('next/head');
const { useRouter } = require('next/router');

const Layout = ({ children, title = 'TrendMind - Discover AI Models' }) => {
  const router = useRouter();
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Discover and compare the latest AI models from Hugging Face" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <a href="/" className="text-blue-600 font-bold text-xl">
                    TrendMind
                  </a>
                </div>
              </div>
              
              <nav className="flex items-center space-x-4">
                <a 
                  href="/"
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    router.pathname === '/' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Home
                </a>
                <a 
                  href="/favorites"
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    router.pathname === '/favorites' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Favorites
                </a>
                <a 
                  href="/compare"
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    router.pathname === '/compare' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Compare
                </a>
              </nav>
            </div>
          </div>
        </header>
        
        <main className="flex-grow py-6">
          {children}
        </main>
        
        <footer className="bg-white border-t border-gray-200 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="text-center md:text-left">
                <p className="text-gray-500 text-sm">
                  &copy; {new Date().getFullYear()} TrendMind. All rights reserved.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <p className="text-gray-500 text-sm">
                  Data provided by <a href="https://huggingface.co" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Hugging Face</a>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

module.exports = Layout; 
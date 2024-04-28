export default function Footer() {
  return (
    <footer className="bg-white border-t mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">OrionDAO</h3>
            <p className="text-gray-600 text-sm">
              Progressive consensus governance system with quadratic voting and reputation mechanisms.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary-600 text-sm">Documentation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-600 text-sm">GitHub</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-600 text-sm">Discord</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-600 text-sm">Twitter</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary-600 text-sm">API Docs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-600 text-sm">Tutorials</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-600 text-sm">FAQs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-600 text-sm">Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-gray-600 text-sm">
            © 2024 OrionDAO. Built on Ethereum with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}


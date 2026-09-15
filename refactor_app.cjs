const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add Imports
content = content.replace(
  "import { AuthModal } from './components/AuthModal';",
  `import { AuthModal } from './components/AuthModal';
import { SEOArticle } from './components/SEOArticle';
import faqsData from './data/faqs.json';
import blogsData from './data/blogs.json';`
);

// 2. Add SEO State
content = content.replace(
  "const [activeTab, setActiveTab] = useState<'scan' | 'daily' | 'analytics'>('scan');",
  `const [activeTab, setActiveTab] = useState<'scan' | 'daily' | 'analytics' | 'seo'>('scan');
  const [seoData, setSeoData] = useState<any>(null);
  const [seoType, setSeoType] = useState<'blog' | 'faq'>('blog');`
);

// 3. Inject SEO render block right before </main>
const seoRenderBlock = `
        {activeTab === 'seo' && seoData && (
          <SEOArticle 
            type={seoType} 
            data={seoData} 
            onBack={() => {
              setActiveTab('scan');
              setSeoData(null);
              window.scrollTo(0, 0);
            }} 
          />
        )}
`;
content = content.replace(
  '</main>',
  seoRenderBlock + '\n      </main>'
);

// 4. Create the Mega Footer
const megaFooter = `
      {/* SEO Mega Footer */}
      <footer className="bg-slate-950 pt-16 pb-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            
            {/* Top Blogs Column 1 */}
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Featured Diet Guides</h4>
              <ul className="space-y-2 text-xs">
                {blogsData.slice(0, 50).map(b => (
                  <li key={b.id}>
                    <button 
                      onClick={() => {
                        setSeoData(b);
                        setSeoType('blog');
                        setActiveTab('seo');
                        window.scrollTo(0, 0);
                      }}
                      className="text-slate-400 hover:text-emerald-400 text-left transition-colors truncate w-full"
                    >
                      {b.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Blogs Column 2 */}
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Nutrition Strategy</h4>
              <ul className="space-y-2 text-xs">
                {blogsData.slice(25, 100).map(b => (
                  <li key={b.id}>
                    <button 
                      onClick={() => {
                        setSeoData(b);
                        setSeoType('blog');
                        setActiveTab('seo');
                        window.scrollTo(0, 0);
                      }}
                      className="text-slate-400 hover:text-emerald-400 text-left transition-colors truncate w-full"
                    >
                      {b.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQs Column 1 */}
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Common Questions</h4>
              <ul className="space-y-2 text-xs">
                {faqsData.slice(0, 50).map(f => (
                  <li key={f.id}>
                    <button 
                      onClick={() => {
                        setSeoData(f);
                        setSeoType('faq');
                        setActiveTab('seo');
                        window.scrollTo(0, 0);
                      }}
                      className="text-slate-400 hover:text-emerald-400 text-left transition-colors truncate w-full"
                    >
                      {f.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQs Column 2 */}
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">App Support</h4>
              <ul className="space-y-2 text-xs">
                {faqsData.slice(50, 100).map(f => (
                  <li key={f.id}>
                    <button 
                      onClick={() => {
                        setSeoData(f);
                        setSeoType('faq');
                        setActiveTab('seo');
                        window.scrollTo(0, 0);
                      }}
                      className="text-slate-400 hover:text-emerald-400 text-left transition-colors truncate w-full"
                    >
                      {f.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
            <p>Calorie Tracker &copy; 2026. Powered by Google Gemini Vision & Stripe Payments.</p>
            <p className="mt-2 text-[10px] text-slate-600">Disclaimer: AI nutritional analysis is an estimate and should not replace professional medical advice.</p>
          </div>
        </div>
      </footer>
`;

// Replace the old footer
content = content.replace(
  /<footer[\s\S]*?<\/footer>/,
  megaFooter
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("App.tsx refactored with SEO Mega Footer");

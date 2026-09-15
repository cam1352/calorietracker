const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'PlateScanner.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add cameraInputRef
content = content.replace(
  'const fileInputRef = useRef<HTMLInputElement>(null);',
  'const fileInputRef = useRef<HTMLInputElement>(null);\n  const cameraInputRef = useRef<HTMLInputElement>(null);'
);

// 2. Add recipes dummy data
const recipesCode = `
  const recommendedRecipes = [
    { id: 'r1', name: 'High Protein Chicken Bowl', time: '15 min', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
    { id: 'r2', name: 'Keto Salmon Salad', time: '10 min', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80' },
    { id: 'r3', name: 'Vegan Buddha Bowl', time: '20 min', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80' }
  ];
`;
content = content.replace('// Sample food presets for quick testing', recipesCode + '\n  // Sample food presets for quick testing');

// 3. Fix the inputs and buttons
content = content.replace(
  /<button[\s\S]*?onClick=\{startCamera\}[\s\S]*?<\/button>/,
  `<button
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Camera className="w-4 h-4" />
                  Open Camera
                </button>`
);

content = content.replace(
  /<input\s+ref=\{fileInputRef\}[\s\S]*?\/>/,
  `<input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />`
);

// 4. Inject Recipes Section and move Sample Plates down
const recipesSection = `
        {/* Recommended Recipes */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center sm:text-left">
            Recommended Recipes for you:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recommendedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="group relative rounded-xl overflow-hidden border border-slate-800 hover:border-emerald-500/60 transition-all text-left bg-slate-950 cursor-pointer"
              >
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-3 flex flex-col justify-end">
                  <span className="text-[12px] font-semibold text-white group-hover:text-emerald-300 leading-tight">
                    {recipe.name}
                  </span>
                  <span className="text-[10px] text-emerald-400 mt-1">{recipe.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
`;

// Insert the recipes section right before the "Sample Food Presets" div
content = content.replace(
  '{/* Sample Food Presets */}',
  recipesSection + '\n\n        {/* Sample Food Presets */}'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Modifications complete");

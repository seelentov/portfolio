const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const apps = [
  { dir: 'app-fitness', name: 'PULSE — фитнес-трекер', description: 'Демо мобильного приложения PULSE из портфолио Владислава Комкова' },
  { dir: 'app-meditation', name: 'STILL — медитация', description: 'Демо мобильного приложения STILL из портфолио Владислава Комкова' },
  { dir: 'app-finance', name: 'VAULT — финансы', description: 'Демо мобильного приложения VAULT из портфолио Владислава Комкова' },
];

const SDK = '56.0.0';

async function upload({ dir, name, description }) {
  const appDir = path.join(ROOT, dir);
  const pkg = JSON.parse(fs.readFileSync(path.join(appDir, 'package.json'), 'utf-8'));

  const dependencies = {};
  for (const [k, v] of Object.entries(pkg.dependencies || {})) {
    if (['react', 'react-dom', 'react-native', 'react-native-web', '@expo/metro-runtime', 'expo'].includes(k)) continue;
    dependencies[k] = { version: v.replace(/^[~^]/, '') };
  }

  const code = {
    'App.tsx': { contents: fs.readFileSync(path.join(appDir, 'App.tsx'), 'utf-8'), type: 'CODE' },
    'utils.js': { contents: fs.readFileSync(path.join(appDir, 'utils.js'), 'utf-8'), type: 'CODE' },
    'package.json': { contents: JSON.stringify({ dependencies: Object.fromEntries(Object.entries(dependencies).map(([k, v]) => [k, v.version])) }, null, 2), type: 'CODE' },
  };

  const manifest = { name, description, sdkVersion: SDK, dependencies };

  const res = await fetch('https://exp.host/--/api/v2/snack/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Snack-Api-Version': '3.0.0' },
    body: JSON.stringify({ manifest, code, dependencies }),
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }

  if (!res.ok || data.errors) {
    console.error(`[${dir}] FAILED status=${res.status}`);
    console.error(text);
    return null;
  }
  return data;
}

(async () => {
  const results = [];
  for (const app of apps) {
    console.log(`Uploading ${app.dir}...`);
    const r = await upload(app);
    if (r) {
      console.log(`  → id=${r.id} hashId=${r.hashId}`);
      results.push({ ...app, ...r });
    }
  }
  console.log('\nResults:');
  for (const r of results) {
    const url = `https://snack.expo.dev/${r.id || r.hashId}`;
    console.log(`  ${r.dir}: ${url}`);
  }
})();

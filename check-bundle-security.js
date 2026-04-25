const fs = require('fs'), path = require('path')
const dir = path.join(__dirname, '.next/static')

const FORBIDDEN = [
  'FIREBASE_ADMIN_PRIVATE_KEY', 
  'FIREBASE_ADMIN_CLIENT_EMAIL',
  'CLOUDINARY_API_SECRET', 
  'service_account', 
  'private_key'
]

if (!fs.existsSync(dir)) {
  console.error('❌ Erreur : Le dossier .next/static n\'existe pas. Veuillez lancer "npm run build" d\'abord.')
  process.exit(1)
}

function scan(d) {
  fs.readdirSync(d, {withFileTypes:true}).forEach(f => {
    const p = path.join(d, f.name)
    if (f.isDirectory()) return scan(p)
    if (!f.name.endsWith('.js')) return
    
    const c = fs.readFileSync(p, 'utf8')
    FORBIDDEN.forEach(s => {
      if (c.includes(s)) {
        console.error(`\x1b[31mFAILLE SÉCURITÉ :\x1b[0m La chaîne "${s}" a été trouvée dans le fichier ${f.name}`)
        console.error(`Chemin : ${p}`)
        process.exit(1)
      }
    })
  })
}

console.log('🔍 Scan du bundle JS pour détecter des clés sensibles...')
scan(dir)
console.log('\x1b[32m✅ SUCCESS :\x1b[0m Aucune clé sensible détectée dans le bundle client !')

import 'dotenv/config'
import { db } from '../src/lib/db'

async function main() {
  const firm = await db.firm.upsert({
    where: { slug: 'johnson-associates' },
    update: {},
    create: {
      name: 'Johnson & Associates',
      slug: 'johnson-associates',
      primaryColor: '#1a365d',
    },
  })

  console.log('Created test firm:', firm)
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))

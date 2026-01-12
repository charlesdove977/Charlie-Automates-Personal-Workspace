import { jsonResponse } from '@/lib/api'

export async function GET() {
  return jsonResponse({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0'
  })
}

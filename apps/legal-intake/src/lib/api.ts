import { NextResponse } from 'next/server'

export function jsonResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export function errorResponse(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status })
}

export function notFound(message = 'Not found') {
  return errorResponse(message, 404)
}

export function badRequest(message = 'Bad request') {
  return errorResponse(message, 400)
}

export function unauthorized(message = 'Unauthorized') {
  return errorResponse(message, 401)
}

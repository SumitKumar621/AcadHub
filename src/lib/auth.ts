import crypto from 'node:crypto'
import { SignJWT, jwtVerify } from 'jose'

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  const verify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return hash === verify
}

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_only_for_dev')

export async function createJWT(payload: any): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getSecret())
}

export async function verifyJWT(token: string): Promise<any> {
  const { payload } = await jwtVerify(token, getSecret())
  return payload
}

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// In a real production app, you'd want to use environment variables and proper hashing
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'portfolio2024!';

export function hashPassword(password) {
  // Simple hash function - in production, use bcrypt or similar
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
}

export function verifyPassword(inputPassword, storedHash) {
  return hashPassword(inputPassword) === storedHash;
}

export function createSession() {
  const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  return {
    sessionId,
    expiresAt: expiresAt.toISOString(),
    username: ADMIN_USERNAME
  };
}

export function getSession() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session');
  
  if (!sessionCookie) {
    return null;
  }
  
  try {
    const session = JSON.parse(decodeURIComponent(sessionCookie.value));
    
    // Check if session has expired
    if (new Date(session.expiresAt) < new Date()) {
      return null;
    }
    
    return session;
  } catch (error) {
    return null;
  }
}

export function requireAuth() {
  const session = getSession();
  
  if (!session) {
    redirect('/admin/login');
  }
  
  return session;
}

export function setSessionCookie(session) {
  const cookieStore = cookies();
  cookieStore.set('admin_session', JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/admin'
  });
}

export function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete('admin_session');
}

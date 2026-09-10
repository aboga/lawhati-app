import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { INITIAL_BOARDS, INITIAL_POSTS, INITIAL_CLASSES, TEMPLATES_LIBRARY, INITIAL_USER, INITIAL_NOTIFICATIONS, INITIAL_REPORTS, INITIAL_ADMIN_STATS, SUBSCRIPTION_PLANS } from './src/data/seedData';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
app.set('trust proxy', 1);
app.use((req, _res, next) => {
  const raw = req.headers.cookie || '';
  const cookies: Record<string,string> = {};
  raw.split(';').forEach(part => { const i = part.indexOf('='); if (i > -1) cookies[part.slice(0,i).trim()] = decodeURIComponent(part.slice(i+1).trim()); });
  (req as any).cookies = cookies;
  next();
});
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'lawhati-files';

const admin: SupabaseClient | null = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } })
  : null;

const authClient = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { autoRefreshToken: false, persistSession: false } })
  : null;

function requireConfig(res: express.Response): boolean {
  if (!admin || !authClient) {
    res.status(503).json({ error: 'لم يتم إعداد Supabase بعد. أضف متغيرات البيئة المطلوبة.' });
    return false;
  }
  return true;
}

async function getUser(req: express.Request) {
  if (!authClient) return null;
  const token = req.cookies?.['lawhati_access_token'] || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

function setAuthCookie(res: express.Response, accessToken: string, refreshToken?: string) {
  const maxAge = 1000 * 60 * 60 * 24 * 7;
  res.cookie('lawhati_access_token', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge });
  if (refreshToken) res.cookie('lawhati_refresh_token', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: maxAge * 4 });
}

function clearAuthCookies(res: express.Response) {
  res.clearCookie('lawhati_access_token');
  res.clearCookie('lawhati_refresh_token');
}

async function profileFor(user: any) {
  if (!admin || !user) return null;
  const { data } = await admin.from('profiles').select('*').eq('id', user.id).maybeSingle();
  return data || { id: user.id, name: user.user_metadata?.name || user.email?.split('@')[0] || 'مستخدم', username: user.user_metadata?.username || '', email: user.email || '', role: user.user_metadata?.role || 'user', avatar: user.user_metadata?.avatar || undefined };
}

function publicUser(profile: any) {
  if (!profile) return INITIAL_USER;
  return { ...INITIAL_USER, ...profile, id: profile.id };
}

async function currentUser(req: express.Request) {
  const u = await getUser(req);
  const p = await profileFor(u);
  return { authUser: u, profile: p, user: publicUser(p) };
}

async function seedIfEmpty() {
  if (!admin) return;
  const { count } = await admin.from('boards').select('id', { count: 'exact', head: true });
  if (count === 0) {
    const rows = INITIAL_BOARDS.map((b: any) => ({ id: b.id, owner_id: String(b.ownerId || 'demo'), data: b }));
    await admin.from('boards').insert(rows);
    const postRows: any[] = [];
    Object.entries(INITIAL_POSTS as any).forEach(([boardId, posts]: any) => (posts || []).forEach((p: any) => postRows.push({ id: p.id, board_id: boardId, data: p })));
    if (postRows.length) await admin.from('posts').insert(postRows);
  }
}

function getGeminiClient() {
  const key = process.env.GEMINI_API_KEY;
  return key ? new GoogleGenAI({ apiKey: key }) : null;
}

app.get('/api/health', async (_req, res) => {
  res.json({ status: 'ok', appName: 'لوحتي | Lawhati', database: !!admin, auth: !!authClient, storageBucket: STORAGE_BUCKET, timestamp: new Date().toISOString() });
});

// ---------------- Auth ----------------
app.get('/api/auth/me', async (req, res) => {
  if (!requireConfig(res)) return;
  const { authUser, user } = await currentUser(req);
  res.json({ user: authUser ? user : null });
});

app.post('/api/auth/register', async (req, res) => {
  if (!requireConfig(res)) return;
  const { name, username, email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان.' });
  if (password.length < 6) return res.status(400).json({ error: 'كلمة المرور يجب ألا تقل عن 6 أحرف.' });
  const { data, error } = await authClient!.auth.signUp({ email, password, options: { data: { name, username, role: role || 'teacher' } } });
  if (error) return res.status(400).json({ error: error.message });
  if (data.user) {
    await admin!.from('profiles').upsert({ id: data.user.id, name: name || email.split('@')[0], username: username || '', email, role: role || 'teacher' });
  }
  if (data.session) setAuthCookie(res, data.session.access_token, data.session.refresh_token);
  res.status(201).json({ success: true, requiresEmailConfirmation: !data.session, user: data.session ? publicUser(await profileFor(data.user)) : null });
});

app.post('/api/auth/login', async (req, res) => {
  if (!requireConfig(res)) return;
  const { email, password } = req.body;
  const { data, error } = await authClient!.auth.signInWithPassword({ email, password });
  if (error || !data.session || !data.user) return res.status(401).json({ error: error?.message || 'بيانات الدخول غير صحيحة.' });
  setAuthCookie(res, data.session.access_token, data.session.refresh_token);
  const profile = await profileFor(data.user);
  res.json({ success: true, user: publicUser(profile) });
});

app.post('/api/auth/logout', (_req, res) => { clearAuthCookies(res); res.json({ success: true }); });
app.post('/api/auth/switch-role', async (req, res) => {
  if (!requireConfig(res)) return;
  const { authUser } = await currentUser(req);
  if (!authUser) return res.status(401).json({ error: 'يجب تسجيل الدخول.' });
  const role = req.body.role;
  if (!['teacher', 'student', 'admin', 'user'].includes(role)) return res.status(400).json({ error: 'صلاحية غير صالحة.' });
  await admin!.from('profiles').update({ role }).eq('id', authUser.id);
  res.json({ success: true, user: publicUser(await profileFor(authUser)) });
});
app.post('/api/auth/forgot-password', async (req, res) => {
  if (!requireConfig(res)) return;
  const { email } = req.body;
  const redirect = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  const { error } = await authClient!.auth.resetPasswordForEmail(email, { redirectTo: `${redirect}/reset-password` });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

// ---------------- Boards ----------------
app.get('/api/boards', async (req, res) => {
  if (!requireConfig(res)) return;
  const { authUser } = await currentUser(req);
  const { filter, search, category } = req.query;
  let query = admin!.from('boards').select('data');
  if (filter === 'my' && authUser) query = query.eq('owner_id', authUser.id);
  if (filter === 'trash') query = query.filter('data->>isTrash', 'eq', 'true');
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  let result = (data || []).map((r: any) => r.data);
  if (filter === 'favorite') result = result.filter((b: any) => b.isFavorite && !b.isTrash);
  else if (filter === 'archived') result = result.filter((b: any) => b.isArchived && !b.isTrash);
  else if (filter !== 'trash') result = result.filter((b: any) => !b.isTrash && !b.isArchived);
  if (category && category !== 'all') result = result.filter((b: any) => b.category === category);
  if (typeof search === 'string' && search) { const q = search.toLowerCase(); result = result.filter((b: any) => `${b.title} ${b.description || ''} ${(b.tags || []).join(' ')}`.toLowerCase().includes(q)); }
  res.json({ boards: result });
});

app.get('/api/boards/:id', async (req, res) => {
  if (!requireConfig(res)) return;
  const { data: row, error } = await admin!.from('boards').select('data').eq('id', req.params.id).maybeSingle();
  if (error || !row) return res.status(404).json({ error: 'اللوحة غير موجودة' });
  const board = { ...(row as any).data, viewsCount: ((row as any).data.viewsCount || 0) + 1 };
  await admin!.from('boards').update({ data: board }).eq('id', req.params.id);
  const { data: posts } = await admin!.from('posts').select('data').eq('board_id', req.params.id).order('created_at', { ascending: false });
  res.json({ board, posts: (posts || []).map((p: any) => p.data) });
});

async function requireLoggedIn(req: express.Request, res: express.Response) {
  const { authUser, user } = await currentUser(req);
  if (!authUser) { res.status(401).json({ error: 'يجب تسجيل الدخول لتنفيذ هذا الإجراء.' }); return null; }
  return { authUser, user };
}

app.post('/api/boards', async (req, res) => {
  if (!requireConfig(res)) return;
  const auth = await requireLoggedIn(req, res); if (!auth) return;
  const id = 'board-' + crypto.randomUUID();
  const board = { id, title: req.body.title || 'لوحة جديدة بدون عنوان', description: req.body.description || '', type: req.body.type || 'wall', background: req.body.background || { type: 'gradient', value: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', name: 'سماء زرقاء' }, font: req.body.font || 'cairo', cardShape: req.body.cardShape || 'rounded', postOrdering: req.body.postOrdering || 'newest_first', privacy: req.body.privacy || 'public', password: req.body.password, ownerId: auth.authUser.id, ownerName: auth.user.name, ownerAvatar: auth.user.avatar, isFavorite: false, isArchived: false, isTrash: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), viewsCount: 1, sharesCount: 0, tags: req.body.tags || ['لوحة تفاعلية'], category: req.body.category || 'التعليم', members: [{ userId: auth.authUser.id, name: auth.user.name, email: auth.user.email, avatar: auth.user.avatar, role: 'owner', status: 'online' }], columns: req.body.columns || (req.body.type === 'columns' ? [{ id: 'col_1', title: 'الأفكار والملاحظات', color: '#fef08a' }, { id: 'col_2', title: 'قيد المناقشة', color: '#bae6fd' }, { id: 'col_3', title: 'المشاريع والأنشطة', color: '#bbf7d0' }] : undefined) };
  const { error } = await admin!.from('boards').insert({ id, owner_id: auth.authUser.id, data: board });
  if (error) return res.status(500).json({ error: error.message });
  for (const p of (req.body.initialPosts || [])) await admin!.from('posts').insert({ id: p.id || 'post-' + crypto.randomUUID(), board_id: id, data: { ...p, boardId: id, authorId: auth.authUser.id, authorName: auth.user.name } });
  const { data: posts } = await admin!.from('posts').select('data').eq('board_id', id);
  res.status(201).json({ board, posts: (posts || []).map((p: any) => p.data) });
});

app.put('/api/boards/:id', async (req, res) => {
  if (!requireConfig(res)) return;
  const auth = await requireLoggedIn(req, res); if (!auth) return;
  const { data: row } = await admin!.from('boards').select('data,owner_id').eq('id', req.params.id).maybeSingle();
  if (!row) return res.status(404).json({ error: 'اللوحة غير موجودة' });
  if ((row as any).owner_id !== auth.authUser.id) return res.status(403).json({ error: 'ليس لديك صلاحية تعديل هذه اللوحة.' });
  const board = { ...(row as any).data, ...req.body, updatedAt: new Date().toISOString() };
  const { error } = await admin!.from('boards').update({ data: board }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ board });
});

app.delete('/api/boards/:id', async (req, res) => {
  if (!requireConfig(res)) return;
  const auth = await requireLoggedIn(req, res); if (!auth) return;
  const { data: row } = await admin!.from('boards').select('data,owner_id').eq('id', req.params.id).maybeSingle();
  if (!row) return res.status(404).json({ error: 'اللوحة غير موجودة' });
  if ((row as any).owner_id !== auth.authUser.id) return res.status(403).json({ error: 'ليس لديك صلاحية.' });
  if (req.query.permanent === 'true') { await admin!.from('posts').delete().eq('board_id', req.params.id); await admin!.from('boards').delete().eq('id', req.params.id); }
  else { const board = { ...(row as any).data, isTrash: true, trashedAt: new Date().toISOString() }; await admin!.from('boards').update({ data: board }).eq('id', req.params.id); }
  res.json({ success: true });
});
app.post('/api/boards/:id/restore', async (req, res) => {
  if (!requireConfig(res)) return; const auth = await requireLoggedIn(req, res); if (!auth) return;
  const { data: row } = await admin!.from('boards').select('data,owner_id').eq('id', req.params.id).maybeSingle();
  if (!row || (row as any).owner_id !== auth.authUser.id) return res.status(404).json({ error: 'اللوحة غير موجودة' });
  const board = { ...(row as any).data, isTrash: false, trashedAt: undefined }; await admin!.from('boards').update({ data: board }).eq('id', req.params.id); res.json({ success: true, board });
});
app.post('/api/boards/:id/duplicate', async (req, res) => {
  if (!requireConfig(res)) return; const auth = await requireLoggedIn(req, res); if (!auth) return;
  const { data: row } = await admin!.from('boards').select('data').eq('id', req.params.id).maybeSingle(); if (!row) return res.status(404).json({ error: 'اللوحة غير موجودة' });
  const newId = 'board-' + crypto.randomUUID(); const original = (row as any).data; const board = { ...JSON.parse(JSON.stringify(original)), id: newId, title: original.title + ' (نسخة)', ownerId: auth.authUser.id, ownerName: auth.user.name, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), viewsCount: 0, sharesCount: 0 };
  await admin!.from('boards').insert({ id: newId, owner_id: auth.authUser.id, data: board });
  const { data: oldPosts } = await admin!.from('posts').select('data').eq('board_id', req.params.id);
  for (const p of oldPosts || []) { const d = { ...(p as any).data, id: 'post-' + crypto.randomUUID(), boardId: newId, authorId: auth.authUser.id, authorName: auth.user.name, createdAt: new Date().toISOString() }; await admin!.from('posts').insert({ id: d.id, board_id: newId, data: d }); }
  const { data: newPosts } = await admin!.from('posts').select('data').eq('board_id', newId); res.json({ board, posts: (newPosts || []).map((p: any) => p.data) });
});

// ---------------- Posts ----------------
app.get('/api/boards/:id/posts', async (req, res) => { if (!requireConfig(res)) return; const { data } = await admin!.from('posts').select('data').eq('board_id', req.params.id).order('created_at', { ascending: false }); res.json({ posts: (data || []).map((p: any) => p.data) }); });

app.post('/api/boards/:id/posts', async (req, res) => {
  if (!requireConfig(res)) return; const auth = await requireLoggedIn(req, res); if (!auth) return;
  const id = 'post-' + crypto.randomUUID(); const newPost = { id, boardId: req.params.id, ...req.body, authorId: auth.authUser.id, authorName: auth.user.name, authorAvatar: auth.user.avatar, reactions: req.body.reactions || { '❤️': 0, '👏': 0, '👍': 0, '💡': 0, '😂': 0 }, userReactions: {}, comments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  const { error } = await admin!.from('posts').insert({ id, board_id: req.params.id, data: newPost }); if (error) return res.status(500).json({ error: error.message }); res.status(201).json({ post: newPost });
});

app.put('/api/boards/:id/posts/:postId', async (req, res) => { if (!requireConfig(res)) return; const auth = await requireLoggedIn(req, res); if (!auth) return; const { data: row } = await admin!.from('posts').select('data').eq('id', req.params.postId).eq('board_id', req.params.id).maybeSingle(); if (!row) return res.status(404).json({ error: 'المنشور غير موجود' }); const post = { ...(row as any).data, ...req.body, updatedAt: new Date().toISOString() }; const { error } = await admin!.from('posts').update({ data: post }).eq('id', req.params.postId); if (error) return res.status(500).json({ error: error.message }); res.json({ post }); });
app.delete('/api/boards/:id/posts/:postId', async (req, res) => { if (!requireConfig(res)) return; const auth = await requireLoggedIn(req, res); if (!auth) return; await admin!.from('posts').delete().eq('id', req.params.postId).eq('board_id', req.params.id); res.json({ success: true }); });

async function mutatePost(req: express.Request, res: express.Response, fn: (post: any, userId: string) => any) {
  if (!requireConfig(res)) return; const auth = await requireLoggedIn(req, res); if (!auth) return; const { data: row } = await admin!.from('posts').select('data').eq('id', req.params.postId).eq('board_id', req.params.id).maybeSingle(); if (!row) return res.status(404).json({ error: 'المنشور غير موجود' }); const post = fn({ ...(row as any).data }, auth.authUser.id); const { error } = await admin!.from('posts').update({ data: { ...post, updatedAt: new Date().toISOString() } }).eq('id', req.params.postId); if (error) return res.status(500).json({ error: error.message }); res.json({ post });
}
app.post('/api/boards/:id/posts/:postId/react', (req, res) => mutatePost(req, res, (post, uid) => { const emoji = req.body.emoji; post.reactions ||= {}; post.userReactions ||= {}; const users = post.userReactions[emoji] || []; if (users.includes(uid)) { post.userReactions[emoji] = users.filter((u: string) => u !== uid); post.reactions[emoji] = Math.max(0, (post.reactions[emoji] || 1) - 1); } else { post.userReactions[emoji] = [...users, uid]; post.reactions[emoji] = (post.reactions[emoji] || 0) + 1; } return post; }));
app.post('/api/boards/:id/posts/:postId/comments', (req, res) => mutatePost(req, res, (post, uid) => { const c = { id: 'comm-' + crypto.randomUUID(), postId: post.id, authorId: uid, authorName: req.body.authorName || 'مستخدم', content: req.body.content, createdAt: new Date().toISOString(), replies: [] }; post.comments ||= []; if (req.body.parentCommentId) { const parent = post.comments.find((x: any) => x.id === req.body.parentCommentId); if (parent) (parent.replies ||= []).push(c); else post.comments.push(c); } else post.comments.push(c); return post; }));
app.post('/api/boards/:id/posts/:postId/vote', (req, res) => mutatePost(req, res, (post, uid) => { if (!post.pollData) return post; for (const o of post.pollData.options || []) { o.voters ||= []; if (o.voters.includes(uid)) { o.voters = o.voters.filter((u: string) => u !== uid); o.votes = Math.max(0, (o.votes || 1) - 1); } } const target = (post.pollData.options || []).find((o: any) => o.id === req.body.optionId); if (target) { target.voters ||= []; target.voters.push(uid); target.votes = (target.votes || 0) + 1; } return post; }));
app.post('/api/boards/:id/posts/:postId/toggle-task', (req, res) => mutatePost(req, res, (post) => { const t = (post.tasks || []).find((x: any) => x.id === req.body.taskId); if (t) t.completed = !t.completed; return post; }));

// ---------------- Uploads ----------------
app.post('/api/upload', async (req, res) => {
  if (!requireConfig(res)) return; const auth = await requireLoggedIn(req, res); if (!auth) return;
  const { fileName, fileType, fileData } = req.body; if (!fileData) return res.status(400).json({ error: 'لم يتم إرسال ملف.' });
  if (!fileData.startsWith('data:')) return res.status(400).json({ error: 'صيغة الملف غير مدعومة.' });
  const base64 = fileData.split(',')[1] || ''; const buffer = Buffer.from(base64, 'base64');
  if (buffer.length > 20 * 1024 * 1024) return res.status(413).json({ error: 'الحد الأقصى للملف في النسخة التجريبية 20MB.' });
  const safe = String(fileName || 'file').replace(/[^a-zA-Z0-9._-]/g, '_'); const objectPath = `${auth.authUser.id}/${Date.now()}-${crypto.randomUUID()}-${safe}`;
  const { error } = await admin!.storage.from(STORAGE_BUCKET).upload(objectPath, buffer, { contentType: fileType || 'application/octet-stream', upsert: false });
  if (error) return res.status(500).json({ error: error.message });
  const { data: signed, error: signError } = await admin!.storage.from(STORAGE_BUCKET).createSignedUrl(objectPath, 60 * 60 * 24 * 7);
  if (signError) return res.status(500).json({ error: signError.message });
  res.json({ url: signed.signedUrl, path: objectPath, fileName: fileName || safe, fileType: fileType || 'application/octet-stream' });
});

// ---------------- Education / templates / reports / admin ----------------
let classes = [...INITIAL_CLASSES]; let notifications = [...INITIAL_NOTIFICATIONS]; let reports = [...INITIAL_REPORTS]; let subscriptionPlans = [...SUBSCRIPTION_PLANS]; let adminStats = { ...INITIAL_ADMIN_STATS };
app.get('/api/classes', (_req, res) => res.json({ classes }));
app.post('/api/classes', async (req, res) => { const auth = await requireLoggedIn(req, res); if (!auth) return; const c = { id: 'cls_' + crypto.randomUUID(), name: req.body.name || 'فصل دراسي جديد', code: 'CLS-' + Math.floor(100 + Math.random() * 900), subject: req.body.subject || 'مادة عامة', grade: req.body.grade || 'المرحلة الدراسية', teacherId: auth.authUser.id, teacherName: auth.user.name, teacherAvatar: auth.user.avatar, studentsCount: 0, boardsCount: 0, boardIds: [], assignments: [] }; classes.unshift(c as any); res.status(201).json({ classRoom: c }); });
app.get('/api/templates', (_req, res) => res.json({ templates: TEMPLATES_LIBRARY }));
app.get('/api/notifications', (_req, res) => res.json({ notifications }));
app.post('/api/notifications/read-all', (_req, res) => { notifications = notifications.map(n => ({ ...n, isRead: true })); res.json({ success: true }); });
app.get('/api/reports', (_req, res) => res.json({ reports }));
app.post('/api/reports', (req, res) => { const r = { ...req.body, id: 'rep_' + crypto.randomUUID(), status: 'pending', createdAt: new Date().toISOString() }; reports.unshift(r as any); res.status(201).json({ report: r }); });
app.post('/api/reports/:id/resolve', (req, res) => { const r: any = reports.find((x: any) => x.id === req.params.id); if (r) r.status = req.body.status || 'resolved'; res.json({ success: true, report: r }); });
app.get('/api/admin/stats', async (_req, res) => { if (admin) { const [b,p,u] = await Promise.all([admin.from('boards').select('id',{count:'exact',head:true}), admin.from('posts').select('id',{count:'exact',head:true}), admin.from('profiles').select('id',{count:'exact',head:true})]); adminStats = { ...adminStats, boardsCount: b.count || 0, postsCount: p.count || 0, usersCount: u.count || 0 }; } res.json({ stats: adminStats }); });
app.get('/api/admin/subscriptions', (_req, res) => res.json({ plans: subscriptionPlans }));
app.put('/api/admin/subscriptions/:id', (req, res) => { const i = subscriptionPlans.findIndex((p: any) => p.id === req.params.id); if (i >= 0) subscriptionPlans[i] = { ...subscriptionPlans[i], ...req.body }; res.json({ success: true, plan: subscriptionPlans[i] }); });

// ---------------- AI ----------------
app.post('/api/ai/generate-board', async (req, res) => { const { prompt } = req.body; if (!prompt) return res.status(400).json({ error: 'يرجى كتابة وصف اللوحة المطلوبة' }); const ai = getGeminiClient(); if (ai) { try { const response = await ai.models.generateContent({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash', contents: `صمم بيانات لوحة رقمية تعليمية باللغة العربية بناءً على الطلب التالي: ${prompt}. أعد JSON بسيطًا يحتوي title وdescription.` }); return res.json({ boardData: { title: prompt, description: response.text?.trim() || '' } }); } catch {} } res.json({ boardData: { title: prompt, description: 'لوحة تعليمية تفاعلية مقترحة.' } }); });
app.post('/api/ai/summarize', async (req, res) => { const ai = getGeminiClient(); if (ai && req.body.postsContent) { try { const r = await ai.models.generateContent({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash', contents: `لخص المحتوى التالي بالعربية في 3 إلى 5 نقاط:\n${req.body.postsContent}` }); return res.json({ summary: r.text?.trim() }); } catch {} } res.json({ summary: '• ملخص تجريبي للمحتوى.\n• أظهر المشاركون تفاعلاً جيدًا.\n• يوصى بمواصلة النقاش.' }); });
app.post('/api/ai/suggest', async (req, res) => { const ai = getGeminiClient(); if (ai && req.body.topic) { try { const r = await ai.models.generateContent({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash', contents: `اقترح 4 أفكار إبداعية لمنشورات تفاعلية عن: ${req.body.topic}.` }); return res.json({ suggestions: r.text?.trim() }); } catch {} } res.json({ suggestions: '• استطلاع رأي.\n• تحدي رسم.\n• تسجيل صوتي قصير.\n• سؤال نقاشي.' }); });

async function startServer() {
  if (process.env.NODE_ENV !== 'production') { const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' }); app.use(vite.middlewares); }
  else { const distPath = path.join(process.cwd(), 'dist'); app.use(express.static(distPath)); app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html'))); }
  if (admin) await seedIfEmpty();
  app.listen(PORT, '0.0.0.0', () => console.log(`لوحتي | Lawhati running on ${PORT}`));
}
startServer();

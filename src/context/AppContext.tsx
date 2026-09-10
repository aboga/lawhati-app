import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Board, Post, ClassRoom, BoardTemplate, NotificationItem, ReportItem, SubscriptionPlan, AdminStats } from '../types';
import { INITIAL_USER, INITIAL_BOARDS, INITIAL_POSTS, INITIAL_CLASSES, TEMPLATES_LIBRARY, INITIAL_NOTIFICATIONS, INITIAL_REPORTS, INITIAL_ADMIN_STATS, SUBSCRIPTION_PLANS } from '../data/seedData';

type ViewMode = 'splash' | 'landing' | 'dashboard' | 'board' | 'education' | 'templates' | 'admin';

interface AppContextType {
  // Navigation & Theme
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean | ((prev: boolean) => boolean)) => void;
  direction: 'rtl' | 'ltr';
  
  // Auth & User
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  switchRole: (role: 'teacher' | 'student' | 'admin' | 'user') => void;
  logout: () => Promise<void>;
  refreshBoards: () => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  
  // Boards
  boards: Board[];
  activeBoard: Board | null;
  activeBoardPosts: Post[];
  setActiveBoardId: (id: string | null) => void;
  createBoard: (boardData: Partial<Board>, initialPosts?: any[]) => Promise<Board>;
  updateBoard: (id: string, updates: Partial<Board>) => Promise<void>;
  deleteBoard: (id: string, permanent?: boolean) => Promise<void>;
  restoreBoard: (id: string) => Promise<void>;
  duplicateBoard: (id: string) => Promise<Board>;
  toggleFavorite: (id: string) => void;
  archiveBoard: (id: string) => void;
  
  // Posts
  createPost: (postData: Partial<Post>) => Promise<Post>;
  updatePost: (postId: string, updates: Partial<Post>) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  reactToPost: (postId: string, emoji: string) => Promise<void>;
  addComment: (postId: string, content: string, parentCommentId?: string) => Promise<void>;
  votePoll: (postId: string, optionId: string) => Promise<void>;
  toggleTask: (postId: string, taskId: string) => Promise<void>;
  
  // Modals & UI States
  isCreateBoardOpen: boolean;
  setIsCreateBoardOpen: (open: boolean) => void;
  isCreatePostOpen: boolean;
  setIsCreatePostOpen: (open: boolean) => void;
  selectedColumnForPost: string | undefined;
  setSelectedColumnForPost: (colId: string | undefined) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  isAnalyticsOpen: boolean;
  setIsAnalyticsOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  reportTarget: { type: 'post' | 'board' | 'user' | 'comment'; id: string; title: string } | null;
  setReportTarget: (target: { type: 'post' | 'board' | 'user' | 'comment'; id: string; title: string } | null) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeFilter: 'all' | 'my' | 'shared' | 'favorite' | 'archived' | 'trash';
  setActiveFilter: (f: 'all' | 'my' | 'shared' | 'favorite' | 'archived' | 'trash') => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationsAsRead: () => void;
  
  // Education
  classes: ClassRoom[];
  createClass: (name: string, subject: string, grade: string) => Promise<void>;
  
  // Templates & Admin
  templates: BoardTemplate[];
  reports: ReportItem[];
  submitReport: (reason: any, details?: string) => Promise<void>;
  resolveReport: (id: string, status: 'resolved' | 'dismissed') => Promise<void>;
  adminStats: AdminStats;
  subscriptionPlans: SubscriptionPlan[];
  updateSubscriptionPlan: (id: string, updates: Partial<SubscriptionPlan>) => Promise<void>;

  // Real-time collaboration simulation
  isCollaborating: boolean;
  activeTypingUser: string | null;
  onlineUsersCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Boards and Posts
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoardId, setActiveBoardIdState] = useState<string | null>(null);
  const [postsStore, setPostsStore] = useState<Record<string, Post[]>>({});

  // Modals
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedColumnForPost, setSelectedColumnForPost] = useState<string | undefined>(undefined);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: 'post' | 'board' | 'user' | 'comment'; id: string; title: string } | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'my' | 'shared' | 'favorite' | 'archived' | 'trash'>('all');

  // Classes & Notifications & Admin
  const [classes, setClasses] = useState<ClassRoom[]>(INITIAL_CLASSES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [templates] = useState<BoardTemplate[]>(TEMPLATES_LIBRARY);
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [adminStats, setAdminStats] = useState<AdminStats>(INITIAL_ADMIN_STATS);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(SUBSCRIPTION_PLANS);

  // Real-time simulated state
  const [isCollaborating] = useState(true);
  const [activeTypingUser, setActiveTypingUser] = useState<string | null>(null);
  const [onlineUsersCount, setOnlineUsersCount] = useState<number>(4);

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  // Apply dark mode and dir to html
  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [direction, language, isDarkMode]);

  const refreshBoards = async () => {
    try {
      const res = await fetch('/api/boards?filter=my', { credentials: 'same-origin' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'تعذر تحميل اللوحات');
      setBoards(Array.isArray(data.boards) ? data.boards : []);
      setPostsStore({});
      setActiveBoardIdState(null);
    } catch {
      setBoards([]);
      setPostsStore({});
      setActiveBoardIdState(null);
    }
  };

  // Restore the authenticated session, then load only that user's boards.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
        const data = await res.json();
        if (data.user) {
          setUser(prev => ({ ...prev, ...data.user }));
          await refreshBoards();
        } else {
          setBoards([]);
          setPostsStore({});
        }
      } catch {
        setBoards([]);
        setPostsStore({});
      }
    })();
  }, []);

  // Periodic typing simulation on active board for real-time collaboration feel
  useEffect(() => {
    if (!activeBoardId) return;
    const interval = setInterval(() => {
      const users = ['ريان السالم', 'سارة خالد', 'عمر القحطاني', null, null];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      setActiveTypingUser(randomUser);
    }, 9000);
    return () => clearInterval(interval);
  }, [activeBoardId]);

  const activeBoard = boards.find(b => b.id === activeBoardId) || null;
  const activeBoardPosts = activeBoardId ? (postsStore[activeBoardId] || []) : [];

  const setActiveBoardId = (id: string | null) => {
    setActiveBoardIdState(id);
    if (id) {
      setCurrentView('board');
      // fetch posts from server
      fetch(`/api/boards/${id}/posts`)
        .then(res => res.json())
        .then(data => {
          if (data.posts) {
            setPostsStore(prev => ({ ...prev, [id]: data.posts }));
          }
        })
        .catch(() => {});
    }
  };

  const switchRole = (role: 'teacher' | 'student' | 'admin' | 'user') => {
    setUser(prev => ({ ...prev, role }));
    fetch('/api/auth/switch-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    }).catch(() => {});
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    } finally {
      setBoards([]);
      setPostsStore({});
      setActiveBoardIdState(null);
      setUser(INITIAL_USER);
      setSearchQuery('');
      setActiveFilter('all');
      setCurrentView('landing');
      setIsAuthModalOpen(true);
    }
  };

  const createBoard = async (boardData: Partial<Board>, initialPosts: any[] = []): Promise<Board> => {
    const res = await fetch('/api/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ ...boardData, initialPosts }),
    });
    const data = await res.json();
    if (!res.ok || !data.board) {
      throw new Error(data.error || 'تعذر إنشاء اللوحة');
    }

    setBoards(prev => [data.board, ...prev.filter(b => b.id !== data.board.id)]);
    setPostsStore(prev => ({ ...prev, [data.board.id]: data.posts || [] }));
    setActiveBoardIdState(data.board.id);
    setCurrentView('board');
    return data.board;
  };

  const updateBoard = async (id: string, updates: Partial<Board>) => {
    setBoards(prev => prev.map(b => (b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b)));
    fetch(`/api/boards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(() => {});
  };

  const deleteBoard = async (id: string, permanent = false) => {
    if (permanent) {
      setBoards(prev => prev.filter(b => b.id !== id));
      setPostsStore(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } else {
      setBoards(prev => prev.map(b => (b.id === id ? { ...b, isTrash: true, trashedAt: new Date().toISOString() } : b)));
    }

    if (activeBoardId === id) {
      setActiveBoardIdState(null);
      setCurrentView('dashboard');
    }

    fetch(`/api/boards/${id}?permanent=${permanent}`, { method: 'DELETE' }).catch(() => {});
  };

  const restoreBoard = async (id: string) => {
    setBoards(prev => prev.map(b => (b.id === id ? { ...b, isTrash: false, trashedAt: undefined } : b)));
    fetch(`/api/boards/${id}/restore`, { method: 'POST' }).catch(() => {});
  };

  const duplicateBoard = async (id: string): Promise<Board> => {
    try {
      const res = await fetch(`/api/boards/${id}/duplicate`, { method: 'POST' });
      const data = await res.json();
      if (data.board) {
        setBoards(prev => [data.board, ...prev]);
        setPostsStore(prev => ({ ...prev, [data.board.id]: data.posts || [] }));
        return data.board;
      }
    } catch (e) {}

    const original = boards.find(b => b.id === id)!;
    const newBoard = {
      ...original,
      id: 'board-' + Date.now(),
      title: original.title + ' (نسخة)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBoards(prev => [newBoard, ...prev]);
    setPostsStore(prev => ({ ...prev, [newBoard.id]: [...(postsStore[id] || [])] }));
    return newBoard;
  };

  const toggleFavorite = (id: string) => {
    const board = boards.find(b => b.id === id);
    if (board) {
      updateBoard(id, { isFavorite: !board.isFavorite });
    }
  };

  const archiveBoard = (id: string) => {
    const board = boards.find(b => b.id === id);
    if (board) {
      updateBoard(id, { isArchived: !board.isArchived });
    }
  };

  // Posts operations
  const createPost = async (postData: Partial<Post>): Promise<Post> => {
    if (!activeBoardId) throw new Error('لم يتم تحديد لوحة نشطة');
    const boardId = activeBoardId;
    let payload: Partial<Post> = { ...postData };

    // Persist browser-selected media in Supabase Storage before saving the post.
    if (payload.mediaUrl?.startsWith('data:')) {
      const match = payload.mediaUrl.match(/^data:([^;]+);base64,/);
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          fileName: payload.fileName || `attachment-${Date.now()}`,
          fileType: match?.[1] || 'application/octet-stream',
          fileData: payload.mediaUrl,
        }),
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.url) throw new Error(uploadData.error || 'تعذر رفع الملف');
      payload = { ...payload, mediaUrl: uploadData.url, fileName: uploadData.fileName || payload.fileName };
    }

    const res = await fetch(`/api/boards/${boardId}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.post) throw new Error(data.error || 'تعذر إضافة المنشور');

    setPostsStore(prev => ({
      ...prev,
      [boardId]: [data.post, ...(prev[boardId] || [])],
    }));
    return data.post;
  };

  const updatePost = async (postId: string, updates: Partial<Post>) => {
    if (!activeBoardId) return;
    const boardId = activeBoardId;

    setPostsStore(prev => ({
      ...prev,
      [boardId]: (prev[boardId] || []).map(p => (p.id === postId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)),
    }));

    fetch(`/api/boards/${boardId}/posts/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(() => {});
  };

  const deletePost = async (postId: string) => {
    if (!activeBoardId) return;
    const boardId = activeBoardId;

    setPostsStore(prev => ({
      ...prev,
      [boardId]: (prev[boardId] || []).filter(p => p.id !== postId),
    }));

    fetch(`/api/boards/${boardId}/posts/${postId}`, { method: 'DELETE' }).catch(() => {});
  };

  const reactToPost = async (postId: string, emoji: string) => {
    if (!activeBoardId) return;
    const boardId = activeBoardId;

    setPostsStore(prev => {
      const current = prev[boardId] || [];
      const updated = current.map(p => {
        if (p.id !== postId) return p;
        const reactions = { ...(p.reactions || {}) };
        const userReactions = { ...(p.userReactions || {}) };
        const users = userReactions[emoji] || [];
        const hasReacted = users.includes(user.id);

        if (hasReacted) {
          userReactions[emoji] = users.filter(u => u !== user.id);
          reactions[emoji] = Math.max(0, (reactions[emoji] || 1) - 1);
        } else {
          userReactions[emoji] = [...users, user.id];
          reactions[emoji] = (reactions[emoji] || 0) + 1;
        }

        return { ...p, reactions, userReactions };
      });
      return { ...prev, [boardId]: updated };
    });

    fetch(`/api/boards/${boardId}/posts/${postId}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emoji }),
    }).catch(() => {});
  };

  const addComment = async (postId: string, content: string, parentCommentId?: string) => {
    if (!activeBoardId || !content.trim()) return;
    const boardId = activeBoardId;

    const newComment = {
      id: 'comm_' + Date.now(),
      postId,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      content,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    setPostsStore(prev => {
      const current = prev[boardId] || [];
      const updated = current.map(p => {
        if (p.id !== postId) return p;
        const comments = [...(p.comments || [])];
        if (parentCommentId) {
          const parent = comments.find(c => c.id === parentCommentId);
          if (parent) {
            parent.replies = [...(parent.replies || []), newComment];
          } else {
            comments.push(newComment);
          }
        } else {
          comments.push(newComment);
        }
        return { ...p, comments };
      });
      return { ...prev, [boardId]: updated };
    });

    fetch(`/api/boards/${boardId}/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, parentCommentId }),
    }).catch(() => {});
  };

  const votePoll = async (postId: string, optionId: string) => {
    if (!activeBoardId) return;
    const boardId = activeBoardId;

    setPostsStore(prev => {
      const current = prev[boardId] || [];
      const updated = current.map(p => {
        if (p.id !== postId || !p.pollData) return p;
        const options = p.pollData.options.map(opt => {
          let voters = opt.voters || [];
          let votes = opt.votes || 0;
          if (voters.includes(user.id)) {
            voters = voters.filter(u => u !== user.id);
            votes = Math.max(0, votes - 1);
          }
          if (opt.id === optionId) {
            voters = [...voters, user.id];
            votes += 1;
          }
          return { ...opt, votes, voters };
        });
        return { ...p, pollData: { ...p.pollData, options } };
      });
      return { ...prev, [boardId]: updated };
    });

    fetch(`/api/boards/${boardId}/posts/${postId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionId }),
    }).catch(() => {});
  };

  const toggleTask = async (postId: string, taskId: string) => {
    if (!activeBoardId) return;
    const boardId = activeBoardId;

    setPostsStore(prev => {
      const current = prev[boardId] || [];
      const updated = current.map(p => {
        if (p.id !== postId || !p.tasks) return p;
        const tasks = p.tasks.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t));
        return { ...p, tasks };
      });
      return { ...prev, [boardId]: updated };
    });

    fetch(`/api/boards/${boardId}/posts/${postId}/toggle-task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId }),
    }).catch(() => {});
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    fetch('/api/notifications/read-all', { method: 'POST' }).catch(() => {});
  };

  const createClass = async (name: string, subject: string, grade: string) => {
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subject, grade }),
      });
      const data = await res.json();
      if (data.classRoom) {
        setClasses(prev => [data.classRoom, ...prev]);
      }
    } catch (e) {
      const newClass: ClassRoom = {
        id: 'cls_' + Date.now(),
        name,
        code: 'CLS-' + Math.floor(100 + Math.random() * 900),
        subject,
        grade,
        teacherId: user.id,
        teacherName: user.name,
        teacherAvatar: user.avatar,
        studentsCount: 0,
        boardsCount: 0,
        boardIds: [],
        assignments: [],
      };
      setClasses(prev => [newClass, ...prev]);
    }
  };

  const submitReport = async (reason: any, details?: string) => {
    if (!reportTarget) return;
    const newReport: ReportItem = {
      id: 'rep_' + Date.now(),
      targetType: reportTarget.type,
      targetId: reportTarget.id,
      targetTitle: reportTarget.title,
      reason,
      reporterName: user.name,
      reporterEmail: user.email,
      details,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setReports(prev => [newReport, ...prev]);
    fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReport),
    }).catch(() => {});
  };

  const resolveReport = async (id: string, status: 'resolved' | 'dismissed') => {
    setReports(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
    fetch(`/api/reports/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  };

  const updateSubscriptionPlan = async (id: string, updates: Partial<SubscriptionPlan>) => {
    setSubscriptionPlans(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    fetch(`/api/admin/subscriptions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(() => {});
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        language,
        setLanguage,
        isDarkMode,
        setIsDarkMode,
        direction,
        user,
        setUser,
        switchRole,
        logout,
        refreshBoards,
        isAuthModalOpen,
        setIsAuthModalOpen,
        boards,
        activeBoard,
        activeBoardPosts,
        setActiveBoardId,
        createBoard,
        updateBoard,
        deleteBoard,
        restoreBoard,
        duplicateBoard,
        toggleFavorite,
        archiveBoard,
        createPost,
        updatePost,
        deletePost,
        reactToPost,
        addComment,
        votePoll,
        toggleTask,
        isCreateBoardOpen,
        setIsCreateBoardOpen,
        isCreatePostOpen,
        setIsCreatePostOpen,
        selectedColumnForPost,
        setSelectedColumnForPost,
        isShareModalOpen,
        setIsShareModalOpen,
        isAiModalOpen,
        setIsAiModalOpen,
        isAnalyticsOpen,
        setIsAnalyticsOpen,
        isProfileOpen,
        setIsProfileOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        reportTarget,
        setReportTarget,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        notifications,
        unreadNotificationsCount,
        markNotificationsAsRead,
        classes,
        createClass,
        templates,
        reports,
        submitReport,
        resolveReport,
        adminStats,
        subscriptionPlans,
        updateSubscriptionPlan,
        isCollaborating,
        activeTypingUser,
        onlineUsersCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

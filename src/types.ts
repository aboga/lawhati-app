export type BoardType = 
  | 'wall' 
  | 'grid' 
  | 'columns' 
  | 'list' 
  | 'timeline' 
  | 'map' 
  | 'canvas' 
  | 'gallery' 
  | 'presentation' 
  | 'qa';

export type PostType = 
  | 'text' 
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'file' 
  | 'link' 
  | 'location' 
  | 'drawing' 
  | 'poll' 
  | 'qa' 
  | 'task' 
  | 'list' 
  | 'gif';

export type MemberRole = 
  | 'owner' 
  | 'admin' 
  | 'editor' 
  | 'contributor' 
  | 'viewer' 
  | 'commenter';

export type PrivacyLevel = 
  | 'private' 
  | 'password' 
  | 'link' 
  | 'members' 
  | 'public';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  avatar: string;
  bio?: string;
  role: 'teacher' | 'student' | 'admin' | 'user';
  plan: 'free' | 'pro' | 'education' | 'school';
  twoFactorEnabled?: boolean;
  schoolName?: string;
  createdAt: string;
}

export interface BoardMember {
  userId: string;
  name: string;
  email: string;
  avatar: string;
  role: MemberRole;
  status: 'online' | 'offline';
  lastSeen?: string;
  isTyping?: boolean;
}

export interface BoardColumn {
  id: string;
  title: string;
  color?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters: string[];
}

export interface PollData {
  question: string;
  options: PollOption[];
  showResultsMode: 'immediate' | 'after_vote' | 'hidden';
}

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export interface Post {
  id: string;
  boardId: string;
  columnId?: string;
  title: string;
  content: string;
  type: PostType;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  color?: string;
  emoji?: string;
  isPinned?: boolean;
  isImportant?: boolean;
  allowComments?: boolean;
  allowReactions?: boolean;
  reactions: Record<string, number>; // e.g. { '❤️': 5, '👏': 3, '👍': 10, '💡': 4, '😂': 2 }
  userReactions?: Record<string, string[]>; // emoji -> list of userIds
  comments: Comment[];
  pollData?: PollData;
  tasks?: TaskItem[];
  locationData?: {
    name: string;
    address?: string;
    lat?: number;
    lng?: number;
  };
  drawingData?: string; // base64 data url of canvas
  timelineDate?: string;
  order: number;
  x?: number; // for canvas mode
  y?: number; // for canvas mode
  createdAt: string;
  updatedAt: string;
}

export interface BoardBackground {
  type: 'color' | 'gradient' | 'pattern' | 'image';
  value: string;
  name?: string;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  type: BoardType;
  background: BoardBackground;
  font: string; // 'cairo' | 'tajawal' | 'outfit' | 'system'
  cardShape: 'rounded' | 'elevated' | 'bordered' | 'minimal';
  postOrdering: 'newest_first' | 'oldest_first' | 'manual';
  privacy: PrivacyLevel;
  password?: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
  isTrash?: boolean;
  trashedAt?: string;
  createdAt: string;
  updatedAt: string;
  members: BoardMember[];
  columns?: BoardColumn[];
  viewsCount: number;
  sharesCount: number;
  tags?: string[];
  category?: string;
}

export type BoardMemberRole = MemberRole;
export type ClassGroup = ClassRoom;

export interface BoardTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  type?: BoardType;
  boardType?: BoardType;
  background?: BoardBackground;
  backgroundValue?: string;
  tags?: string[];
  samplePostsCount?: number;
  columns?: any[];
  initialPosts?: any[];
}

export interface NotificationItem {
  id: string;
  type: 'invite' | 'post' | 'comment' | 'reaction' | 'task' | 'mention' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  boardId?: string;
  senderName?: string;
  senderAvatar?: string;
}

export interface ReportItem {
  id: string;
  targetType: 'post' | 'board' | 'user' | 'comment';
  targetId: string;
  targetTitle: string;
  reason: 'inappropriate' | 'harassment' | 'spam' | 'impersonation' | 'violation' | 'other';
  reporterName: string;
  reporterEmail?: string;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  code: string;
  subject: string;
  grade: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  studentsCount: number;
  boardsCount: number;
  boardIds: string[];
  assignments: Assignment[];
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  description: string;
  dueDate: string;
  maxGrade: number;
  submissionsCount: number;
  submissions: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  studentId: string;
  studentName: string;
  studentAvatar: string;
  submittedAt: string;
  content: string;
  fileUrl?: string;
  grade?: number;
  feedback?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  nameAr: string;
  priceMonthly: number;
  priceYearly: number;
  descriptionAr: string;
  featuresAr: string[];
  isPopular?: boolean;
}

export interface AdminStats {
  usersCount: number;
  activeUsers: number;
  boardsCount: number;
  postsCount: number;
  filesCount: number;
  schoolsCount: number;
  teachersCount: number;
  studentsCount: number;
}

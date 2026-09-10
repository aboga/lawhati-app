import React, { useState } from 'react';
import { 
  Heart, ThumbsUp, Sparkles, MoreVertical, Pin, AlertCircle, 
  MessageSquare, Share2, Trash2, Edit3, Flag, CheckSquare, 
  Play, Pause, Download, ExternalLink, MapPin, Send, CornerDownLeft,
  Check, UserCheck, Shield
} from 'lucide-react';
import { Post } from '../types';
import { useApp } from '../context/AppContext';

interface PostCardProps {
  post: Post;
  onEdit?: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onEdit }) => {
  const { 
    user, 
    reactToPost, 
    addComment, 
    votePoll, 
    toggleTask, 
    deletePost, 
    updatePost,
    setReportTarget,
    setIsReportModalOpen
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);

  const emojiReactions = [
    { emoji: '❤️', label: 'حب' },
    { emoji: '👏', label: 'تصفيق' },
    { emoji: '👍', label: 'أعجبني' },
    { emoji: '💡', label: 'فكرة رائعة' },
    { emoji: '😂', label: 'ضحك' },
  ];

  const handleTogglePin = () => {
    updatePost(post.id, { isPinned: !post.isPinned });
    setIsMenuOpen(false);
  };

  const handleToggleImportant = () => {
    updatePost(post.id, { isImportant: !post.isImportant });
    setIsMenuOpen(false);
  };

  const handleReport = () => {
    setReportTarget({
      type: 'post',
      id: post.id,
      title: post.title || 'منشور: ' + post.content.slice(0, 30),
    });
    setIsReportModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment(post.id, newCommentText.trim(), replyingToCommentId || undefined);
    setNewCommentText('');
    setReplyingToCommentId(null);
  };

  // Poll total votes calculation
  const totalPollVotes = post.pollData?.options.reduce((acc, curr) => acc + (curr.votes || 0), 0) || 0;

  return (
    <article
      id={`post-${post.id}`}
      className={`group relative rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${
        post.isPinned ? 'ring-2 ring-amber-400 dark:ring-amber-500/60' : ''
      } ${
        post.isImportant ? 'border-rose-300 dark:border-rose-900/60' : 'border-slate-200/80 dark:border-slate-800'
      }`}
      style={{
        backgroundColor: post.color || '#ffffff',
      }}
    >
      {/* Important Banner */}
      {post.isImportant && (
        <div className="bg-rose-500 text-white text-[11px] font-bold py-1 px-3 flex items-center gap-1.5 shadow-xs">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>منشور هام وتنبيه معتمد</span>
        </div>
      )}

      {/* Card Header */}
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          {/* Author info & Badges */}
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={post.authorName}
              className="w-8 h-8 rounded-xl object-cover ring-1 ring-black/10 flex-shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {post.authorName}
                </span>
                {post.isPinned && (
                  <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" title="مثبت في الأعلى" />
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-medium block">
                {new Date(post.createdAt).toLocaleDateString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Options Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-black/5 transition cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div className="absolute left-0 rtl:left-0 rtl:right-auto top-8 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-30 text-xs font-semibold text-slate-700 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-150">
                {onEdit && (
                  <button
                    onClick={() => { onEdit(post); setIsMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-start"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                    <span>تعديل المنشور</span>
                  </button>
                )}

                <button
                  onClick={handleTogglePin}
                  className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-start"
                >
                  <Pin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{post.isPinned ? 'إلغاء التثبيت' : 'تثبيت في الأعلى'}</span>
                </button>

                <button
                  onClick={handleToggleImportant}
                  className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-start"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>{post.isImportant ? 'إلغاء التمييز' : 'تمييز كمنشور هام'}</span>
                </button>

                <button
                  onClick={handleReport}
                  className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-start text-amber-600"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>إبلاغ عن محتوى</span>
                </button>

                <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                <button
                  onClick={() => { deletePost(post.id); setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 text-start"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف المنشور</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Post Title & Emoji */}
        {post.title && (
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-3 flex items-center gap-1.5 leading-snug">
            {post.emoji && <span className="text-lg flex-shrink-0">{post.emoji}</span>}
            <span>{post.title}</span>
          </h3>
        )}
      </div>

      {/* Main Content Body */}
      <div className="px-4 py-1 space-y-3 text-slate-800 text-xs sm:text-sm">
        {/* Text Content */}
        {post.content && (
          <p className="whitespace-pre-line leading-relaxed font-medium">
            {post.content}
          </p>
        )}

        {/* Media: Image */}
        {post.type === 'image' && post.mediaUrl && (
          <div className="rounded-xl overflow-hidden border border-black/10 max-h-80 bg-slate-100">
            <img
              src={post.mediaUrl}
              alt={post.title || 'صورة المنشور'}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        )}

        {/* Media: Hand Drawing */}
        {post.type === 'drawing' && (post.drawingData || post.mediaUrl) && (
          <div className="rounded-xl overflow-hidden border border-black/10 bg-white p-2">
            <img
              src={post.drawingData || post.mediaUrl}
              alt="رسم يدوي"
              className="w-full max-h-60 object-contain mx-auto"
            />
          </div>
        )}

        {/* Media: Audio Player */}
        {post.type === 'audio' && post.mediaUrl && (
          <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center gap-3">
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="w-9 h-9 rounded-full bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shadow-md flex-shrink-0"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 mr-0.5 fill-current" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{post.fileName || 'تسجيل صوتي'}</p>
              <div className="flex items-center gap-1 h-3 mt-1">
                {[30, 70, 45, 90, 60, 100, 50, 75, 40, 85].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-sky-400 rounded-full ${isPlayingAudio ? 'animate-pulse' : 'opacity-40'}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            {isPlayingAudio && (
              <audio
                src={post.mediaUrl}
                autoPlay
                onEnded={() => setIsPlayingAudio(false)}
                className="hidden"
              />
            )}
          </div>
        )}

        {/* Media: Document File */}
        {post.type === 'file' && (
          <div className="p-3 rounded-xl border border-black/10 bg-white/70 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                PDF
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{post.fileName || 'مستند مرفق'}</p>
                <p className="text-[10px] text-slate-500">{post.fileSize || '2.4 MB'}</p>
              </div>
            </div>
            {post.mediaUrl && (
              <a
                href={post.mediaUrl}
                download={post.fileName || 'download'}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <Download className="w-4 h-4" />
              </a>
            )}
          </div>
        )}

        {/* Interactive Poll Component */}
        {post.type === 'poll' && post.pollData && (
          <div className="space-y-2 pt-1">
            <p className="font-bold text-xs text-slate-900">{post.pollData.question}</p>
            <div className="space-y-1.5">
              {post.pollData.options.map((opt) => {
                const isVoted = opt.voters?.includes(user.id);
                const percent = totalPollVotes > 0 ? Math.round(((opt.votes || 0) / totalPollVotes) * 100) : 0;
                return (
                  <button
                    key={opt.id}
                    onClick={() => votePoll(post.id, opt.id)}
                    className={`w-full relative p-2.5 rounded-xl border text-start overflow-hidden transition group ${
                      isVoted
                        ? 'border-sky-500 bg-sky-50/70 font-bold'
                        : 'border-black/10 hover:border-sky-300 bg-white/70'
                    }`}
                  >
                    {/* Animated Percentage Fill Bar */}
                    <div
                      className="absolute inset-y-0 right-0 bg-sky-200/40 dark:bg-sky-500/20 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                    <div className="relative z-10 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-900">
                        {isVoted && <Check className="w-3.5 h-3.5 text-sky-600 font-bold" />}
                        <span>{opt.text}</span>
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-700">
                        {percent}% ({opt.votes || 0})
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-500 text-end">إجمالي الأصوات: {totalPollVotes}</p>
          </div>
        )}

        {/* Interactive Task Checklist */}
        {post.type === 'task' && post.tasks && (
          <div className="space-y-1.5 pt-1">
            {post.tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(post.id, task.id)}
                className="w-full flex items-start gap-2 p-1.5 rounded-lg hover:bg-black/5 text-start transition"
              >
                <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition ${
                  task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-400 bg-white'
                }`}>
                  {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={`text-xs ${task.completed ? 'line-through text-slate-400 font-normal' : 'text-slate-800 font-medium'}`}>
                  {task.text}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Location Tag */}
        {post.type === 'location' && post.locationData && (
          <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center gap-2 text-xs text-sky-800 font-bold">
            <MapPin className="w-4 h-4 text-sky-600 flex-shrink-0" />
            <span>{post.locationData.address || post.locationData.name}</span>
          </div>
        )}
      </div>

      {/* Footer: Reactions Bar & Comments Counter */}
      <div className="mt-3 pt-2.5 px-3 pb-3 border-t border-black/5 flex items-center justify-between gap-2">
        {/* Reactions */}
        {post.allowReactions && (
          <div className="flex items-center gap-1 flex-wrap">
            {emojiReactions.map((item) => {
              const count = post.reactions?.[item.emoji] || 0;
              const hasReacted = post.userReactions?.[item.emoji]?.includes(user.id);
              return (
                <button
                  key={item.emoji}
                  onClick={() => reactToPost(post.id, item.emoji)}
                  className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 transition ${
                    hasReacted
                      ? 'bg-sky-100 ring-1 ring-sky-400 font-bold scale-105'
                      : 'hover:bg-black/5 text-slate-600'
                  }`}
                  title={item.label}
                >
                  <span>{item.emoji}</span>
                  {count > 0 && <span className="text-[10px] font-mono">{count}</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Comments Toggle */}
        {post.allowComments && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-black/5 transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>{post.comments?.length || 0}</span>
          </button>
        )}
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && post.allowComments && (
        <div className="p-3.5 bg-black/5 border-t border-black/10 space-y-3 text-xs">
          {/* Comments List */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comm) => (
                <div key={comm.id} className="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl space-y-1 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{comm.authorName}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(comm.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{comm.content}</p>

                  {/* Sub-replies */}
                  {comm.replies && comm.replies.length > 0 && (
                    <div className="pr-3 mt-1.5 space-y-1.5 border-r-2 border-sky-400">
                      {comm.replies.map((reply) => (
                        <div key={reply.id} className="bg-slate-50 dark:bg-slate-900 p-1.5 rounded-lg">
                          <span className="font-bold text-[11px] text-sky-600">{reply.authorName}: </span>
                          <span className="text-[11px] text-slate-600 dark:text-slate-400">{reply.content}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Action button */}
                  <button
                    onClick={() => setReplyingToCommentId(comm.id)}
                    className="text-[10px] text-sky-600 hover:underline pt-0.5 block"
                  >
                    رد على التعليق
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-[11px] text-slate-400 py-1">لا توجد تعليقات بعد، كن أول من يعلق!</p>
            )}
          </div>

          {/* Add Comment Input */}
          <form onSubmit={handleAddComment} className="flex gap-2 items-center">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder={replyingToCommentId ? 'اكتب ردك هنا...' : 'اكتب تعليقاً...'}
              className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-xs transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
};

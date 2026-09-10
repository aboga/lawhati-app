import React, { useState } from 'react';
import { 
  X, Type, Image as ImageIcon, Video, Mic, Paperclip, 
  Link as LinkIcon, MapPin, Palette, BarChart3, HelpCircle, 
  CheckSquare, Pin, AlertCircle, Sparkles, Plus, Trash2, Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PostType, Post } from '../types';
import { DrawingPad } from './DrawingPad';
import { AudioRecorder } from './AudioRecorder';

interface PostEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPost?: Post | null;
  columnId?: string;
}

export const PostEditorModal: React.FC<PostEditorModalProps> = ({ 
  isOpen, 
  onClose, 
  editingPost, 
  columnId 
}) => {
  const { createPost, updatePost, selectedColumnForPost } = useApp();

  const [title, setTitle] = useState(editingPost?.title || '');
  const [content, setContent] = useState(editingPost?.content || '');
  const [type, setType] = useState<PostType>(editingPost?.type || 'text');
  const [color, setColor] = useState(editingPost?.color || '#ffffff');
  const [emoji, setEmoji] = useState(editingPost?.emoji || '');
  const [isPinned, setIsPinned] = useState(editingPost?.isPinned || false);
  const [isImportant, setIsImportant] = useState(editingPost?.isImportant || false);
  const [allowComments, setAllowComments] = useState(editingPost?.allowComments ?? true);
  const [allowReactions, setAllowReactions] = useState(editingPost?.allowReactions ?? true);

  // Media states
  const [mediaUrl, setMediaUrl] = useState(editingPost?.mediaUrl || '');
  const [fileName, setFileName] = useState(editingPost?.fileName || '');
  const [fileSize, setFileSize] = useState(editingPost?.fileSize || '');
  const [drawingData, setDrawingData] = useState(editingPost?.drawingData || '');

  // Poll state
  const [pollQuestion, setPollQuestion] = useState(editingPost?.pollData?.question || '');
  const [pollOptions, setPollOptions] = useState<string[]>(
    editingPost?.pollData?.options?.map(o => o.text) || ['الخيار الأول', 'الخيار الثاني']
  );

  // Tasks state
  const [tasks, setTasks] = useState<{ id: string; text: string; completed: boolean }[]>(
    editingPost?.tasks || [{ id: 't_1', text: 'المهمة الأولى', completed: false }]
  );

  // Location state
  const [locationName, setLocationName] = useState(editingPost?.locationData?.address || '');

  // Sub-tools toggles
  const [showDrawingPad, setShowDrawingPad] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  if (!isOpen) return null;

  const colorPalettes = [
    { code: '#ffffff', name: 'أبيض' },
    { code: '#f0f9ff', name: 'أزرق ثلجي' },
    { code: '#f0fdf4', name: 'أخضر نعناعي' },
    { code: '#fefce8', name: 'أصفر كريمي' },
    { code: '#faf5ff', name: 'بنفسجي هادئ' },
    { code: '#fff1f2', name: 'وردي لطيف' },
    { code: '#ffedd5', name: 'برتقالي مشرق' },
  ];

  const contentTypes: { id: PostType; label: string; icon: any }[] = [
    { id: 'text', label: 'نص', icon: Type },
    { id: 'image', label: 'صورة', icon: ImageIcon },
    { id: 'video', label: 'فيديو', icon: Video },
    { id: 'audio', label: 'صوت', icon: Mic },
    { id: 'file', label: 'ملف', icon: Paperclip },
    { id: 'drawing', label: 'رسم يدوي', icon: Palette },
    { id: 'poll', label: 'استطلاع', icon: BarChart3 },
    { id: 'task', label: 'مهام', icon: CheckSquare },
    { id: 'qa', label: 'سؤال ونقاش', icon: HelpCircle },
    { id: 'location', label: 'موقع', icon: MapPin },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');

    const reader = new FileReader();
    reader.onload = () => {
      setMediaUrl(reader.result as string);
      if (file.type.startsWith('image/')) {
        setType('image');
      } else if (file.type.startsWith('video/')) {
        setType('video');
      } else if (file.type.startsWith('audio/')) {
        setType('audio');
      } else {
        setType('file');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postPayload: Partial<Post> = {
      title: title.trim(),
      content: content.trim(),
      type,
      color,
      emoji: emoji || undefined,
      isPinned,
      isImportant,
      allowComments,
      allowReactions,
      mediaUrl: mediaUrl || undefined,
      fileName: fileName || undefined,
      fileSize: fileSize || undefined,
      drawingData: drawingData || undefined,
      columnId: columnId || selectedColumnForPost || editingPost?.columnId,
    };

    if (type === 'poll') {
      postPayload.pollData = {
        question: pollQuestion || title || 'استطلاع رأي',
        showResultsMode: 'immediate',
        options: pollOptions.filter(o => o.trim()).map((opt, i) => ({
          id: 'opt_' + i,
          text: opt.trim(),
          votes: 0,
          voters: [],
        })),
      };
    }

    if (type === 'task') {
      postPayload.tasks = tasks.filter(t => t.text.trim());
    }

    if (type === 'location') {
      postPayload.locationData = {
        name: locationName || 'موقع محدد',
        address: locationName,
        lat: 24.7136,
        lng: 46.6753,
      };
    }

    if (editingPost) {
      await updatePost(editingPost.id, postPayload);
    } else {
      await createPost(postPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors"
        style={{ backgroundColor: color }}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-black/10 bg-black/5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-slate-900">
              {editingPost ? 'تعديل المنشور' : 'إضافة منشور جديد'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-black/5 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Content Type Selector Pill Bar */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">نوع المحتوى:</label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
              {contentTypes.map((ct) => {
                const Icon = ct.icon;
                const isSelected = type === ct.id;
                return (
                  <button
                    key={ct.id}
                    type="button"
                    onClick={() => {
                      setType(ct.id);
                      if (ct.id === 'drawing') setShowDrawingPad(true);
                      if (ct.id === 'audio') setShowAudioRecorder(true);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white/80 hover:bg-white text-slate-700 border border-black/10'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{ct.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title & Emoji */}
          <div className="flex gap-2">
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="💡"
              className="w-12 text-center text-lg p-2.5 rounded-xl border border-black/15 bg-white/90 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              title="رمز تعبيري"
            />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان المنشور أو الفكرة..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-black/15 bg-white/90 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Text Content Area */}
          <div>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب أفكارك وملاحظاتك هنا بالتفصيل..."
              className="w-full p-3.5 rounded-xl border border-black/15 bg-white/90 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Conditional Sub-Editor based on selected type */}
          {type === 'drawing' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">الرسم اليدوي:</label>
              {showDrawingPad ? (
                <DrawingPad
                  onSave={(dataUrl) => {
                    setDrawingData(dataUrl);
                    setShowDrawingPad(false);
                  }}
                  onCancel={() => setShowDrawingPad(false)}
                  initialData={drawingData}
                />
              ) : drawingData ? (
                <div className="p-3 bg-white/90 rounded-2xl border border-black/10 flex items-center justify-between">
                  <img src={drawingData} alt="رسم" className="h-16 rounded object-contain" />
                  <button
                    type="button"
                    onClick={() => setShowDrawingPad(true)}
                    className="text-xs font-bold text-sky-600 hover:underline"
                  >
                    تعديل الرسم ↗
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDrawingPad(true)}
                  className="w-full py-4 border-2 border-dashed border-sky-400 bg-sky-50/50 rounded-2xl text-xs font-bold text-sky-700 hover:bg-sky-50 transition"
                >
                  فتح لوحة الرسم التفاعلية 🎨
                </button>
              )}
            </div>
          )}

          {type === 'audio' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">التسجيل الصوتي:</label>
              {showAudioRecorder ? (
                <AudioRecorder
                  onSave={(audioUrl) => {
                    setMediaUrl(audioUrl);
                    setFileName('تسجيل صوتي');
                    setShowAudioRecorder(false);
                  }}
                  onCancel={() => setShowAudioRecorder(false)}
                />
              ) : mediaUrl ? (
                <div className="p-3 bg-white/90 rounded-2xl border border-black/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600">✓ تم تسجيل وإرفاق الصوت</span>
                  <button
                    type="button"
                    onClick={() => setShowAudioRecorder(true)}
                    className="text-xs font-bold text-sky-600 hover:underline"
                  >
                    إعادة التسجيل ↺
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAudioRecorder(true)}
                  className="w-full py-4 border-2 border-dashed border-rose-400 bg-rose-50/50 rounded-2xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition"
                >
                  بدء تسجيل مقطع صوتي 🎙
                </button>
              )}
            </div>
          )}

          {(type === 'image' || type === 'file' || type === 'video') && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">رفع ملف أو وسائط:</label>
              <div className="flex gap-2">
                <label className="flex-1 py-3 px-4 border-2 border-dashed border-black/20 hover:border-sky-500 rounded-2xl bg-white/80 hover:bg-white flex items-center justify-center gap-2 cursor-pointer transition text-xs font-bold text-slate-700">
                  <Paperclip className="w-4 h-4 text-sky-600" />
                  <span>{fileName || 'اختر ملفاً من جهازك (صورة، PDF، فيديو...)'}</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              <div className="text-center text-[11px] text-slate-400">أو أدخل رابطاً مباشراً:</div>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://example.com/image.jpg أو رابط YouTube"
                className="w-full px-3.5 py-2 rounded-xl border border-black/15 bg-white/90 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          )}

          {/* Poll Creator */}
          {type === 'poll' && (
            <div className="space-y-2.5 p-3 rounded-2xl bg-white/90 border border-black/10">
              <label className="block text-xs font-bold text-slate-800">خيارات استطلاع الرأي:</label>
              <input
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="سؤال الاستطلاع..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              />
              <div className="space-y-1.5">
                {pollOptions.map((opt, idx) => (
                  <div key={idx} className="flex gap-1.5">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...pollOptions];
                        newOpts[idx] = e.target.value;
                        setPollOptions(newOpts);
                      }}
                      placeholder={`خيار ${idx + 1}`}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPollOptions([...pollOptions, `خيار ${pollOptions.length + 1}`])}
                className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>إضافة خيار إضافي</span>
              </button>
            </div>
          )}

          {/* Task Checklist Creator */}
          {type === 'task' && (
            <div className="space-y-2.5 p-3 rounded-2xl bg-white/90 border border-black/10">
              <label className="block text-xs font-bold text-slate-800">قائمة المهام والأنشطة:</label>
              <div className="space-y-1.5">
                {tasks.map((task, idx) => (
                  <div key={task.id} className="flex gap-1.5 items-center">
                    <span className="w-4 h-4 rounded border border-slate-300 flex-shrink-0" />
                    <input
                      type="text"
                      value={task.text}
                      onChange={(e) => {
                        const newTasks = [...tasks];
                        newTasks[idx].text = e.target.value;
                        setTasks(newTasks);
                      }}
                      placeholder={`مهمة ${idx + 1}`}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                    />
                    {tasks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setTasks(tasks.filter((_, i) => i !== idx))}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setTasks([...tasks, { id: 't_' + Date.now(), text: '', completed: false }])}
                className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>إضافة بند مهمة جديد</span>
              </button>
            </div>
          )}

          {/* Location Picker */}
          {type === 'location' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">اسم أو عنوان الموقع الجغرافي:</label>
              <div className="relative">
                <MapPin className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="مثال: الرياض - مركز الملك عبدالله المالي، أو مدرسة الأندلس"
                  className="w-full pr-10 pl-3 py-2 rounded-xl border border-black/15 bg-white/90 text-xs"
                />
              </div>
            </div>
          )}

          {/* Color Palette Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">لون بطاقة المنشور:</label>
            <div className="flex items-center gap-2">
              {colorPalettes.map((cp) => (
                <button
                  key={cp.code}
                  type="button"
                  onClick={() => setColor(cp.code)}
                  className={`w-7 h-7 rounded-full border shadow-xs transition ${
                    color === cp.code ? 'scale-125 ring-2 ring-sky-500' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: cp.code }}
                  title={cp.name}
                />
              ))}
            </div>
          </div>

          {/* Toggles: Pin, Important, Comments, Reactions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-bold text-slate-800">
            <label className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-black/10 cursor-pointer">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-400"
              />
              <span className="flex items-center gap-1">
                <Pin className="w-3.5 h-3.5 text-amber-500" />
                <span>تثبيت في الأعلى</span>
              </span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-black/10 cursor-pointer">
              <input
                type="checkbox"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                className="rounded text-rose-500 focus:ring-rose-400"
              />
              <span className="flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>منشور هام</span>
              </span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-black/10 cursor-pointer">
              <input
                type="checkbox"
                checked={allowComments}
                onChange={(e) => setAllowComments(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
              <span>السماح بالتعليق</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-black/10 cursor-pointer">
              <input
                type="checkbox"
                checked={allowReactions}
                onChange={(e) => setAllowReactions(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
              <span>السماح بالتفاعل</span>
            </label>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black/10 bg-black/5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-black/5"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 active:scale-95 transition cursor-pointer"
          >
            {editingPost ? 'حفظ التعديلات' : 'نشر على اللوحة ✨'}
          </button>
        </div>

      </div>
    </div>
  );
};

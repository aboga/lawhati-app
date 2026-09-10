import React, { useState } from 'react';
import { 
  X, Sparkles, Wand2, MessageSquare, BrainCircuit, BarChart3, 
  HelpCircle, ArrowLeft, Check, Copy, RefreshCw, Send, Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AiAssistantModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { activeBoard, activeBoardPosts, createPost, createBoard, setActiveBoardId } = useApp();
  
  const [activeTab, setActiveTab] = useState<'summarize' | 'suggest' | 'quiz' | 'generate'>('summarize');
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const [promptTopic, setPromptTopic] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSummarizeBoard = async () => {
    setLoading(true);
    setResultText('');
    try {
      const postsContent = activeBoardPosts.map(p => `${p.title}: ${p.content}`).join('\n');
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postsContent: postsContent || activeBoard?.title }),
      });
      const data = await res.json();
      setResultText(data.summary || 'تم التلخيص بنجاح');
    } catch (e) {
      setResultText('حدث خطأ أثناء التلخيص، يرجى إعادة المحاولة.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestIdeas = async () => {
    setLoading(true);
    setResultText('');
    try {
      const topic = promptTopic || activeBoard?.title || 'لوحة تعليمية تفاعلية';
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      setResultText(data.suggestions || 'تم توليد الأفكار');
    } catch (e) {
      setResultText('حدث خطأ أثناء اقتراح الأفكار.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuggestedAsPost = (text: string) => {
    createPost({
      title: 'فكرة مقترحة من لوحتي AI',
      content: text,
      type: 'text',
      color: '#f0f9ff',
      emoji: '💡',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-teal-500/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>لوحتي AI</span>
                <span className="text-[10px] bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300 font-mono px-1.5 py-0.5 rounded">Gemini</span>
              </h3>
              <p className="text-[11px] text-slate-500">المساعد الذكي لإثراء وتلخيص اللوحات الرقمية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 p-1.5 bg-slate-50 dark:bg-slate-800/50 gap-1 text-xs font-bold">
          <button
            onClick={() => { setActiveTab('summarize'); setResultText(''); }}
            className={`flex-1 py-2 rounded-xl transition ${
              activeTab === 'summarize'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            تلخيص اللوحة
          </button>
          <button
            onClick={() => { setActiveTab('suggest'); setResultText(''); }}
            className={`flex-1 py-2 rounded-xl transition ${
              activeTab === 'suggest'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            اقتراح أفكار وأنشطة
          </button>
          <button
            onClick={() => { setActiveTab('quiz'); setResultText(''); }}
            className={`flex-1 py-2 rounded-xl transition ${
              activeTab === 'quiz'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            إنشاء استطلاع ذكي
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'summarize' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/50 text-xs text-sky-800 dark:text-sky-300 leading-relaxed">
                يقوم المساعد الذكي بتحليل جميع المنشورات والتعليقات في اللوحة الحالية واستخراج أهم النتائج والملاحظات في نقاط مركزة.
              </div>

              <button
                onClick={handleSummarizeBoard}
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                <span>{loading ? 'جاري التحليل والتلخيص الذكي...' : 'تلخيص محتوى اللوحة الآن'}</span>
              </button>
            </div>
          )}

          {activeTab === 'suggest' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  ما هو موضوع أو مجال العصف الذهني؟
                </label>
                <input
                  type="text"
                  value={promptTopic}
                  onChange={(e) => setPromptTopic(e.target.value)}
                  placeholder={activeBoard?.title || 'اكتب الموضوع أو التخصص...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <button
                onClick={handleSuggestIdeas}
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{loading ? 'جاري ابتكار الأفكار...' : 'توليد أفكار وأنشطة إبداعية'}</span>
              </button>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                إنشاء بطاقة استطلاع رأي فوري وتصويت لتقييم فهم الطلاب أو المشاركين للموضوع ونشرها على اللوحة مباشرة:
              </p>
              <button
                onClick={() => {
                  createPost({
                    title: `استطلاع تقييم: ${activeBoard?.title || 'المحتوى'}`,
                    type: 'poll',
                    color: '#fefce8',
                    emoji: '📊',
                    pollData: {
                      question: 'ما مدى استيعابك للمفاهيم التي تم طرحها اليوم؟',
                      showResultsMode: 'immediate',
                      options: [
                        { id: 'opt_1', text: 'ممتاز وفهمت كل النقاط بوضوح', votes: 12, voters: [] },
                        { id: 'opt_2', text: 'جيد ولكن أحتاج مراجعة تطبيقية', votes: 7, voters: [] },
                        { id: 'opt_3', text: 'لدي بعض الأسئلة والاستفسارات', votes: 3, voters: [] },
                      ],
                    },
                  });
                  onClose();
                }}
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs shadow-md shadow-amber-500/20 active:scale-98 transition flex items-center justify-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>إنشاء ونشر استطلاع تفاعلي سريع ↗</span>
              </button>
            </div>
          )}

          {/* AI Result Box */}
          {resultText && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>نتيجة الذكاء الاصطناعي:</span>
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(resultText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                {resultText}
              </p>

              {activeBoard && (
                <button
                  onClick={() => handleAddSuggestedAsPost(resultText)}
                  className="px-3 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة هذه النتيجة كبطاقة على اللوحة</span>
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

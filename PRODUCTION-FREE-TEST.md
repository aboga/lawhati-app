# لوحتي — نسخة التجربة المجانية

هذه النسخة مهيأة للاختبار باستخدام Render Free + Supabase Free.

## 1) Supabase
1. أنشئ مشروعًا مجانيًا في Supabase.
2. افتح SQL Editor والصق محتوى `schema.sql` ثم Run.
3. من Project Settings > API انسخ:
   - Project URL
   - anon/public key
   - service_role key (سرّي جدًا، لا تضعه في VITE_ ولا داخل GitHub)
4. تأكد أن Storage bucket باسم `lawhati-files` موجود (ينشئه schema.sql تلقائيًا).

## 2) GitHub
ارفع كامل محتويات هذا المجلد إلى Repository جديد.

## 3) Render Free
أنشئ Web Service من GitHub، أو استخدم `render.yaml`.
Build: `npm install && npm run build`
Start: `npm start`
Health: `/api/health`

أضف متغيرات البيئة من `.env.example`.

## 4) الاختبار
افتح رابط Render ثم:
- أنشئ حسابًا بالبريد وكلمة المرور.
- سجل الدخول.
- أنشئ لوحة.
- أضف منشورًا.
- ارفع ملفًا أقل من 20MB.
- أعد تحميل الصفحة وتأكد أن البيانات ما زالت موجودة.

## ملاحظات النسخة المجانية
- Render Free قد يوقف الخدمة عند عدم الاستخدام، لذلك أول طلب بعد الخمول قد يكون بطيئًا.
- Supabase Free له حدود استخدام وتخزين؛ هذه النسخة مخصصة للاختبار وليست للإطلاق التجاري.
- رفع الملفات يمر عبر الخادم في النسخة التجريبية، والحد لكل ملف 20MB.
- لا تحفظ أي مفاتيح سرية في GitHub.

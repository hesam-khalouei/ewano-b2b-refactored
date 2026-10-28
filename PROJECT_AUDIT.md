# گزارش ممیزی پروژه

این گزارش بر اساس سورس متنی ارسالی تهیه شده است؛ پروژه اصلی به‌صورت ZIP/Git در اختیار نبود.

## خلاصه
- فایل‌های بازسازی‌شده: 75
- اسلایدهای HTML: 21
- مسیرهای محلی بررسی‌شده در HTML/CSS: 86
- مسیرهای محلی که فایل‌شان در خروجی ارسالی وجود نداشت: 37

## فایل‌های ارجاع‌شده اما موجودنبود‌ه
این فایل‌ها در سورس ارجاع شده‌اند، اما محتوای آن‌ها در فایل متنی ارسالی نبود؛ برای همین عمداً فایل جعلی جایگزین نشده است.

- `assets/images/cards/debit-back.png`
- `assets/images/cards/debit-front.png`
- `assets/images/cards/image-10.png`
- `assets/images/cards/image-11.png`
- `assets/images/cards/image-12.png`
- `assets/images/cards/image-13.png`
- `assets/images/cards/image-14.png`
- `assets/images/cards/image-15.png`
- `assets/images/cards/image-16.png`
- `assets/images/cards/image-17.png`
- `assets/images/cards/image-18.png`
- `assets/images/cards/image-19.png`
- `assets/images/cards/image-20.png`
- `assets/images/cards/image-21.png`
- `assets/images/cards/image-22.png`
- `assets/images/cards/image-23.png`
- `assets/images/cards/image-24.png`
- `assets/images/cards/image-25.png`
- `assets/images/cards/image-26.png`
- `assets/images/cards/image-27.png`
- `assets/images/cards/image-28.png`
- `assets/images/cards/image-29.png`
- `assets/images/cards/image-30.png`
- `assets/images/cards/image-31.png`
- `assets/images/cards/image-32.png`
- `assets/images/cards/image-33.png`
- `assets/images/cards/image-34.png`
- `assets/images/cards/image-35.png`
- `assets/images/cards/voucher-1.png`
- `assets/images/cards/voucher-2.png`
- `assets/images/cards/voucher-3.png`
- `assets/images/cards/voucher-4.png`
- `assets/images/cards/voucher-5.png`
- `assets/images/cards/voucher-6.png`
- `assets/images/cards/voucher-7.png`
- `assets/images/cards/voucher-8.png`
- `assets/images/logos/partners/behpardaz-jahan.webp`

- فایل‌های فونت محلی ارجاع‌شده: `assets/fonts/IRANYekanX-Light.woff` و `assets/fonts/IRANYekanX-Regular.woff` (در خروجی نبودند).

## مشکلات ساختاری قابل مشاهده
1. `index.html` در بخش SVG sprite یک placeholder دارد: تعریف آیکون‌ها در آن نیست و کامنت می‌گوید باید از backup کپی شود.
2. `data/slides.json` در خروجی اصلی خالی بود؛ یک manifest معتبر از ۲۱ اسلاید ساخته شد و `js/slides-loader.js` اصلاح شد تا ترتیب اسلایدها را از همین فایل بخواند و خطای manifest را در صفحه گزارش کند.
3. `js/animations.js` در فایل‌های پروژه هست اما در `index.html` بارگذاری نمی‌شود؛ اگر واقعاً منطق موردنیاز دارد باید ترتیب بارگذاری‌اش مشخص شود. نسخه استخراج‌شده فقط توضیح می‌دهد که فعلاً خالی است.
4. فونت‌های محلی IRANYekanX در فایل ارسالی نبودند؛ CSS به آن‌ها ارجاع دارد. fallback فونت مرورگر/فونت وب می‌تواند ظاهر را تغییر دهد.
5. پوشه کامل تصاویر کارت‌ها و یک لوگوی WebP در خروجی موجود نبود؛ این مورد می‌تواند به تصاویر شکسته در اسلایدها منجر شود.
6. اسلایدها و کامپوننت‌ها با `fetch()` لود می‌شوند؛ اجرای مستقیم با `file://` پشتیبانی نمی‌شود و باید از سرور محلی استفاده کرد.

## چک‌های لازم قبل از انتشار
- اجرای پروژه با Live Server یا `python -m http.server 5500`
- بررسی Console و Network در DevTools برای خطاهای JavaScript، 404 و خطاهای CORS
- تست همه ۲۱ اسلاید، drawer، دکمه‌های قبلی/بعدی، fullscreen، ماشین‌حساب و دمو
- بررسی ریسپانسیو در عرض‌های 1440، 1024، 768، 390 و 360 پیکسل
- بازیابی `assets/fonts/` و `assets/images/cards/` از پروژه اصلی

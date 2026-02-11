# 🚀 Buildex - आसान Setup (सिर्फ एक बार)

## ✅ अब login की tension नहीं! 

मैंने तीन चीज़ें बनाई हैं:

### 1️⃣ **Auto-Login** ✨
- अब website खुलते ही automatically login हो जाएगा!
- Email/Password डालने की जरूरत नहीं
- एक बार setup हो गया, हमेशा के लिए काम करेगा

### 2️⃣ **Windows Startup में Backend** 🔄
- Computer on करते ही backend automatically चालू हो जाएगा
- कोई manual command नहीं चलानी पड़ेगी

### 3️⃣ **Simple Frontend Startup** 
- सिर्फ frontend शुरू करो, बाकी automatic

---

## 📋 पहली बार Setup (सिर्फ एक बार करना है)

### Step 1: Backend को Startup में Add करो

**Right-click करो इस file पर:**
```
ADD_TO_STARTUP.bat
```
**"Run as Administrator" select करो**

✅ Done! अब computer restart करने पर backend automatic चालू होगा।

---

### Step 2: Test करो

1. **Start Buildex.bat** को double-click करो
2. या सीधा project folder में जाके: `npm run dev`
3. Browser में `http://localhost:8080` खोलो

**Auto-login होगा!** आपको email/password नहीं डालना पड़ेगा! ✨

---

## 🎯 अब Daily क्या करना है?

### सिर्फ ये:

1. Computer on करो (backend automatic शुरू हो जाएगा - background में)
2. Frontend शुरू करो:
   - `START_BUILDEX.bat` double-click करो
   - या project में जाके `npm run dev` run करो
3. Browser में `http://localhost:8080` खोलो
4. **Automatic login हो जाएगा!** 🎉

---

## 🔧 अगर Auto-Login नहीं चाहिए

File खोलो: `src/config/autoLogin.ts`

Line 2 पर change करो:
```typescript
enabled: false,  // true से false कर दो
```

---

## 📌 Important Files:

1. **START_BUILDEX.bat** - सब कुछ एक साथ start करने के लिए
2. **ADD_TO_STARTUP.bat** - Backend को startup में add करने के लिए (सिर्फ एक बार)
3. **src/config/autoLogin.ts** - Auto-login settings

---

## 🎮 Admin Credentials (अगर manually login करना हो)

```
Email: admin@buildex.com
Password: admin123
```

---

## ✅ Benefits:

✔️ **No daily login** - Automatic login
✔️ **Backend always running** - Startup में add है
✔️ **One-click frontend start** - Bas ek file run karo
✔️ **Session saved forever** - Baar baar login की zaroorat nahi

---

## 🚨 Agar Error Aaye:

### "Access Denied" dikhe to:

1. **Check करो backend running hai ya nahi:**
   - Task Manager खोलो (Ctrl+Shift+Esc)
   - "node.exe" process dhundho
   - Agar nahi hai, to `START_BUILDEX.bat` run karo

2. **Browser refresh karo** (F5)

3. **Cache clear karo:**
   - Ctrl+Shift+Delete
   - "Cookies and cached data" select karke delete karo

---

## 🎯 Summary:

**पहली बार (Setup):**
1. `ADD_TO_STARTUP.bat` को Run as Administrator (सिर्फ एक बार)

**हर दिन:**
1. Computer on करो (backend auto start)
2. `START_BUILDEX.bat` double-click करो
3. **Automatic login!** 🚀

---

**अब कोई परेशानी नहीं होगी!** ✨

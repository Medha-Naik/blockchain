# 🚀 Quick Start - File Transfer Testing

## ✅ Servers Running:

- **Backend:** http://localhost:5000 ✅
- **Frontend:** http://localhost:8080 ✅

---

## 🧪 Test in 60 Seconds:

### 1. Open Browser
```
http://localhost:8080/
```

### 2. Check Connection
Look for **GREEN "Connected"** badge in bottom-right corner

### 3. Open Second Tab/Window
```
Ctrl+T (new tab) or Ctrl+N (new window)
http://localhost:8080/
```

### 4. Tab 1 - Send Files
```
1. Click "Send Files" button
2. Note the 4-digit code (e.g., 1234)
3. Select a file
4. Wait for "Waiting for receiver..."
```

### 5. Tab 2 - Receive Files
```
1. Click "Receive Files" button
2. Enter the 4-digit code
3. Click "Join Room"
4. File downloads automatically ✅
```

---

## 🎯 What to Look For:

### ✅ Success Indicators:
- Green "Connected" badge
- Room code appears (4 digits)
- Status changes to "Connected"
- Progress bar moves
- File downloads

### ❌ Problem Indicators:
- Yellow/Orange badge (backend issue)
- "Room does not exist" error
- Stuck on "Waiting for receiver..."
- No progress after 10 seconds

---

## 🐛 Quick Fixes:

### If Connection Badge is Not Green:
```bash
# Restart backend
cd backend
npm start
```

### If "Room does not exist":
- Create room FIRST (sender)
- Then join room (receiver)
- Check room code is correct

### If Files Not Downloading:
- Allow pop-ups for localhost
- Check browser download settings
- Try smaller file (< 10MB)

---

## 📊 Check Backend Logs:

Should see:
```
Server running on port 5000
User connected: [id]
Room created: 1234
[id] Successfully joined room: 1234
```

---

## 🔍 Debug Mode:

Press **F12** in browser to see console logs:
```
✅ Connected to backend: [socket-id]
✅ Peer connected
✅ File transfer started
```

---

## 📞 Need Help?

See detailed guides:
- **TROUBLESHOOTING.md** - Common issues & solutions
- **FIXES_APPLIED.md** - What was changed
- **TEST_CONNECTION.md** - Detailed testing guide

---

## 🎉 That's It!

Your file transfer should work now. If you see the green "Connected" badge and follow the steps above, files will transfer successfully.

**Happy Testing! 🚀**

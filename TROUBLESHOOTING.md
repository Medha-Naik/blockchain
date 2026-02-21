# 🔧 Troubleshooting Guide - File Transfer Issues

## ✅ What I Fixed:

1. **Backend Connection** - Changed from remote server to local
2. **Added Logging** - Backend now logs all room operations
3. **Connection Status** - Added visual indicator in bottom-right corner
4. **Error Handling** - Added socket error message handling

---

## 🧪 How to Test File Transfer:

### Step-by-Step Testing:

1. **Open Browser** - Go to http://localhost:8080/
2. **Check Connection Status** - Look for green "Connected" badge in bottom-right
3. **Open DevTools** - Press F12 to see console logs

### Test Scenario 1: Same Browser, Two Tabs

**Tab 1 (Sender):**
```
1. Click "Send Files"
2. Note the 4-digit room code (e.g., 1234)
3. Select a small file (< 10MB for testing)
4. Wait for "Waiting for receiver..." status
```

**Tab 2 (Receiver):**
```
1. Click "Receive Files"
2. Enter the room code from Tab 1
3. Click "Join Room"
4. File should start downloading automatically
```

### Test Scenario 2: Different Browsers

**Browser 1 (Chrome - Sender):**
- Follow sender steps above

**Browser 2 (Firefox/Edge - Receiver):**
- Follow receiver steps above

---

## 🐛 Common Issues & Solutions:

### Issue 1: "Room does not exist"

**Symptoms:**
- Receiver gets error when entering room code
- Console shows: "Room [code] does not exist"

**Solutions:**
1. Make sure sender created room FIRST
2. Check room code is correct (4 digits)
3. Check backend logs for "Room created: [code]"
4. Try creating a new room

**Backend Check:**
```bash
# Check backend terminal for:
Room created: 1234
[socket-id] Attempting to join room: 1234
```

### Issue 2: "Room full"

**Symptoms:**
- Third person cannot join room
- Console shows: "Room [code] is full"

**Solutions:**
1. Only 2 users allowed per room
2. Create a new room for additional transfers
3. Wait for current transfer to complete

### Issue 3: Connection Status Shows "Connecting..."

**Symptoms:**
- Badge stays yellow/orange
- Never shows "Connected"
- Console shows connection errors

**Solutions:**

**A. Check Backend is Running:**
```bash
# Should see:
Server running on port 5000
```

**B. Check Port 5000 is Available:**
```bash
# Windows:
netstat -ano | findstr :5000

# If port is in use, kill the process or change port
```

**C. Restart Backend:**
```bash
cd backend
npm start
```

**D. Check Firewall:**
- Allow Node.js through Windows Firewall
- Temporarily disable antivirus to test

### Issue 4: WebRTC Connection Failed

**Symptoms:**
- Status shows "Connected" but files don't transfer
- Console shows: "ICE connection failed"
- Status stuck on "Waiting for receiver..."

**Solutions:**

**A. Check STUN Servers:**
```javascript
// In browser console:
fetch('https://stun.l.google.com:19302')
  .then(() => console.log('STUN accessible'))
  .catch(() => console.log('STUN blocked'));
```

**B. Try Different Network:**
- Disable VPN
- Try mobile hotspot
- Check corporate firewall

**C. Browser Permissions:**
- Allow WebRTC in browser settings
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito mode

### Issue 5: Files Not Downloading

**Symptoms:**
- Transfer completes but no download
- Console shows: "File received" but nothing happens

**Solutions:**

**A. Check Browser Download Settings:**
```
Chrome: Settings > Downloads
- Check download location
- Disable "Ask where to save each file"
```

**B. Allow Pop-ups:**
```
Click lock icon in address bar
Allow pop-ups for localhost
```

**C. Check File Size:**
```
Current limit: 500MB total
Try smaller files first (< 10MB)
```

### Issue 6: Transfer Stuck at 0%

**Symptoms:**
- Progress bar doesn't move
- Status shows "Transferring..." but no progress

**Solutions:**

**A. Check Data Channel:**
```javascript
// In browser console (sender):
console.log('Channel state:', channelRef.current?.readyState);
// Should be: "open"
```

**B. Check Buffer:**
```javascript
// In browser console (sender):
console.log('Buffered:', channelRef.current?.bufferedAmount);
// Should be increasing
```

**C. Restart Transfer:**
- Refresh both pages
- Create new room
- Try smaller file

---

## 📊 Debugging Checklist:

### Backend Logs (Terminal):
```
✅ Server running on port 5000
✅ User connected: [socket-id]
✅ Room created: [room-code]
✅ [socket-id] Attempting to join room: [room-code]
✅ [socket-id] Successfully joined room: [room-code]
✅ [socket-id] Notified other users in room: [room-code]
✅ [socket-id] Sending offer to room: [room-code]
✅ [socket-id] Sending answer to room: [room-code]
✅ [socket-id] Sending ICE candidate to room: [room-code]
```

### Frontend Console (Browser DevTools):
```
✅ Connected to backend: [socket-id]
✅ Room created: [room-code]
✅ Joined room: [room-code]
✅ Peer connected
✅ Data channel open
✅ Sending file: [filename]
✅ File sent: [filename]
```

### Connection Status Badge:
```
✅ Green "Connected" = Good
⚠️ Yellow "Connecting..." = Check backend
❌ Red "Disconnected" = Backend down
```

---

## 🔍 Advanced Debugging:

### Enable Verbose Logging:

**Backend (server.js):**
```javascript
// Add at top of file
process.env.DEBUG = 'socket.io:*';
```

**Frontend (socket.js):**
```javascript
export const socket = io(BACKEND_URL, {
  transports: ["websocket", "polling"],
  debug: true  // Add this
});
```

### Monitor WebRTC Stats:

**In Browser Console:**
```javascript
// Get WebRTC stats
const pc = pcRef.current;
if (pc) {
  pc.getStats().then(stats => {
    stats.forEach(report => {
      console.log(report.type, report);
    });
  });
}
```

### Check Network Tab:

1. Open DevTools (F12)
2. Go to Network tab
3. Filter: WS (WebSocket)
4. Should see connection to localhost:5000
5. Check for errors or disconnections

---

## 🚀 Quick Fixes:

### Nuclear Option (Reset Everything):

```bash
# 1. Stop all processes
# Press Ctrl+C in both terminals

# 2. Clear node_modules
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../roomlink-share-direct
rm -rf node_modules package-lock.json
npm install

# 3. Clear browser data
# Chrome: Ctrl+Shift+Delete
# Clear: Cached images and files, Cookies

# 4. Restart everything
cd backend
npm start

# New terminal
cd roomlink-share-direct
npm run dev

# 5. Test in incognito mode
```

### Port Conflict:

```bash
# If port 5000 is in use, change it:

# backend/src/server.js
const PORT = process.env.PORT || 5001;  // Change to 5001

# roomlink-share-direct/.env
VITE_BACKEND_URL=http://localhost:5001  # Update here too
```

---

## 📞 Still Not Working?

### Collect Debug Info:

1. **Backend Terminal Output:**
   - Copy last 50 lines
   - Look for errors

2. **Browser Console:**
   - Copy all errors (red text)
   - Copy all warnings (yellow text)

3. **Network Tab:**
   - Check WebSocket connection
   - Look for failed requests

4. **System Info:**
   - OS version
   - Browser version
   - Node.js version (`node --version`)
   - Network type (WiFi/Ethernet/VPN)

### Test Basic Connectivity:

```bash
# Test backend is responding
curl http://localhost:5000/

# Should return: "RoomLink Backend Running 🚀"
```

```bash
# Test room creation
curl -X POST http://localhost:5000/api/create-room

# Should return: {"roomId":"1234"}
```

---

## ✅ Success Indicators:

### You know it's working when:

1. ✅ Connection badge shows "Connected" (green)
2. ✅ Backend logs show room creation
3. ✅ Backend logs show both users joining
4. ✅ Sender status changes to "Connected"
5. ✅ Receiver sees file list
6. ✅ Progress bars move
7. ✅ Files download automatically

---

## 🎯 Expected Behavior:

### Timeline of Events:

```
T+0s:  Sender clicks "Send Files"
T+1s:  Room created (backend logs)
T+2s:  Sender selects files
T+3s:  Sender status: "Waiting for receiver..."
T+5s:  Receiver enters room code
T+6s:  Receiver joins room (backend logs)
T+7s:  WebRTC handshake (offer/answer/ICE)
T+10s: Both show "Connected"
T+11s: Sender clicks "Send Files"
T+12s: Status: "Transferring..."
T+??s: Progress bars update
T+??s: Files download on receiver
T+??s: Status: "Transfer complete!"
```

### Typical Transfer Speeds:

- Small files (< 1MB): Instant
- Medium files (1-10MB): 1-5 seconds
- Large files (10-100MB): 10-60 seconds
- Max files (100-500MB): 1-5 minutes

*Speed depends on network and device performance*

---

## 🔗 Useful Links:

- WebRTC Troubleshooting: https://webrtc.github.io/samples/
- Socket.io Debug: https://socket.io/docs/v4/troubleshooting-connection-issues/
- Browser WebRTC Test: https://test.webrtc.org/

---

**Remember:** Most issues are solved by:
1. Restarting backend
2. Clearing browser cache
3. Using incognito mode
4. Trying different browser

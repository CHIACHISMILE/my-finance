# MyFinance 2.0 Beta 測試記錄

## 執行完成
- Node.js 語法檢查：index.html 內嵌 JavaScript、offline.js、sw.js。
- 使用 Node VM、模擬 DOM、模擬儲存及模擬 Firestore transaction 執行 test-logic.cjs。共 15 項通過：
- PASS: compact record form
- PASS: overflow controls
- PASS: calculator
- PASS: local save
- PASS: offline create and balance
- PASS: restore from persisted mock store
- PASS: separate workspace
- PASS: offline edit
- PASS: offline delete
- PASS: mock sync create/update/delete sequence
- PASS: idempotent retry
- PASS: revision conflict
- PASS: conflict remains pending without overwrite
- PASS: identity pointer cleared
- PASS: unexpected auth change retains only pending operations
- 比對 V1.5 Firestore 安全規則：完全相同。

## 尚未驗證
目前瀏覽器環境封鎖本機及測試網頁導覽，因此無法在真實瀏覽器測試排版、Service Worker 快取及實際 IndexedDB 持久化。測試中的儲存與 Firebase 均為替身，不代表正式雲端安全規則、並行寫入或 iOS 真機已通過。

建議部署後使用測試帳本：
1. 連線開啟每個帳本並等待同步。
2. 開飛航模式，關閉 App 後重開：檢查帳本、資產、明細、圖表。
3. 新增測試交易 1 元，重開確認保留，修改再刪除。
4. 恢復連線、開啟 App，確認待同步筆數歸零，且另一台手機沒有重複交易。
5. 兩台手機修改同一交易，確認較舊版本不會覆蓋較新版本，衝突提示及匯出功能正常。
6. 用 Viewer、Recorder 與未受邀帳號確認不能讀寫無權限資料。
7. 登出及換帳號確認不顯示前一位使用者的快取。撤銷成員後，讓對方重新連線確認帳本被隱藏。
8. 在 iPhone 確認分類區可滑動、鍵盤可按、頂部無遮擋。驗證捷徑仍可新增交易。

未完成上述實機驗收前，請不要將此版本視為正式穩定版。

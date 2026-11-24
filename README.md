# MyFinance V1.3 更新說明

- 記帳頁：上方分類區、中間金額與備註、近期交易橫向選擇、底部四列計算機與儲存鍵。分類過多時僅分類區可捲動。
- 計算機支援 +、−、×、÷、小數輸入及 00；儲存結果仍需為整數台幣。
- iOS 主畫面 Web App：不透明頂部背景相容性處理，移除導覽列背景模糊。系統原生模糊仍需實機確認。
- 從 V1.2 更新只需替換 index.html 與 sw.js；Firebase 規則、原生捷徑設定及資料格式不變。請勿清除網站資料。

## V1.2 功能及原生捷徑說明

- 記帳改為滿版、緊湊的單頁介面：隱藏全域標題與導覽列；所有分類可由下拉選單選擇；支援近期交易、帳戶、日期、備註與鍵盤。正常 iPhone 尺寸無需捲動，極小視窗／放大字級／系統鍵盤開啟時保留安全捲動。
- 新增原生捷徑直接寫入 Firestore 的 recorder（僅新增收入／支出）角色與設定匯出。原生捷徑需在手機建立，詳見 SHORTCUTS-SETUP.md；不提供未簽署的可安裝捷徑。
- 更新原 repository 根目錄 index.html 與 sw.js；Firebase Rules 更新為本版 firestore.rules。原有帳本資料與網址不變。

---

# MyFinance v1.0

手機優先的繁體中文個人財務 PWA。所有金額以整數新台幣記錄。初次開啟為空白本機模式，可從設定載入假設範例資料。

## iPhone 部署（不需要安裝 App）
1. Safari 開啟 github.com/new，建立公開 `my-finance` repository，勾選 Add README。
2. 將 ZIP 儲存至檔案 App、解壓縮。到 repository 的 Code → Add file → Upload files，選取解壓後的 5 個程式檔案（index.html、manifest.json、sw.js、icon.png、firestore.rules），放在 repository 根目錄，Commit changes。README 可不傳。
3. Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save。網站會顯示在 Pages 頁面。使用 Safari 開啟 `https://你的GitHub帳號.github.io/my-finance/`。
4. 先在本機試用：點右上角本機模式，載入範例資料。範例資料絕不會自動傳到雲端。
5. 分享 → 加入主畫面 → 以網頁 App 開啟。主畫面 App 和 Safari 的本機資料可能分開，因此請在正式使用的入口設定。

## Firebase 多人模式
1. https://console.firebase.google.com/ 建立專案 MyFinance（Spark 免費方案；Analytics 可關閉）。Project Overview → Web app（</>）→ Register app，複製 firebaseConfig（不要提供服務帳戶私鑰）。
2. Authentication → Get started → Sign-in method → Google → Enable，設定支援電子郵件。Authentication → Settings → Authorized domains → Add domain，加入 `你的GitHub帳號.github.io`（只填網域，不加 https 或路徑）。
3. Firestore Database → Create database → 選擇位置、Production mode。Rules → 將本專案 firestore.rules 完整貼上，Publish。不要使用公開讀寫或 Test mode。若 Rules 編譯失敗，請先不要輸入私人資料。
4. App → 右上角設定 → Firebase 連線設定，貼上 firebaseConfig → 儲存。Google 登入 → 建立自己的新帳本。不同帳本使用獨立 ID。每個裝置需貼上同一個 Firebase Web 設定；該設定不是管理員密碼。
5. 邀請其他人：對方用相同網站及 Firebase 設定登入 Google，複製自己的 UID 給你。你在帳本設定填入對方 UID，選 editor 或 viewer，按授權成員，再把帳本 ID 傳給對方。對方在「開啟其他帳本」貼上帳本 ID。未授權者即使有 ID 也不能讀取帳本。移除成員後不能繼續從伺服器讀取，但無法撤回以前下載的資料。
6. 先使用假資料驗證：擁有者、編輯者、瀏覽者、未授權者四種權限；兩台手機各新增一筆、重新整理、編輯同一筆、撤銷權限。Google 登入採 popup；若 iOS 主畫面版本不相容，先使用 Safari，勿假設登入狀態自動共用。

## 資料處理
- 本機：localStorage，可能因清除網站資料而遺失。雲端：Firestore，即時監聽；雲端模式的交易寫入需網路。雲端與本機資料分開，無自動搬移。
- 信用卡、貸款起始欠款以正數輸入，系統自動記負值；繳信用卡及投資投入使用轉帳。投資市值用調整交易，費用另記支出。退款會沖減退款當月的支出。資產歷史依開戶日、交易與手動估值重建，不等同即時市價。
- 設定可匯出 JSON、CSV，再選儲存到檔案 iCloud Drive。JSON 還原目前只支援本機資料；雲端 JSON 不會直接覆蓋雲端帳本。
- CSV 可用 Numbers 或其他試算表開啟。
- 此版本的安全規則、雲端登入和雙手機協作仍需在你的 Firebase 專案實測。已提供基本的角色存取規則與交易 revision 衝突檢查；尚無不可竄改稽核紀錄。沒有自動銀行/券商同步、外幣匯率、預算、常用頻率排序與最愛釘選。近期交易會帶入分類、備註、金額與帳戶。

## iPhone 捷徑快速記帳（V1.1）
- 使用「URL」及「打開 URL」兩個動作，網址為 GitHub Pages 首頁加 `#add`，直接開啟交易表單。
- 可帶入 `#add?type=expense&amount=30&category=午餐&note=自助餐&account=現金`。支援 type: expense/income/transfer/refund。金額只接受正整數 TWD；文字參數請逐一 URL 編碼。帳戶以完整名稱或 ID 比對，找不到時需手選；轉帳須手選轉入帳戶。
- 不會自動寫入；確認分類、日期、帳本、帳戶、金額並按儲存。網址片段不會隨 HTTP 請求傳送，但可能留於捷徑或瀏覽器紀錄，勿放敏感備註。
- 捷徑可能開啟 Safari 而非主畫面網頁 App；兩者登入及本機資料可能獨立。請先在捷徑開啟的瀏覽環境設定相同 Firebase 並登入，選擇正確帳本。
- 尚未在 iPhone 上測試。

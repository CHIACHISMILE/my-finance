# MyFinance V1.5｜iPhone 原生捷徑（不開啟 Safari）

本版本在原本的 Firestore 架構上新增 recorder 角色，只允許新增收入／支出，不允許讀取、修改或刪除任何帳本資料。原有 Google 登入、帳本和交易維持不變。這份文件是原生捷徑的手動建立說明，不是已簽署的可安裝 .shortcut 檔；需在 iPhone 實際設定及測試。

## A. 升級現有網站

1. 在原 GitHub repository 的根目錄取代 `index.html`、`sw.js`。不要新建 repository，避免改變網站網址與本機設定。其他檔案可保留。
2. 若已使用 V1.2 / V1.3 的 recorder 安全規則，不需更新。若仍使用 V1.0 / V1.1 規則，需先備份原規則，再於 Firebase Console → Firestore Database → Rules 貼上本版本 `firestore.rules` 並 Publish。自訂規則應合併而非覆蓋。
3. 等 GitHub Pages 部署完成，重新開啟主畫面的 MyFinance，必要時關閉後重開。設定頁面應顯示 v1.5。
4. 不要刪除現有 Firebase 專案／帳本，也不要清除網站資料。此版本沒有資料庫遷移。

## B. 建立專用、可撤銷的捷徑帳號

1. Firebase Console → Authentication → Sign-in method → Email/Password → Enable → Save。Google 登入維持啟用，不需修改。
2. Authentication → Users → Add user。建立一組只用於本捷徑的專用 email（最好使用自己控制的另一個電子郵件地址）及獨立高強度密碼。不要用平常 Google 密碼，不要建立 owner 帳號或使用服務帳戶金鑰。
3. 複製這個新使用者的 UID。回到原本已登入 owner 的 MyFinance → 設定與帳本 → 邀請成員，輸入新 UID，選「捷徑專用（僅新增）」→ 授權成員。
4. 請勿用 owner 或 editor 的 UID 或密碼來設定捷徑。每位共同記帳者可配置自己的 recorder UID，以區分建立者。要撤銷捷徑，owner 可移除該成員；也可在 Firebase Authentication 停用或刪除專用帳號。
5. MyFinance → 設定與帳本 → iPhone 原生捷徑 → 匯出捷徑設定 JSON，存入私人的 iCloud Drive。它包含 apiKey、projectId、workspaceId、帳戶 ID、分類和近期項目（沒有密碼）。不要把這個含財務資訊的設定檔上傳公開 GitHub、分享給未授權者或放到公共資料夾。

## C. 在 iPhone「捷徑」建立流程

先用固定帳戶的支出捷徑測試，再擴充收入、常用項目及多帳戶。以下動作名稱可能隨系統語言略異。方括號表示應插入捷徑的魔術變數，不是直接輸入方括號文字。

### C1. 取得輸入

- 「文字」動作：填入 B 步驟的專用 email，命名變數 Email。
- 「要求輸入」(Ask for Input)：輸入類型文字，提示「捷徑專用密碼」，命名 Password。可在確認可用後選擇將獨立密碼儲存於自己的私人捷徑中，省略每次輸入；但捷徑本身不是密碼保險庫，可能同步至 iCloud，任何可編輯／取得捷徑的人可能讀取。不要分享含密碼的捷徑，不要使用 Google 帳號密碼。
- 「列表」：早餐、午餐、晚餐、飲料、交通、購物、居住、娛樂、醫療、旅遊、其他（或參照匯出的 categories.expense）。「從列表中選擇」→ 變數 Category。關閉多選。
- 「要求輸入」：數字，提示「金額（整數 TWD）」→ Amount。用 If 確認 >0 且 <=100000000000；必須是整數，可用「四捨五入」至個位並比對原值，若不同則停止，不可默默改金額。
- 「要求輸入」：文字，提示「項目名稱／備註」→ Note（最多120字）。
- 固定帳戶先用匯出檔的 accounts 中某個 id，不是帳戶名稱。命名 AccountID。若有多個帳戶，可用「字典」建立名稱→ID 對照，再從字典所有鍵選擇並取得相應值。設定的帳戶須已存在且開戶日期不晚於交易日。
- 「目前日期」→ Now；「格式化日期」自訂 `yyyy-MM-dd`，使用本地時區、Gregorian 日曆 → Date。
- 「取得日期之間的時間」：1970-01-01 00:00:00 UTC 至 Now，單位秒；乘 1000 並四捨五入到整數 → Timestamp（Unix 毫秒）。
- 「隨機數字」：100000000 到 999999999 → Random。用文字 `[Timestamp]-[Random]` → RecordID。同一次請求重試要重用同一 RecordID，不能重新生成；不要不確認是否已入帳就重跑整個捷徑。
- 「顯示提示」確認分類、金額、項目、帳戶；取消即停止。

### C2. 驗證 Firebase 使用者

「取得 URL 的內容」(Get Contents of URL)，不是「打開 URL」。

URL：`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[apiKey]`

方法 POST，Request Body 選 JSON，建立三個欄位：

| 鍵 | 類型 | 值 |
|---|---|---|
| email | 文字 | Email 變數 |
| password | 文字 | Password 變數 |
| returnSecureToken | 布林 | true |

用「取得字典值」從回傳取得 `idToken` → Token；`localId` → ActorUID。若缺少 Token 或 ActorUID，顯示「登入失敗」並停止。不要把回傳的 token 顯示在通知、寫入共享檔案或上傳 GitHub。

### C3. 直接新增 Firestore 交易

再加入一個「取得 URL 的內容」。URL（替換三個變數，`(default)` 保留）：

`https://firestore.googleapis.com/v1/projects/[projectId]/databases/(default)/documents/workspaces/[workspaceId]/transactions?documentId=[RecordID]`

方法 POST。Headers 新增 `Authorization`，值為 `Bearer [Token]`（Bearer 後有一個空格）。Request Body 選 JSON。新增字典 `fields`，再在 fields 裡新增以下子字典。每個子字典只包含一個鍵值；integerValue 用文字型態傳輸十進位整數，不帶千分位或小數，stringValue 用文字。使用原生 JSON 字典而不是把備註直接拼進 JSON，讓引號、換行等字元正確轉義。

| fields 內的鍵（字典） | 子鍵 | 值 |
|---|---|---|
| id | stringValue | RecordID |
| type | stringValue | expense（收入改為 income） |
| category | stringValue | Category |
| note | stringValue | Note |
| amount | integerValue | Amount |
| account | stringValue | AccountID |
| to | stringValue | 空文字（非轉帳必須保留空字串） |
| date | stringValue | Date |
| createdBy | stringValue | ActorUID |
| updatedBy | stringValue | ActorUID |
| createdAt | integerValue | Timestamp |
| updatedAt | integerValue | Timestamp |
| rev | integerValue | 1 |

請參考同資料夾的 `shortcut-body-example.json` 查看結構。範例中的代號不是實際設定值。

從回傳字典取得 `name`（文件完整路徑）；只有成功回傳且結尾是本次 RecordID 才用「顯示通知」顯示「已記帳 NT$[Amount]」。否則顯示失敗，不要顯示成功。網路中斷時可能已送達，先到 MyFinance 查明，再決定是否重試；重用同一 RecordID 可避免同一請求新增兩次。請求失敗不會自動離線排隊。

### C4. 使用更快的固定常用交易

在要求輸入前加入「從選單中選擇」：早餐-711、午餐-自助餐、自訂等，每個常用分支設定 Category、Note、Amount、AccountID，自訂分支才逐項要求輸入。這些範本可依匯出的 recent 資料自行設定；目前不會自動從 Firestore 讀取最新歷史（專用 recorder 無讀取權限）。如果希望更動金額，可在每個分支以預填上次金額的「要求輸入」動作確認。

完成後可將捷徑放到動作按鈕、控制中心、主畫面小工具或以 Siri 啟動。整個執行流程都沒有「打開 URL」動作，因此不開 Safari 或網頁 App。需要連網。

## D. 驗收

- 專用帳號新增一筆 $1 假資料，MyFinance 的雲端帳本及其他已授權手機看得到。
- 在 MyFinance 刪除這筆測試交易（只有 owner/editor 能刪）。
- 專用帳號嘗試讀取／修改／刪除帳本資料應被 Firestore Rules 拒絕。
- 未受邀的登入者嘗試新增資料應被拒絕。
- 移除該 recorder 成員後，即使捷徑仍能登入 Firebase，也不得新增交易。

參考官方文件：
- Apple: https://support.apple.com/guide/shortcuts/request-your-first-api-apd58d46713f/ios
- Firebase Auth REST: https://firebase.google.com/docs/reference/rest/auth/
- Firestore REST: https://firebase.google.com/docs/firestore/use-rest-api
- Firestore createDocument: https://firebase.google.com/docs/firestore/reference/rest/v1/projects.databases.documents/createDocument

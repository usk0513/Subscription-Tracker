# Subscription Manager - Design Guidelines

## Brand Identity

**Purpose**: A personal finance utility that helps users track and manage their recurring subscription costs, preventing "subscription creep" and promoting financial awareness.

**Aesthetic Direction**: **Editorial/magazine** with a dash of **luxurious/refined**. Think financial newspaper meets premium banking app - clean typographic hierarchy, generous whitespace, and sophisticated data presentation. The app should feel trustworthy, organized, and calming (not anxiety-inducing about spending).

**Memorable Element**: Bold, oversized monthly total displayed prominently on the home screen as the hero element - impossible to miss, encouraging financial mindfulness.

## Navigation Architecture

**Root Navigation**: Tab Bar (3 tabs)
- Home (Subscriptions list)
- Add (centered, core action)
- Settings (profile & preferences)

**Screen List**:
1. Home - Subscriptions list with monthly total
2. Add Subscription - Form modal
3. Subscription Detail - Full info with edit/delete
4. Settings - User preferences and profile
5. Category Filter - Filter subscriptions by category

## Screen-by-Screen Specifications

### 1. Home Screen
**Purpose**: Overview of all active subscriptions and total monthly spending

**Layout**:
- Header: Custom transparent header with app title "Subscriptions" (left-aligned, large title style) and filter icon (right)
- Main Content: Scrollable list
- Top inset: headerHeight + Spacing.xl
- Bottom inset: tabBarHeight + Spacing.xl

**Components**:
- Hero card at top: Large monthly total (¥XX,XXX/月) with subtle gradient background
- Subscription cards in list below, grouped by category
- Each card shows: App name, category badge, price, billing cycle icon (月/年), next billing date
- Empty state: Illustration with "サブスクリプションを追加" CTA

### 2. Add Subscription Screen
**Purpose**: Create new subscription entry

**Layout**:
- Native modal presentation (full screen)
- Header: Navigation header with "キャンセル" (left) and "保存" (right, bold/primary color)
- Main Content: Scrollable form
- Top inset: Spacing.xl
- Bottom inset: insets.bottom + Spacing.xl

**Form Fields**:
- アプリ/サービス名 (text input)
- 料金 (numeric input with ¥ prefix)
- 支払いサイクル (segmented control: 月払い / 年払い)
- 開始日 (date picker)
- カテゴリー (dropdown: エンタメ, 仕事, 健康, 教育, その他)
- 管理ページURL (text input, optional)

### 3. Subscription Detail Screen
**Purpose**: View and manage individual subscription

**Layout**:
- Header: Standard navigation header with back button, edit button (right)
- Main Content: Scrollable content
- Top inset: Spacing.xl
- Bottom inset: insets.bottom + Spacing.xl

**Components**:
- Large app name and category badge at top
- Info rows: 料金, 支払いサイクル, 開始日, 利用期間, 次回更新日
- "管理ページを開く" button (if URL provided) - opens in browser
- "削除" button at bottom (destructive style, confirmation alert)

### 4. Settings Screen
**Purpose**: User profile and app preferences

**Layout**:
- Header: Custom transparent header with title "設定"
- Main Content: Scrollable list
- Top inset: headerHeight + Spacing.xl
- Bottom inset: tabBarHeight + Spacing.xl

**Components**:
- Profile section: Avatar (generated preset) and display name
- Preferences: 通知設定, テーマ (システム/ライト/ダーク), 通貨表示
- App info: バージョン, プライバシーポリシー, 利用規約

### 5. Category Filter (Modal)
**Purpose**: Filter subscriptions by category

**Layout**:
- Native modal (sheet style, iOS)
- Header: Title "カテゴリー" with close button
- Main Content: List of category chips

**Components**:
- "すべて" option (shows all)
- Category list: エンタメ, 仕事, 健康, 教育, その他
- Each category shows count badge

## Color Palette

**Primary**: #1A1A2E (deep navy - trustworthy, sophisticated)
**Accent**: #FF6B6B (coral red - draws attention to costs without being alarming)
**Background**: #FAFAFA (soft white)
**Surface**: #FFFFFF (pure white cards)
**Border**: #E8E8E8 (subtle dividers)

**Text**:
- Primary: #1A1A2E
- Secondary: #6B6B7B
- Tertiary: #9B9BA8

**Semantic**:
- Success: #4CAF50
- Warning: #FFA726
- Error: #FF6B6B

## Typography

**Font**: Noto Sans JP (Google Font) - excellent Japanese character support, clean and professional

**Type Scale**:
- Display (monthly total): 48px, Bold
- Title: 28px, Bold
- Headline: 22px, SemiBold
- Body: 16px, Regular
- Caption: 14px, Regular
- Label: 12px, Medium

## Visual Design

- Subscription cards: Soft shadow (shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 4), 12px border radius
- Floating Add button: Drop shadow (shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2)
- Category badges: Pill-shaped with tinted backgrounds (10% opacity of accent color)
- All touchables: Subtle scale animation (0.97) on press
- Icons: Feather icons from @expo/vector-icons

## Assets to Generate

**Filename**: icon.png
**Description**: Circular icon with stacked coins or subscription symbol in primary color
**Where Used**: Device home screen app icon

**Filename**: splash-icon.png
**Description**: Same as app icon, centered on splash screen
**Where Used**: App launch screen

**Filename**: empty-subscriptions.png
**Description**: Minimalist illustration of an empty wallet or zero coins, muted colors
**Where Used**: Home screen when no subscriptions are added

**Filename**: avatar-preset.png
**Description**: Simple geometric user avatar (circle with initials placeholder)
**Where Used**: Settings screen profile section

**Filename**: category-entertainment.png
**Description**: Small icon representing entertainment (e.g., play button)
**Where Used**: Category badges and filter screen

**Filename**: category-work.png
**Description**: Small icon representing work (e.g., briefcase)
**Where Used**: Category badges and filter screen

**Filename**: category-health.png
**Description**: Small icon representing health (e.g., heart)
**Where Used**: Category badges and filter screen

**Filename**: category-education.png
**Description**: Small icon representing education (e.g., book)
**Where Used**: Category badges and filter screen
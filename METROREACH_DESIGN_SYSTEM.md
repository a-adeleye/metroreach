# MetroReach Design System 🌐

This document defines the visual language, UI components, and design tokens for the MetroReach Fibre Network application. It is designed to ensure a premium, high-tech, and consistent experience across all modules.

## 🎨 Color Palette

The system uses a curated palette of deep greens and professional neutrals.

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--primary-green` | `#166534` | Primary brand color, CTA buttons, active states. |
| `--secondary-green` | `#0d3b1e` | Hover states for primary green, footer backgrounds. |
| `--success-green` | `#16a34a` | Status indicators (Online/Paid), success alerts. |
| `--midnight-blue` | `#111827` | Primary headings, dark text, high-contrast cards. |
| `--accent-gold` | `#d4a843` | Upload data lines, special highlights, badges. |
| `--light-bg` | `#f8faf9` | Global application background. |
| `--gray-light` | `#f1f5f9` | Component backgrounds, inactive states, dividers. |
| `--text-dark` | `#111827` | Standard body text (high readability). |
| `--text-body` | `#6b7280` | Secondary descriptions, hints, meta information. |
| `--white` | `#ffffff` | Card backgrounds, button text. |
| `--error-red` | `#ef4444` | Danger states, logout buttons, error alerts. |

---

## ✍️ Typography

- **Primary Font**: `Poppins` (Google Fonts)
- **Weights**: 
  - `300` (Light)
  - `400` (Regular)
  - `500` (Medium)
  - `600` (Semi-Bold)
  - `700` (Bold)
  - `800` (Extra-Bold)

### Hierarchy
- **H1 Profile/Page**: `32px` Bold, Midnight Blue
- **H2 Dashboard Welcome**: `24px` Semi-Bold
- **Section Headings**: `17px-20px` Semi-Bold
- **Body Text**: `14px-15px` Regular
- **Small/Meta**: `11px-12px` Medium

---

## 🧱 UI Components

### 1. Cards (`.card`)
The fundamental building block for all dashboard content.
```scss
.card {
    background: var(--white);
    padding: 24px;
    border-radius: 24px; // --radius-lg
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04); // --shadow-soft
    border: 1px solid rgba(0, 0, 0, 0.05);
}
```

### 2. Buttons
Standardized interaction system.
- **`.btn-primary`**: Green background, used for main actions.
- **`.btn-secondary`**: Midnight blue, used for secondary or administrative actions.
- **`.btn-outline`**: Transparent with green border, used for optional/alternative actions.
- **`.btn-logout`**: White background with red border, specifically for exit actions.

### 3. Status Badges (`.badge`)
Rounded, small labels for status.
- **`.active`**: Green background (`--success-green`).
- **`.pop-badge`**: Small overlay for "Recommended" or "New" tags.

### 4. Forms & Inputs
Aligned with a premium vertical-stack approach.
- **Form Groups**: `flex-direction: column` with `8px` gap.
- **Inputs**: `12px 16px` padding, `12px` radius, subtle `1px` border.
- **Focus State**: `1px solid var(--primary-green)` with a `4px` soft glow.

---

## 📊 Instrumentation (Charts)

MetroReach uses a **Low-Ink, High-Detail** approach for data visualization.
- **Chart Lines**: `3px` width, rounded caps.
- **Area Fills**: `0.05 - 0.08` opacity gradients for depth.
- **Grid Lines**: Very subtle (`--gray-light`), used sparingly.
- **Animations**: `0.8s cubic-bezier(0.16, 1, 0.3, 1)` for all data transitions.

---

## 📱 Responsive Principles

- **Desktop (1200px+)**: Sidebar 280px + Grid layouts (Multi-column).
- **Tablet (900px - 1199px)**: Mobile toggle sidebar (hidden) + Single column main content.
- **Mobile (< 768px)**: Stacked stats cards, hidden non-essential meta data, bottom-aligned actions.

---

## ⚡ Animation Tokens

```scss
--transition-smooth: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
```
*Note: All page containers must use `animation: fadeIn 0.5s ease-out;` for a premium navigational feel.*

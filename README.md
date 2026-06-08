# 🌌 Qbamart - Premium E-Commerce Ecosystem

Welcome to **Qbamart**, a modern, high-performance e-commerce platform built with a cutting-edge tech stack. This project features a robust Django backend and a sleek, responsive React frontend.

[![Status](https://img.shields.io/badge/Status-Development-orange?style=flat-square)]()
[![Backend](https://img.shields.io/badge/Backend-Django-092e20?style=flat-square&logo=django)]()
[![Frontend](https://img.shields.io/badge/Frontend-React-61dafb?style=flat-square&logo=react)]()
[![Styling](https://img.shields.io/badge/Styling-Custom%20CSS-blueviolet?style=flat-square)]()

---

## ✨ Key Features

🎨 **Premium UI/UX**: Designed with modern aesthetics, smooth transitions, and a mobile-first approach.
🏷️ **Advanced Category Management**: Multi-level hierarchical categories with intuitive sidebars.
🛒 **Intelligent Checkout**: Streamlined ordering process with abandoned cart recovery mechanisms.
📊 **Admin Command Center**: A comprehensive dashboard for managing orders, products, and site-wide metrics.
🚀 **Performance Optimized**: Built with Vitest/Vite for lightning-fast frontend development and interaction.

---

## 🛠️ Tech Stack

### Frontend (`/web`)
- **Core**: React 18, TypeScript
- **Bundler**: Vite
- **Styling**: Custom Vanilla CSS (Premium Design System)
- **Icons**: Lucide React

### Backend (`/backend`)
- **Core**: Django, Django REST Framework
- **Language**: Python 3.x
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **Features**: JWT Authentication, Image Processing (Pillow)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### Backend Setup
1. Navigate to `/backend`
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Start development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to `/web`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

---

## 📚 Documentation (Wiki)

Detailed documentation is available in the [`/docs`](./docs) directory:
- [🏗️ Architecture Overview](./docs/ARCHITECTURE.md)
- [🔌 API Reference](./docs/API_ENDPOINTS.md)
- [🪛 Setup Guide](./docs/SETUP.md)

---

## 🧪 Testing

- **Backend**: `python manage.py test`
- **Frontend**: `npm run test` (if configured)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<p align="center">Made with ❤️ for the Qbamart Community</p>

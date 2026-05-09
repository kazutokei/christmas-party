# Gift Exchange Party App

A modern, real-time web application for hosting virtual Gift Exchanges (like Secret Santa or White Elephant). Built with React and Supabase, this app provides a seamless, synchronous experience for all party guests whether they are in the same room or across the world.

## Features

- **Real-Time Multiplayer:** Instant state synchronization across all players using Supabase Realtime subscriptions.
- **Host Controls:** The lobby host has administrative power to set the theme/budget, start the game, and reveal the final results.
- **Room Codes:** Secure, randomly generated 6-letter room codes make joining a private party extremely easy.
- **Interactive Gift Grid:** A fun, bouncy grid where players take turns picking gifts.
- **Wishlist Support:** Players can secretly log their wishlists to give their assigned person some hints.
- **Responsive & Accessible:** Fully optimized for mobile devices and small screens. Built with inclusive language to suit any celebration.
- **Row-Level Security (RLS):** Fully secured database structure ensuring players can only join and interact with authorized game data.

## Technology Stack

- **Frontend:** React.js, CSS3 (CSS Grid, Flexbox, Glassmorphism UI)
- **Backend/Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Email/Password)
- **Animations:** `react-confetti`, custom CSS keyframes

## Getting Started

### Prerequisites
You will need Node.js installed on your machine and a free [Supabase](https://supabase.com/) account.

### 1. Clone & Install
```bash
git clone https://github.com/kazutokei/christmas-party.git
cd christmas-party
npm install
```

### 2. Supabase Setup
Create a new project in Supabase. You will need to create two tables:
- `rooms` (Columns: `id`, `created_at`, `code`, `host_id`, `is_started`, `price_rule`, `reveal_phase`)
- `participants` (Columns: `id`, `created_at`, `room_id`, `user_id`, `name`, `wishlist`, `picked_number`, `brought_gift`)

Enable Row Level Security (RLS) on both tables and create permissive policies for `authenticated` users.

### 3. Environment Variables
Create a `.env` file in the root directory and add your Supabase credentials:
```env
REACT_APP_SUPABASE_URL=your-supabase-project-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run Locally
```bash
npm start
```
The application will be available at `http://localhost:3000`.

## How to Play

1. **Host a Lobby:** One person signs up and clicks "Create & Host". They will be given a 6-letter Room Code.
2. **Join the Lobby:** The rest of the party signs up and enters the Room Code to join the lobby.
3. **Set Rules:** The Host sets the "Theme & Budget" (e.g. "$25 limit", "Funny Mugs only"). Guests can write out their secret wishlists.
4. **Start Game:** The Host starts the game. Guests take turns picking numbers from the interactive gift grid.
5. **Reveal:** Once everyone has picked, the Host triggers the big reveal. Confetti drops, and everyone finds out who they are buying a gift for!

## License
This project is open-source and available under the MIT License. Feel free to use it for your own holiday parties!

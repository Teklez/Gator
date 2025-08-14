# Gator – RSS Feed Aggregator

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

Gator is a fast, lightweight CLI tool that lets you subscribe to RSS feeds, keep them updated automatically, and read post summaries right in your terminal. Whether it's blogs, news sites, or podcasts, Gator puts all your content in one place without ads or distractions.

## Features

- **User Management**: Create accounts and manage multiple users
- **RSS Feed Subscription**: Subscribe to any RSS feed with a simple command
- **Automatic Updates**: Background feed aggregation with configurable intervals
- **Feed Organization**: Follow/unfollow feeds and organize your subscriptions
- **Post Browsing**: View recent posts with titles, summaries, and publication dates
- **Database Storage**: PostgreSQL-based storage with automatic migrations
- **CLI Interface**: Simple command-line interface for all operations

## Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** database
- **TypeScript** knowledge (for development)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Teklez/Gator.git
   cd Gator
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up your database configuration:**
   Create a `.gatorconfig.json` file in your home directory:

   ```json
   {
     "db_url": "postgresql://username:password@localhost:5432/gator_db",
     "current_user_name": null
   }
   ```

4. **Run database migrations:**

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Build and run:**
   ```bash
   npm run build
   npm start
   ```

## Usage

### Basic Commands

```bash
# User Management
gator register <username>          # Create a new user account
gator login <username>             # Log in as a user
gator users                        # List all users

# Feed Management
gator addfeed <name> <url>        # Add a new RSS feed
gator feeds                       # List all available feeds
gator follow <url>                # Follow a feed
gator unfollow <url>              # Unfollow a feed
gator following                    # List feeds you're following

# Content Browsing
gator browse [limit]              # Browse recent posts (default: 2)

# Feed Aggregation
gator agg <interval>              # Start feed aggregation (e.g., 5m, 1h)
```

### Examples

```bash
# Start using Gator
gator register john
gator login john

# Add some feeds
gator addfeed "Tech News" "https://techcrunch.com/feed/"
gator addfeed "Blog" "https://example.com/rss.xml"

# Start collecting feeds every 5 minutes
gator agg 5m

# Browse recent posts
gator browse 10
```

## Configuration

### Database Configuration

The application requires a PostgreSQL database. Configure it in `~/.gatorconfig.json`:

```json
{
  "db_url": "postgresql://username:password@localhost:5432/gator_db",
  "current_user_name": "your_username"
}
```

### Environment Variables

- `DATABASE_URL`: Alternative way to set database connection string
- `NODE_ENV`: Set to `production` for production deployments

## Project Structure

```
Gator/
├── src/
│   ├── api/                    # API handlers for feeds and scraping
│   ├── commandHandler.ts       # CLI command implementations
│   ├── config.ts              # Configuration management
│   ├── db/                    # Database layer
│   │   ├── migrations/        # Database migration files
│   │   ├── queries/           # Database query functions
│   │   └── schema.ts          # Database schema definitions
│   ├── index.ts               # Main application entry point
│   ├── middleware.ts          # Authentication middleware
│   ├── types.ts               # TypeScript type definitions
│   └── utils.ts               # Utility functions
├── drizzle.config.ts           # Database migration configuration
├── package.json                # Project dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

## Database Schema

The application uses the following main tables:

- **users**: User accounts and authentication
- **feeds**: RSS feed information and metadata
- **feed_follows**: User-feed subscription relationships
- **posts**: Individual RSS feed items and content

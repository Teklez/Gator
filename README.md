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

## Development

### Prerequisites

- Node.js 18+
- PostgreSQL
- TypeScript knowledge

### Development Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up development database:**

   ```bash
   # Create a local PostgreSQL database
   createdb gator_dev

   # Update your .gatorconfig.json with dev database URL
   ```

3. **Run in development mode:**

   ```bash
   npm run dev
   ```

4. **Generate database migrations:**

   ```bash
   npm run db:generate
   ```

5. **Apply migrations:**
   ```bash
   npm run db:migrate
   ```

### Available Scripts

```bash
npm start          # Run the application
npm run dev        # Run with tsx for development
npm run build      # Build TypeScript to JavaScript
npm run db:generate # Generate new database migrations
npm run db:migrate  # Apply database migrations
npm test           # Run tests (not yet implemented)
```

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules (when configured)
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

## Dependencies

### Core Dependencies

- **drizzle-orm**: Type-safe database ORM
- **postgres**: PostgreSQL client for Node.js
- **fast-xml-parser**: RSS/XML parsing library

### Development Dependencies

- **typescript**: TypeScript compiler
- **tsx**: TypeScript execution engine
- **drizzle-kit**: Database migration toolkit
- **@types/node**: Node.js type definitions

## Deployment

### Production Build

1. **Build the application:**

   ```bash
   npm run build
   ```

2. **Set production environment:**

   ```bash
   export NODE_ENV=production
   ```

3. **Run with PM2 or similar process manager:**
   ```bash
   pm2 start dist/index.js --name gator
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
CMD ["node", "dist/index.js"]
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write clear commit messages
- Add tests for new functionality
- Update documentation as needed
- Follow the existing code style

## Troubleshooting

### Common Issues

**Database Connection Error:**

- Verify PostgreSQL is running
- Check database credentials in `~/.gatorconfig.json`
- Ensure database exists and is accessible

**Feed Parsing Issues:**

- Verify RSS feed URL is accessible
- Check if feed format is valid RSS/XML
- Review network connectivity

**Permission Errors:**

- Ensure proper file permissions for config files
- Check database user permissions

### Debug Mode

Enable debug logging by setting:

```bash
export DEBUG=gator:*
```

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Drizzle ORM](https://orm.drizzle.team/)
- RSS parsing powered by [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser)
- Database migrations handled by [Drizzle Kit](https://kit.drizzle.team/)

## Support

- **Issues**: [GitHub Issues](https://github.com/Teklez/Gator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Teklez/Gator/discussions)
- **Wiki**: [Project Wiki](https://github.com/Teklez/Gator/wiki)

---

**Made with ❤️ by the Gator Team**

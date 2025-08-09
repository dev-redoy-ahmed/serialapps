# Bangla Serial Admin Panel

A comprehensive admin panel for managing Bangla TV serials, channels, episodes, and advertisements.

## Features

- **Dashboard**: Overview of all statistics and quick actions
- **Channels Management**: Add, edit, delete TV channels
- **Serials Management**: Manage TV serials with channel associations
- **Episodes Management**: Handle episodes for each serial
- **AdMob Ads Configuration**: Manage advertisement settings
- **Notices Management**: Create and manage app notifications
- **Premium Purchases**: Track user premium subscriptions

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Icons**: Lucide React

## Installation

1. Clone the repository:
```bash
git clone https://github.com/dev-redoy-ahmed/serialapps.git
cd serialapps
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add:
```env
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Collections

The application uses the following MongoDB collections:

- `channels` - TV channel information
- `serials` - TV serial data with channel references
- `episodes` - Episode data linked to serials
- `ads` - AdMob advertisement configuration
- `notices` - App notifications
- `premiumpurchases` - User premium subscription data
- `appupdates` - App update information

## API Endpoints

### Channels
- `GET /api/channels` - Get all channels
- `POST /api/channels` - Create new channel
- `PUT /api/channels` - Update channel
- `DELETE /api/channels` - Delete channel

### Serials
- `GET /api/serials` - Get all serials with channel info
- `POST /api/serials` - Create new serial
- `PUT /api/serials` - Update serial
- `DELETE /api/serials` - Delete serial

### Episodes
- `GET /api/episodes` - Get all episodes
- `POST /api/episodes` - Create new episode
- `PUT /api/episodes` - Update episode
- `DELETE /api/episodes` - Delete episode

### AdMob Ads
- `GET /api/admob-ads` - Get ad configuration
- `PUT /api/admob-ads` - Update ad configuration

### Notices
- `GET /api/notices` - Get all notices
- `POST /api/notices` - Create new notice
- `PUT /api/notices` - Update notice
- `DELETE /api/notices` - Delete notice

### Data Overview
- `GET /api/get-all-data` - Get overview of all collections

## Project Structure

```
├── components/
│   └── Layout.js          # Main layout component
├── lib/
│   ├── constants.js       # App constants and configurations
│   └── mongodb.js         # MongoDB connection utility
├── pages/
│   ├── api/              # API routes
│   ├── _app.js           # Next.js app component
│   ├── index.js          # Dashboard page
│   ├── channels.js       # Channels management
│   ├── serials.js        # Serials management
│   ├── episodes.js       # Episodes management
│   ├── admob-ads.js      # AdMob configuration
│   └── notices.js        # Notices management
├── styles/
│   └── globals.css       # Global styles with Tailwind
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For any questions or support, please contact the development team.
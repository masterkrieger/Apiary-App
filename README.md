# Apiary Website

This is a website for beekeepers to display the historical and current weights of their honeybee hives in a user-friendly graph with weekly, daily, and yearly increments.

## Dependencies

- Node.js
- NPM
- MongoDB
- PM2 or nodemon

## Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Build the app with `npm run build`
4. Start the server `pm2 start server.js --name Apiary-App`

## Usage

- Navigate to `http://localhost:3001` in a web browser to view the website.
- Use the buttons to switch between different timeframes for the weight data.

## API Endpoints

### GET /api/hives

Returns a list of all hives in the database.

### GET /api/hives/:id

Returns the hive with the specified ID.

### GET /api/hives/date/:date

Returns the hive data from the specified date string.

### POST /api/hives

Creates a new hive with the specified data.

### PUT /api/hives/:id

Updates the hive with the specified ID with the specified data.

### DELETE /api/hives/:id

Deletes the hive with the specified ID.

## Contributing

1. Fork the repository
2. Create a new branch
3. Make changes and commit them
4. Push changes to your fork
5. Create a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

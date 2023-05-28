# Apiary Website

This is a website for beekeepers to display the historical and current weights of their honeybee hives in a user-friendly graph with weekly, daily, and yearly increments.

## Dependencies

- Node.js
- NPM
- MongoDB

## Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the server with `npm run start`

## Usage

- Navigate to `http://localhost:3000` in a web browser to view the website
- Use the buttons to switch between different timeframes for the weight data
- Click on a hive to view its details, including a chart of its weight data

## API Endpoints

### GET /api/hives

Returns a list of all hives in the database.

### GET /api/hives/:id

Returns the hive with the specified ID.

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
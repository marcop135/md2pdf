# Markdown2PDF

Neat, tidy, offline Markdown to PDF conversion app that works directly in your browser.

This is a fork of [this project](https://github.com/realdennis/md2pdf). Thanks to @realdennis for the original work.

---

## Features

- Convert Markdown files to PDF effortlessly
- Works 100% offline in your browser
- Clean and minimal UI
- No server needed, privacy-friendly
- Supports custom styles for PDFs
- Instant preview

## TODO

- [x] Update Yarn dependencies
- [x] Improve UI/UX (icons and colors)
- [x] Add a new md/text preview for first-load
- [x] Hide app from search engines
- [x] Improve perf and sec via Apache Server config
- [x] Improve app responsiveness if small screen
- [ ] React v16 to 18
- [ ] Add a new favicon

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/marcop135/md2pdf.git
   ```
2. Navigate to the project directory:
   ```bash
   cd md2pdf
   ```
3. Install dependencies:
   ```bash
   yarn install
   ```
4. Start the app locally (if using a development server):
   ```bash
   yarn start
   ```
   Or simply open `index.html` in your browser for a quick test.

## Usage

- Open the app in your browser.
- Paste or write your Markdown in the editor.
- Click "Convert to PDF" to download your PDF.

## Tech Stack

- JavaScript
- HTML5
- CSS3
- (Possible React, if/when upgraded)

## Folder Structure

| Folder/File  | Description                       |
| ------------ | --------------------------------- |
| src/         | Main application source code      |
| public/      | Static files and index.html       |
| styles/      | CSS/Sass stylesheets              |
| package.json | Project metadata and dependencies |
| README.md    | Project documentation             |

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Describe your feature'`
4. Push to your fork: `git push origin feature/your-feature`
5. Open a pull request

## License

MIT

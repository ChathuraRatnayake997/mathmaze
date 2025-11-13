# The Math Blueprint [Monochrome Edition]

An interactive mathematics learning platform with three comprehensive modules designed to teach fundamental mathematical concepts through visual and interactive methods.

## Features

- **U-01: Fundamentals** - Basic mathematical concepts
- **U-02: Adding and Subtracting** - Interactive calculation strategies including:
  - **Partitioning**: Breaking numbers into hundreds, tens, and ones
  - **Compensating**: Using compensation to simplify calculations  
  - **Doubling**: Using doubling as a calculation strategy
- **U-03: Multiplying and Dividing** - Advanced multiplication and division techniques

## Live Demo

This website is deployed on GitHub Pages and can be accessed at:
`https://[your-username].github.io/[repository-name]`

## Local Development

To run this website locally:

1. Clone the repository
2. Open a terminal in the project directory
3. Start a local server:
   ```bash
   python -m http.server 8000
   ```
4. Open your browser and navigate to `http://localhost:8000`

## Deployment to GitHub Pages

### Method 1: Direct Upload (Recommended for beginners)

1. **Create a GitHub Repository**
   - Go to [GitHub.com](https://github.com) and sign in
   - Click the "+" icon in the top right corner
   - Select "New repository"
   - Name your repository (e.g., "math-blueprint")
   - Make it **Public** (required for free GitHub Pages)
   - Don't initialize with README (we already have files)

2. **Upload Your Files**
   - Click "uploading an existing file"
   - Drag and drop all files from your "Maths V1" folder
   - Commit the files with message "Initial commit"

3. **Enable GitHub Pages**
   - Go to your repository Settings
   - Scroll down to "Pages" in the left sidebar
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

4. **Access Your Site**
   - Your site will be available at: `https://[your-username].github.io/[repository-name]`
   - It may take 5-10 minutes for the site to go live

### Method 2: Using Git Commands

1. **Initialize Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository and Push**
   - Create repository on GitHub (same as above)
   - Connect your local repository to GitHub:
   ```bash
   git remote add origin https://github.com/[your-username]/[repository-name].git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages** (follow steps 3-4 from Method 1)

## Project Structure

```
├── index.html              # Main application entry point
├── style.css               # Global styles
├── script.js               # Main application logic
├── chapters/               # Individual lesson modules
│   ├── fundamentals/
│   ├── addition-and-subtraction/
│   └── multiplying-and-dividing/
└── README.md              # This file
```

## Technologies Used

- **HTML5** - Structure and content
- **CSS3** - Styling and layout
- **Vanilla JavaScript** - Interactive functionality
- **Google Fonts** - Typography (Poppins & Chakra Petch)

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please create an issue in the GitHub repository.
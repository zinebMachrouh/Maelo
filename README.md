# 🎶 Welcome to Maelo!

## Hello, Music Lovers! 👋

Welcome to **Maelo**, the perfect app for managing and enjoying your local music collection! Built with **Angular**, **NgRx**, and the power of **Web Audio API**, Maelo lets you organize, play, and control your tracks effortlessly.

---

## 🎧 Features

### **Track Management**
- **CRUD** operations for tracks: Add, edit, delete, and view.
- Track details: **Title**, **Artist**, **Category**, **Duration**, and **Description**.
- Automatically added date and track length calculation.

### **Audio Player**
- Play, pause, skip, and control volume.
- Track progress and buffering states for seamless listening.


### **Storage**
- Store audio files and metadata in **IndexedDB**.
- Supports MP3, WAV, and OGG (15 MB max per file).

### **Validations**
- Title and description length restrictions.
- Audio and image file validation.

---

## 🛠️ Tech Stack

- **Angular 17**: For a smooth frontend experience.
- **NgRx**: State management for easy control of app flow.
- **Web Audio API**: For an amazing audio playback experience.

---

## 🚀 Setup

### Prerequisites:
- **Node.js** (14+)
- **Angular CLI**
- **Docker** (for containerized deployment)

### Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/zinebMachrouh/Maelo
   cd Maelo
   ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the dev server:
    ```bash
    ng serve
    ```
Access it at http://localhost:4200. 

4. Build Docker image:
    ```bash
    docker build -t maelo-app .
    ```

5. Run the Docker container:
    ```bash
    docker run -p 4200:4200 maelo-app
    ```

## 📝 Testing

- Run tests with Jasmine:
    ```bash
    ng test
    ```

# 🎉 Get Started with Maelo Today!
If you have any questions or need assistance, feel free to reach out to the development team. We are here to help you get started with Maelo and ensure a seamless experience. 🚀
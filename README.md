# Personalized Meal Planner

## Project Description

This project is a web-based personalized meal planner application designed to help users generate customized meal plans based on their unique dietary preferences, health goals, and lifestyle. It leverages the power of AI to create intelligent and adaptable meal suggestions, ensuring users can maintain a healthy and balanced diet tailored to their needs.

## Features

-   **User Authentication:** Secure user registration and login powered by Supabase.
-   **User Profile Management:** Users can create and update their detailed profiles, including age, sex, height, weight, activity level, dietary patterns, allergies, intolerances, disliked foods, favorite foods, meals per day, cooking skill, and specific constraints (e.g., time per meal, budget, equipment).
-   **Personalized Meal Plan Generation:** Utilizes the Google Gemini API to generate daily meal plans tailored to the user's profile, including meal titles, preparation/cooking times, ingredients, instructions, and nutritional information.
-   **Macro Target Calculation:** Calculates and displays estimated BMI and macro targets (calories, protein, carbohydrates, fat) based on user profile data.
-   **Allergen and Dietary Validation:** Ensures generated meal plans adhere to specified allergies and dietary patterns.
-   **Responsive User Interface:** A clean and intuitive interface built with React and Bootstrap, providing a seamless experience across various devices.

## Technical Stack

### Frontend

-   **React:** A JavaScript library for building user interfaces.
-   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and maintainability.
-   **Bootstrap:** A popular CSS framework for developing responsive and mobile-first websites.
-   **React Router DOM:** For declarative routing in React applications.
-   **Webpack:** A module bundler for JavaScript applications.
-   **ESLint:** For maintaining code quality and consistency.

### Backend & Database

-   **Supabase:** An open-source Firebase alternative providing a PostgreSQL database, authentication, instant APIs, and real-time subscriptions. It handles user authentication and stores user profiles and meal plan data.

### AI/ML

-   **Google Gemini API:** Used for intelligent meal plan generation based on the detailed user profiles.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (LTS version recommended)
-   npm (Node Package Manager) or Yarn
-   A Google Gemini API Key
-   A Supabase project with its URL and Anon Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd 10-pratice-project
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the root of your project and add the following environment variables:

```
GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
SUPABASE_ANON_KEY=YOUR_SUPABASE_PROJECT_ANON_KEY
```

Replace `YOUR_GOOGLE_GEMINI_API_KEY`, `YOUR_SUPABASE_PROJECT_URL`, and `YOUR_SUPABASE_PROJECT_ANON_KEY` with your actual keys and URL.

### Running the Application

To start the development server:

```bash
npm start
```

This will open the application in your default web browser at `http://localhost:8080` (or another port if 8080 is in use).

## Project Structure

-   `src/api/`: Contains API service integrations (Supabase, Gemini).
-   `src/components/`: Reusable React components.
-   `src/context/`: React Context for global state management (e.g., authentication, language).
-   `src/hooks/`: Custom React hooks.
-   `src/pages/`: Top-level components representing different views/pages of the application.
-   `src/types/`: TypeScript type definitions.
-   `src/utils/`: Utility functions (e.g., macro calculations, string manipulation).

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the ISC License.
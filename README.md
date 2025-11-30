# MediTrack

A comprehensive medication tracking system for healthcare professionals to manage client medications, track administration, and maintain accurate records.

## Overview

MediTrack is a React-based web application designed for healthcare staff to efficiently manage their clients' medication schedules and track daily administration. The application provides an intuitive interface for viewing client profiles, recording medication administration with staff initials, and accessing detailed medication information via the OpenFDA API.

## Features

- User Authentication: Secure registration and login system with password validation
- Profile Management: Staff can update their name, initials, and avatar
- Client Management: View and manage multiple clients with medication schedules
- Medication Tracking: Interactive monthly calendar grid for recording medication administration
- Staff Accountability: Each administration is logged with staff initials, with protection to prevent unauthorized edits
- OpenFDA Integration: Access detailed medication information including warnings, dosage, and active ingredients
- Protected Routes: Authentication required for accessing client data and medication logs
- Responsive Design: Modern UI with blue/purple gradient theme and Inter font

## Technologies Used

### Frontend

- React 19.2.0: UI component library
- React Router DOM 7.9.6: Client-side routing
- Vite 7.2.4: Build tool and development server

### State Management

- React Hooks (useState, useEffect, useContext)
- Custom hooks (useForm)
- Context API (CurrentUserContext)

### Styling

- CSS with BEM methodology
- Self-hosted Inter font (Regular, Medium, SemiBold, Bold)
- Modern gradient design system

### APIs

- OpenFDA Drug Label API: Third-party medication information
- Simulated backend API using localStorage 


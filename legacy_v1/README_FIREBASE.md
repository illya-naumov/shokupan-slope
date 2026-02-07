# Shokupan Slope - Firebase Hosting Guide

This guide explains how to deploy your site to Firebase Hosting and connect your custom domain (`shokupanslope.com`).

## Prerequisites
1.  **Node.js** installed (You already did this).
2.  **Google Account** (active).

## Step 1: Install Firebase Tools
Open your terminal (PowerShell or CMD) in the project folder and run:
```bash
npm install -g firebase-tools
```

## Step 2: Login and Initialize
1.  **Login**:
    ```bash
    firebase login
    ```
    (A browser window will open. Login with your Google account).
    
    *Troubleshooting:*
    - If "firebase is not recognized": Use `npx firebase login`.
    - If "script cannot be loaded" (PowerShell error): Run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` and try again.

2.  **Initialize**:

    ```bash
    firebase init hosting
    ```
    *(Or `npx firebase init hosting`)*

    - **Are you ready to proceed?**: `Y`
    - **Select project**: `Create a new project`.
        - Enter a unique ID (e.g., `shokupan-slope-bk`).
        - Enter a name (e.g., `Shokupan Slope`).
    - **What do you want to use as your public directory?**: `dist` (IMPORTANT: Type `dist`).
    - **Configure as a single-page app?**: `No` (Since we have multiple HTML pages).
    - **Set up automatic builds and deploys with GitHub?**: `No` (for now).

## Step 3: Build the Site
Before deploying, we must build the project using Vite.
```bash
npm run build
```
This creates the `dist/` folder with your optimized site.

## Step 4: Deploy
```bash
firebase deploy
```
Success! Your site will be live at `https://your-project-id.web.app`.

## Step 5: Connect Custom Domain
1.  Go to the [Firebase Console](https://console.firebase.google.com).
2.  Select your project.
3.  Go to **Hosting** (left sidebar).
4.  Click **Add Custom Domain**.
5.  Enter `shokupanslope.com`.
6.  Follow the instructions to add the **TXT records** and **A records** to your DNS provider (wherever you bought the domain, e.g., Google Domains, GoDaddy).
7.  **Wait**: SSL certification can take up to 24 hours (usually faster).

## Custom Domain (Cloudflare + Firebase)
If you see an **HTTPS/Cert Error** after connecting your domain:

1.  **The Cause**: Firebase tries to provision an SSL cert, but Cloudflare is also trying to be the SSL provider. They conflict.
2.  **The Fix (In Cloudflare Dashboard)**:
    *   Go to **SSL/TLS** > **Overview**.
    *   Change the setting from "Flexible" to **"Full (Strict)"**.
    *   *Why?* Firebase already provides HTTPS. "Flexible" breaks the chain. "Full (Strict)" tells Cloudflare to trust Firebase's encryption.
3.  **Alternative (If that fails)**:
    *   Go to **DNS** in Cloudflare.
    *   Turn **OFF** the "Proxy" status (Orange Cloud -> Grey Cloud) for your A/CNAME records.
    *   Wait for Firebase to verify and provision the certificate (can take ~1 hour).
    *   Once working, you can turn the Proxy (Orange Cloud) back on.

4.  **Check Firebase Status**:
    *   Go to **Firebase Console** > **Hosting**.
    *   Look at the domain status table.
    *   **"Connected"**: Good. Clear your browser cache.
    *   **"Pending" / "Verifying"**: Firebase is still working. Wait.
    *   **"Needs Setup"**: Click "View" and follow instructions.


---

## Updating the Site
Whenever you make code changes:
1.  `npm run build`
2.  `firebase deploy`

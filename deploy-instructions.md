# 🚀 Host on Google Cloud Run (Project: amdhack)

I've already prepared the `Dockerfile` and `nginx.conf` for you. Follow these steps to host your **Smart Retail Assistant** on Google Cloud.

## Prerequisites
- Google Cloud SDK (`gcloud`) installed and authenticated.
- Docker installed and running locally (or use Cloud Build).

## 🚀 3-Step Deployment

### 1. Enable Required Services
Open your terminal and run:
```bash
gcloud services enable run.googleapis.com containerregistry.googleapis.com --project=amdhack
```

### 2. Build and Submit to Container Registry
We'll use Google Cloud Build so you don't need to build the image locally:
```bash
gcloud builds submit --tag gcr.io/amdhack/smart-retail-assistant --project=amdhack
```

### 3. Deploy to Cloud Run
Run the following command to deploy. This will make the app publicly accessible. 
**Note:** I've updated the config to use port **8080**, which is the Cloud Run default.

```bash
gcloud run deploy smart-retail-assistant \
  --image gcr.io/amdhack/smart-retail-assistant \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --project=amdhack \
  --port=8080 \
  --set-env-vars="VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE"
```

> [!TIP]
> **Environment Variables**: Even though I implemented a **Demo Mode**, you can add your real Gemini API key during deployment using the `--set-env-vars` flag as shown above.

---

## 🔍 How to Verify
Once the command completes, you will receive a **Service URL** (e.g., `https://smart-retail-assistant-xyz.a.run.app`). 
1. Open the URL in your browser.
2. If you haven't provided an API key, notice the **"Demo Mode"** badge in the header.
3. Interact with the chat and categories to see the system in action!

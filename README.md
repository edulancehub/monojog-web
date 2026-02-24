# Monojog — Landing Site

This repository contains the Monojog landing website (Chrome extension marketing + mobile app coming soon pages).

Preview locally:

```powershell
cd d:\monojog-web
python -m http.server 8080
# Then open http://localhost:8080 in your browser
```

Files added:
- `index.html` — main page
- `css/` — styles and animations
- `js/` — site interactions
- `assets/` — favicon and images

How to push (if push above failed due to auth):

```powershell
git remote add origin https://github.com/edulancehub/monojog-web
git branch -M main
git push -u origin main
```

If you prefer using GitHub CLI:

```powershell
gh auth login
gh repo create edulancehub/monojog-web --public --source=. --remote=origin --push
```

Contact the repo owner to confirm access or provide a deploy token if needed.

---
Website for monojog

Generated locally by a development assistant.

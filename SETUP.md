# Getting Fly Box onto your phone

Two ways. The second one is the real answer; the first is a five-minute look
before you commit to it.

---

## A. Quick look, same wifi, no setup

Good for checking the layout on a real phone. **No offline** — plain HTTP means
the browser refuses to install a service worker, so this version dies the
moment you lose signal. Fine for a look, useless on a river.

```powershell
cd "$HOME\OneDrive\Desktop\Fly Box\app"
npm install          # first time only
npm run build
npm run preview -- --host
```

It prints two URLs. Use the **Network** one (looks like `http://192.168.1.x:4173/`)
and type that into your phone's browser, with the phone on the same wifi.

---

## B. The real one: GitHub Pages

Free, HTTPS, installs to your home screen, works with no signal, and updates
itself whenever you push. This is how it should live.

### One decision first

GitHub Pages is free on **public** repos. On a private repo it needs a paid
plan. Public means anyone can read the code and the fly content — but **not
your log**: sessions, catches, gear and review history live in your phone's
storage and are never uploaded anywhere. Your fal.ai key isn't in the repo
either; it's read from your environment at render time.

If you'd rather keep it private, the workflow still works — you just need
GitHub Pro, or a different host.

### 0. Add the workflow file yourself

One file could not be written to your disk from here: anything under
`.github/workflows/` is protected against remote writes, which is the right
call — it is the file that runs code on every push. So create it yourself.

The finished file is attached in the chat; drop it at
`Fly Box\.github\workflows\deploy.yml`. Or make it by hand:

```powershell
cd "$HOME\OneDrive\Desktop\Fly Box"
New-Item -ItemType Directory -Force -Path .github\workflows | Out-Null
notepad .github\workflows\deploy.yml
```

and paste this in:

```yaml
name: Deploy Fly Box

# Every push to main rebuilds the content bundle, builds the PWA and publishes
# it. Nothing to run by hand — edit content/data/*.json, push, and the phone
# picks up the new version the next time it loads.
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

# Never let two deploys race; the newest push wins.
concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      # Fail the build on bad content rather than shipping it. The log tests
      # run here too, so a broken user layer never reaches the phone.
      - name: Check content and the log layer
        run: |
          node content/validate.mjs
          node tools/log-demo.mjs

      - name: Install
        working-directory: app
        run: npm install --no-audit --no-fund

      - name: Build
        working-directory: app
        env:
          BASE_PATH: /${{ github.event.repository.name }}/
        run: npm run build

      # enablement: true lets the workflow switch Pages on by itself, so the
      # first deploy does not silently build and never publish.
      - uses: actions/configure-pages@v5
        with:
          enablement: true
      - uses: actions/upload-pages-artifact@v3
        with:
          path: app/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deploy.outputs.page_url }}
    steps:
      - id: deploy
        uses: actions/deploy-pages@v4
```

### 1. Install Git

You've already got `Git-2.55.0.5-64-bit.exe` in Downloads. Run it, accept the
defaults. Then close and reopen PowerShell and check:

```powershell
git --version
```

### 2. Tell Git who you are

Git refuses to make a commit without a name and email on it. Once, globally:

```powershell
git config --global user.name "Jeff Ashachik"
git config --global user.email "jashachik3@gmail.com"
```

**If the repo will be public**, use GitHub's noreply alias instead of your real
address — commit metadata is permanent and public. After your account exists,
Settings -> Emails has an address like
`12345678+yourname@users.noreply.github.com`. Set that as `user.email` before
the first commit; changing it afterwards means rewriting history.

### 3. Make it a repo

```powershell
cd "$HOME\OneDrive\Desktop\Fly Box"
git init -b main
```

If that warns `re-init: ignored --initial-branch=main`, a repo already existed
here and you may be on `master`. Check, and rename if so — the workflow only
fires on `main`:

```powershell
git branch --show-current
git branch -M main          # only if it said master
```

Then:

```powershell
git add .
git commit -m "Fly Box: content layer, log layer, and the four tabs"
```

`.gitignore` already keeps `node_modules`, `dist` and the generated content
bundle out of it.

### 4. Create the repo on GitHub

Go to <https://github.com/new>. Name it whatever you like — the workflow reads
the repo name and builds the site to match, so nothing needs editing either
way. **Capitalisation carries through**: a repo called `Fly-Box` is served at
`/Fly-Box/`, and GitHub Pages paths are case-sensitive, so the URL keeps the
capitals too.

Don't add a README, .gitignore or licence — you already have files. Then, with
your username and repo name in place:

```powershell
git remote add origin https://github.com/YOURNAME/fly-box.git
git push -u origin main
```

### 5. Turn Pages on

In the repo: **Settings → Pages → Build and deployment → Source**, choose
**GitHub Actions**. The workflow also tries to switch this on by itself, but
set it by hand if it is showing "Deploy from a branch" — that setting is the
usual reason a green build still gives you a 404. That's it — `.github/workflows/deploy.yml` is already in
the repo and takes over from here.

Watch it under the **Actions** tab. The build validates the content and runs
the log tests before it publishes, so a broken content edit fails the build
instead of reaching your phone.

When it finishes, your app is at:

```
https://YOURNAME.github.io/REPO-NAME/
```

exactly as the repo is capitalised — for example
`https://jashachik3.github.io/Fly-Box/`.

### 6. Put it on the home screen

Open that URL on your phone.

- **iPhone (Safari)** — Share button → *Add to Home Screen*. Must be Safari;
  Chrome on iOS can't install it.
- **Android (Chrome)** — menu → *Install app* (or *Add to Home Screen*).

It opens fullscreen with no browser chrome, and after the first load it works
with no signal at all.

---

## Living with it

**Updating.** Edit content or code, then:

```powershell
git add .
git commit -m "what changed"
git push
```

Two minutes later the phone picks it up the next time you open the app. You
don't reinstall anything.

**Your log is on the phone and nowhere else.** That's the deal with a private
app that has no account. So:

- Don't "clear site data" for that site.
- Don't log sessions in a private/incognito window.
- Export from the Log tab regularly — the app nags you after three sessions
  and then every ten. Put the JSON somewhere that backs itself up.

**If you get a new phone**, install the app there, then import the JSON export.
Nothing transfers automatically.

**The content bundle is generated.** `npm run dev` and `npm run build` both
rebuild it from `content/data/*.json` first, so the loop is: edit the JSON,
reload. Don't hand-edit `app/src/content/bundle.json`; it gets overwritten.

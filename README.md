# Eye Anatomy Trainer

An interactive 3D training web app on the anatomy of the human eye. It is a static site, so it runs on GitHub Pages with no build step.

## Features
- **3D model** of a right eye with 24 structures: the three tunics, the lens, the humours, the drainage angle, the retinal landmarks, the optic nerve, the retinal vessels and the 6 extraocular muscles.
- **Exploded view** (slider or button) that separates the layers along the eye's axis.
- **Cutaway** that halves the globe to show the interior.
- **Labels with leader lines** that follow the model as you rotate.
- **Explore**: click any structure for its structure, function, clinical relevance and key facts. Double-click to isolate a structure.
- **Guided tour**: 12 steps that follow the tunics and the path of light.
- **Quiz**: three modes (find it on the model, name the highlighted part, concept MCQs), with best scores saved in your browser.
- **Learn**: study notes and tables (tunics, chambers, light path, accommodation, pupillary reflex, muscle actions, key dimensions) and references.

## Run locally
The model is loaded with `fetch`, so serve the folder over HTTP instead of opening the file directly:
```
python -m http.server 8000
```
Then open http://localhost:8000.

## Deploy to GitHub Pages
1. Create a repository (for example `eye-anatomy`) and push the contents of this folder to the root of the `main` branch.
2. In the repository, go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
3. The site appears at `https://<your-username>.github.io/eye-anatomy/`.

## Structure
```
index.html        page layout
css/style.css     styles (light and dark)
js/app.js         three.js viewer, labels, tour, quiz
js/data.js        all teaching content (edit this file to change the text)
models/eye.glb    3D model exported from Blender
```

## Model notes
The model is a schematic built in Blender (1 unit ≈ 10 mm). Small structures (canal of Schlemm, zonules) are enlarged for visibility. Axes: +Z anterior, +Y superior, +X medial (nasal).

## References
Gray's Anatomy (42nd ed.), Remington's *Clinical Anatomy and Physiology of the Visual System*, AAO BCSC Section 2, Kanski's *Clinical Ophthalmology*, Snell & Lemp's *Clinical Anatomy of the Eye*, the National Eye Institute and StatPearls (NCBI Bookshelf). Full list in the app's Learn tab.

This app is for education only and is not a substitute for clinical training.

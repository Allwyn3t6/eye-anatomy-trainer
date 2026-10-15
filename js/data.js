// Content for the Eye Anatomy trainer.
// Model: schematic RIGHT eye. Three.js axes: +Z anterior (front), +Y superior, +X medial (nasal).
// `mesh` = node name in models/eye.glb, `anchor` = label anchor node (anchor_<id>).
// `explode` = offset (model units, 1 unit ≈ 10 mm) applied at full explode.

export const GROUPS = [
  { id: 'fibrous',  name: 'Fibrous tunic (outer layer)',   color: '#e8e2d6' },
  { id: 'vascular', name: 'Vascular tunic / uvea (middle)', color: '#b0563f' },
  { id: 'neural',   name: 'Neural tunic (inner layer)',     color: '#f08a63' },
  { id: 'optical',  name: 'Lens, chambers & humours',       color: '#8fc9ff' },
  { id: 'neurovascular', name: 'Optic nerve & retinal vessels', color: '#f2d27a' },
  { id: 'muscles',  name: 'Extraocular muscles',            color: '#d25555' },
];

export const PARTS = {
  Sclera: {
    name: 'Sclera', latin: 'Sclera', group: 'fibrous', mesh: 'Sclera', explode: [0, 0, -2.8],
    summary: 'The tough, white, opaque outer coat that forms the posterior five-sixths of the eyeball.',
    structure: 'Dense, irregularly arranged type I collagen and elastic fibres with few cells. Thinnest (≈0.3 mm) just behind the rectus insertions and thickest (≈1 mm) posteriorly near the optic nerve, where it becomes the perforated lamina cribrosa through which the optic nerve axons leave.',
    function: 'Protects the intraocular contents, keeps the globe’s shape against intraocular pressure, and provides attachment for the six extraocular muscles.',
    clinical: 'Scleritis causes severe, boring eye pain and is often linked to systemic autoimmune disease. A bluish sclera is seen in osteogenesis imperfecta because the thin sclera lets the dark uvea show through.',
    facts: ['Continuous with the cornea at the limbus', 'Covered anteriorly by episclera and conjunctiva', 'Continuous posteriorly with the dural sheath of the optic nerve'],
  },
  Cornea: {
    name: 'Cornea', latin: 'Cornea', group: 'fibrous', mesh: 'Cornea', explode: [0, 0, 2.6],
    summary: 'The clear, dome-shaped window at the front of the eye and the main focusing surface.',
    structure: 'Avascular and transparent, ≈0.52 mm thick centrally and ≈11.5 mm wide horizontally. Five classic layers: epithelium, Bowman layer, stroma (≈90% of thickness, regularly spaced collagen lamellae), Descemet membrane, and endothelium, which pumps fluid out to keep the stroma clear.',
    function: 'Provides about two-thirds of the eye’s refractive power (≈43 dioptres) and protects the eye. It is densely innervated by the ophthalmic division of the trigeminal nerve (CN V1), which mediates the corneal (blink) reflex.',
    clinical: 'Keratoconus (progressive thinning and coning), corneal abrasions and ulcers, and refractive surgery (LASIK, PRK) all involve the cornea. Corneal transplantation (keratoplasty) is the most commonly performed tissue transplant.',
    facts: ['No blood vessels: nourished by aqueous humour, tears and limbal vessels', 'Endothelial cells do not regenerate in adults', 'Junction with sclera = limbus'],
  },
  AqueousHumor: {
    name: 'Aqueous humour', latin: 'Humor aquosus', group: 'optical', mesh: 'AqueousHumor', explode: [0, 0, 2.0],
    summary: 'Clear, watery fluid filling the anterior and posterior chambers in front of the lens.',
    structure: 'Secreted by the non-pigmented epithelium of the ciliary processes at ≈2–3 µL/min. Fills the posterior chamber (between iris and lens) and the anterior chamber (between cornea and iris).',
    function: 'Nourishes the avascular cornea and lens, removes waste, and maintains intraocular pressure (normal ≈10–21 mmHg), which keeps the globe inflated.',
    clinical: 'An imbalance between production and drainage raises intraocular pressure, the main modifiable risk factor for glaucoma. Many glaucoma drugs reduce aqueous production (beta-blockers, carbonic anhydrase inhibitors).',
    facts: ['Flow: ciliary body → posterior chamber → pupil → anterior chamber → drainage angle', 'Fully replaced roughly every 90–100 minutes'],
  },
  CanalOfSchlemm: {
    name: 'Canal of Schlemm', latin: 'Sinus venosus sclerae', group: 'optical', mesh: 'CanalOfSchlemm', explode: [0, 0, 1.75],
    summary: 'A circular, endothelium-lined channel at the iridocorneal angle that drains aqueous humour.',
    structure: 'Runs around the eye in the inner sclera at the limbus, just outside the trabecular meshwork. Collector channels and aqueous veins carry fluid to the episcleral veins.',
    function: 'The final common pathway of the conventional (trabecular) outflow route, which handles most aqueous drainage. The rest leaves by the uveoscleral route through the ciliary muscle.',
    clinical: 'Increased resistance in the trabecular meshwork and canal raises intraocular pressure in primary open-angle glaucoma. Minimally invasive glaucoma surgery (MIGS) devices often stent or bypass this canal.',
    facts: ['Located in the scleral sulcus at the limbus', 'Shown enlarged in this model for visibility'],
  },
  Iris: {
    name: 'Iris', latin: 'Iris', group: 'vascular', mesh: 'Iris', explode: [0, 0, 1.4],
    summary: 'The coloured, contractile diaphragm in front of the lens, with the pupil at its centre.',
    structure: 'The most anterior part of the uvea. A vascular, pigmented stroma with two smooth muscles: the sphincter pupillae (circular) and the dilator pupillae (radial). Eye colour depends on the amount and distribution of melanin.',
    function: 'Controls how much light enters the eye by changing pupil size. Sphincter: parasympathetic (CN III via the ciliary ganglion and short ciliary nerves), constricts. Dilator: sympathetic (superior cervical ganglion), dilates.',
    clinical: 'Anterior uveitis (iritis) causes a painful red eye and photophobia. Horner syndrome causes miosis from loss of sympathetic supply. Heterochromia means different iris colours.',
    facts: ['Divides the anterior segment into anterior and posterior chambers', 'Root of the iris attaches to the ciliary body'],
  },
  Pupil: {
    name: 'Pupil', latin: 'Pupilla', group: 'vascular', mesh: null, highlight: 'Iris', anchorParent: 'Iris', explode: [0, 0, 1.4],
    summary: 'The circular opening in the centre of the iris through which light reaches the lens.',
    structure: 'Not a structure itself but an aperture. It is typically 2–4 mm in bright light and 4–8 mm in the dark.',
    function: 'Acts as the eye’s adjustable aperture, controlling retinal illumination and depth of field. Pupillary light reflex: optic nerve → pretectal nucleus → Edinger–Westphal nuclei (both sides) → CN III → sphincter pupillae.',
    clinical: 'A relative afferent pupillary defect (swinging flashlight test) indicates optic nerve or severe retinal disease. Unequal pupils (anisocoria) can signal CN III palsy or Horner syndrome.',
    facts: ['Constricts for near vision (the near triad: accommodation, convergence, miosis)', 'The direct and consensual reflexes are normally equal'],
  },
  Lens: {
    name: 'Crystalline lens', latin: 'Lens', group: 'optical', mesh: 'Lens', explode: [0, 0, 0.85],
    summary: 'A transparent, biconvex, elastic lens behind the iris that fine-tunes focus.',
    structure: 'About 10 mm in diameter and 4 mm thick. It has an elastic capsule, a single anterior layer of epithelium, and tightly packed lens fibres that lose their organelles to stay transparent. It is avascular and has no nerves, and keeps growing throughout life.',
    function: 'Provides about 15–20 dioptres of refractive power and can change shape to focus at different distances (accommodation).',
    clinical: 'A cataract is opacification of the lens and the leading cause of reversible blindness worldwide; it is treated by replacing the lens with an intraocular lens. Presbyopia is the age-related loss of accommodation as the lens stiffens.',
    facts: ['Suspended by the zonules from the ciliary body', 'Anterior surface is less curved than the posterior'],
  },
  Zonules: {
    name: 'Zonular fibres', latin: 'Fibrae zonulares (zonules of Zinn)', group: 'optical', mesh: 'Zonules', explode: [0, 0, 0.5],
    summary: 'Fine suspensory fibres that hold the lens in place and transmit the ciliary muscle’s pull.',
    structure: 'Fibrillin-rich microfibrils running from the ciliary processes and pars plana to the equatorial lens capsule.',
    function: 'When the ciliary muscle relaxes (distance vision), the zonules are taut and the lens flattens. When the muscle contracts (near vision), tension falls and the elastic lens rounds up.',
    clinical: 'Marfan syndrome (fibrillin-1 defect) weakens the zonules, causing the lens to dislocate (ectopia lentis), classically superotemporally.',
    facts: ['Also called the suspensory ligament of the lens'],
  },
  CiliaryBody: {
    name: 'Ciliary body', latin: 'Corpus ciliare', group: 'vascular', mesh: 'CiliaryBody', explode: [0, 0, 0.25],
    summary: 'A ring of muscle and secretory tissue between the iris and the choroid.',
    structure: 'Part of the uvea. The anterior pars plicata carries about 70 ciliary processes, and the flat posterior pars plana extends to the ora serrata. It contains the ciliary muscle (longitudinal, radial and circular fibres).',
    function: 'The ciliary muscle (parasympathetic, CN III) controls accommodation through the zonules. The ciliary epithelium secretes aqueous humour. It also contributes to uveoscleral outflow.',
    clinical: 'Cycloplegic drops such as atropine or cyclopentolate paralyse the ciliary muscle for refraction testing. The pars plana is the safe entry site for vitrectomy and intravitreal injections.',
    facts: ['Pars plana lies about 3.5–4 mm behind the limbus'],
  },
  Choroid: {
    name: 'Choroid', latin: 'Choroidea', group: 'vascular', mesh: 'Choroid', explode: [0, 0, -2.1],
    summary: 'The pigmented, highly vascular layer between the retina and the sclera.',
    structure: 'The posterior uvea, made of large outer vessels, medium vessels, and the choriocapillaris (fenestrated capillaries). Bruch’s membrane separates it from the retinal pigment epithelium.',
    function: 'Supplies oxygen and nutrients to the outer retina, including the photoreceptors. Its melanin absorbs stray light, and it helps regulate retinal temperature. Per gram of tissue it has one of the highest blood flows in the body.',
    clinical: 'Choroidal melanoma is the most common primary intraocular cancer in adults. In neovascular (“wet”) age-related macular degeneration, choroidal new vessels grow through Bruch’s membrane.',
    facts: ['Continuous anteriorly with the ciliary body', 'Supplied mainly by the posterior ciliary arteries'],
  },
  Retina: {
    name: 'Retina', latin: 'Retina', group: 'neural', mesh: 'Retina', explode: [0, 0, -1.4],
    summary: 'The light-sensitive neural layer lining the back of the eye.',
    structure: 'Ten layers, from the retinal pigment epithelium outside to the inner limiting membrane inside. It contains about 120 million rods and about 6 million cones, plus bipolar, horizontal, amacrine and ganglion cells. Its serrated anterior edge is the ora serrata.',
    function: 'Turns light into neural signals (phototransduction), does early visual processing, and sends output through about 1.2 million ganglion cell axons to the optic nerve. Rods handle dim light; cones handle colour and fine detail.',
    clinical: 'Retinal detachment needs urgent repair and presents with flashes, floaters and a “curtain” over vision. Diabetic retinopathy is a leading cause of blindness in working-age adults.',
    facts: ['Light passes through the inner layers before reaching the photoreceptors', 'Inner retina: central retinal artery; outer retina: choroid'],
  },
  Macula: {
    name: 'Macula lutea', latin: 'Macula lutea', group: 'neural', mesh: 'Macula', explode: [0, 0, -1.4],
    summary: 'A yellowish area of the central retina, temporal to the optic disc, specialised for sharp central vision.',
    structure: 'About 5.5 mm across and centred on the fovea. Its yellow colour comes from the xanthophyll pigments lutein and zeaxanthin. Cones are packed very densely here.',
    function: 'Gives high-acuity central and colour vision for reading, recognising faces and fine detail. The macular pigment filters short-wavelength (blue) light.',
    clinical: 'Age-related macular degeneration (dry and wet) is the leading cause of irreversible central vision loss in older adults in high-income countries. The Amsler grid is used to detect macular distortion.',
    facts: ['Lies about 3–4 mm temporal to the optic disc'],
  },
  Fovea: {
    name: 'Fovea centralis', latin: 'Fovea centralis', group: 'neural', mesh: 'Fovea', explode: [0, 0, -1.4],
    summary: 'A small central pit in the macula where vision is sharpest.',
    structure: 'About 1.5 mm across. The inner retinal layers are pushed aside, so light reaches the cones directly. The central foveola (about 0.35 mm) contains only cones and lies within the foveal avascular zone.',
    function: 'Gives the highest visual acuity. When we fixate on an object, we turn the eye so its image falls on the fovea.',
    clinical: 'In central retinal artery occlusion, the fovea shows as a “cherry-red spot” against the pale, swollen retina. Macular holes form at the fovea.',
    facts: ['Contains no rods, which is why faint stars are easier to see slightly off-centre'],
  },
  OpticDisc: {
    name: 'Optic disc', latin: 'Discus nervi optici', group: 'neural', mesh: 'OpticDisc', explode: [0, 0, -1.4],
    summary: 'The point where ganglion cell axons leave the eye as the optic nerve. This is the physiological blind spot.',
    structure: 'An oval about 1.5–1.8 mm across, nasal to the fovea. It has a central cup, and the central retinal vessels enter and leave here. There are no photoreceptors on the disc.',
    function: 'The exit for retinal nerve fibres and the entry and exit for the central retinal artery and vein.',
    clinical: 'An enlarged cup-to-disc ratio suggests glaucoma. A swollen disc from raised intracranial pressure is called papilloedema. The blind spot sits about 15° temporal to fixation in the visual field.',
    facts: ['Also called the optic nerve head', 'Examined with an ophthalmoscope'],
  },
  OpticNerve: {
    name: 'Optic nerve (CN II)', latin: 'Nervus opticus', group: 'neurovascular', mesh: 'OpticNerve', explode: [0, 0, -3.6],
    summary: 'The nerve that carries visual information from the retina to the brain.',
    structure: 'About 1.2 million retinal ganglion cell axons, roughly 50 mm long, in four parts: intraocular, intraorbital, intracanalicular and intracranial. The axons become myelinated (by oligodendrocytes) behind the lamina cribrosa. It is wrapped in dura, arachnoid and pia, a CNS tract rather than a true peripheral nerve.',
    function: 'Sends visual signals to the optic chiasm, where nasal fibres cross, and on to the lateral geniculate nucleus and visual cortex. It also forms the afferent limb of the pupillary light reflex.',
    clinical: 'Optic neuritis (often linked to multiple sclerosis) causes painful vision loss. Glaucoma is a progressive optic neuropathy. Compression at the chiasm (for example by a pituitary tumour) causes bitemporal hemianopia.',
    facts: ['Leaves the orbit through the optic canal with the ophthalmic artery', 'Exits nasal to the posterior pole'],
  },
  CentralRetinalArtery: {
    name: 'Central retinal artery', latin: 'Arteria centralis retinae', group: 'neurovascular', mesh: 'CentralRetinalArtery', explode: [0, 0, -1.4],
    summary: 'The end artery that supplies the inner retina.',
    structure: 'A branch of the ophthalmic artery (from the internal carotid). It enters the optic nerve about 10 mm behind the globe and divides at the disc into superior and inferior, nasal and temporal branches (arterioles).',
    function: 'Supplies the inner two-thirds of the retina, including the ganglion cells and nerve fibre layer.',
    clinical: 'Central retinal artery occlusion causes sudden painless loss of vision, a pale retina and a cherry-red spot. It is a stroke equivalent that needs urgent vascular work-up.',
    facts: ['End artery: no significant anastomoses', 'Cilioretinal artery (≈20% of people) can spare the macula'],
  },
  CentralRetinalVein: {
    name: 'Central retinal vein', latin: 'Vena centralis retinae', group: 'neurovascular', mesh: 'CentralRetinalVein', explode: [0, 0, -1.4],
    summary: 'The vein that drains the inner retina.',
    structure: 'Retinal venules converge at the optic disc and run back in the optic nerve beside the artery, draining to the superior ophthalmic vein or straight into the cavernous sinus.',
    function: 'Returns blood from the inner retina.',
    clinical: 'Central retinal vein occlusion gives the “blood and thunder” fundus of widespread haemorrhages and is associated with hypertension, glaucoma and diabetes.',
    facts: ['Veins are wider and darker than arteries (A:V ratio ≈ 2:3)'],
  },
  VitreousBody: {
    name: 'Vitreous body', latin: 'Corpus vitreum', group: 'optical', mesh: 'VitreousBody', explode: [0, 0, -0.6],
    summary: 'The clear gel filling the large space between the lens and the retina.',
    structure: 'About 4 mL (about 80% of the eye’s volume). It is about 99% water, with type II collagen fibrils and hyaluronic acid. It is firmly attached at the vitreous base (around the ora serrata), the optic disc and the macula.',
    function: 'Keeps the eye’s shape, lets light pass clearly to the retina, and supports the retina against the choroid.',
    clinical: 'With age it liquefies and can separate from the retina (posterior vitreous detachment), causing floaters and flashes. A traction tear can then lead to retinal detachment. Vitreous haemorrhage occurs in proliferative diabetic retinopathy.',
    facts: ['Fills the vitreous chamber', 'Unlike aqueous, it is not continuously replaced'],
  },
  SuperiorRectus: {
    name: 'Superior rectus', latin: 'Musculus rectus superior', group: 'muscles', mesh: 'SuperiorRectus', explode: [0, 1.7, -2.8],
    summary: 'Extraocular muscle that mainly elevates the eye.',
    structure: 'Arises from the common tendinous ring (annulus of Zinn) at the orbital apex and inserts on the sclera about 7.7 mm behind the limbus.',
    function: 'Elevation (most effective when the eye is abducted), plus intorsion and adduction. Nerve supply: oculomotor nerve (CN III), superior division.',
    clinical: 'Tested clinically by asking the patient to look up and out.',
    facts: ['Rectus insertions form the spiral of Tillaux (MR 5.5 < IR 6.5 < LR 6.9 < SR 7.7 mm)'],
  },
  InferiorRectus: {
    name: 'Inferior rectus', latin: 'Musculus rectus inferior', group: 'muscles', mesh: 'InferiorRectus', explode: [0, -1.7, -2.8],
    summary: 'Extraocular muscle that mainly depresses the eye.',
    structure: 'Arises from the annulus of Zinn and inserts about 6.5 mm behind the limbus.',
    function: 'Depression (most effective in abduction), plus extorsion and adduction. Nerve supply: CN III, inferior division.',
    clinical: 'Can become trapped in an orbital floor (blow-out) fracture, limiting upgaze. Often enlarged in thyroid eye disease.',
    facts: ['Tested by asking the patient to look down and out'],
  },
  MedialRectus: {
    name: 'Medial rectus', latin: 'Musculus rectus medialis', group: 'muscles', mesh: 'MedialRectus', explode: [1.7, 0, -2.8],
    summary: 'The largest extraocular muscle; turns the eye towards the nose.',
    structure: 'Arises from the annulus of Zinn and inserts about 5.5 mm behind the limbus, the closest of the four recti.',
    function: 'Adduction. Nerve supply: CN III, inferior division.',
    clinical: 'Internuclear ophthalmoplegia (a lesion of the medial longitudinal fasciculus, for example in MS) impairs adduction on lateral gaze.',
    facts: ['Pure horizontal action'],
  },
  LateralRectus: {
    name: 'Lateral rectus', latin: 'Musculus rectus lateralis', group: 'muscles', mesh: 'LateralRectus', explode: [-1.7, 0, -2.8],
    summary: 'Turns the eye outwards, away from the nose.',
    structure: 'Arises from the annulus of Zinn, spanning the superior orbital fissure, and inserts about 6.9 mm behind the limbus.',
    function: 'Abduction. Nerve supply: abducens nerve (CN VI). Mnemonic: LR6 SO4, all the rest 3.',
    clinical: 'CN VI palsy (often from raised intracranial pressure, because of its long intracranial course) causes an inward-turning eye and horizontal double vision that is worse at distance.',
    facts: ['Pure horizontal action'],
  },
  SuperiorOblique: {
    name: 'Superior oblique', latin: 'Musculus obliquus superior', group: 'muscles', mesh: 'SuperiorOblique', explode: [1.3, 1.7, -2.4],
    summary: 'A long, thin muscle whose tendon runs through a pulley (the trochlea) before inserting on the back of the eye.',
    structure: 'Arises from the sphenoid body above and medial to the annulus. Its tendon passes through the trochlea at the superomedial orbital rim, then turns back to insert on the posterosuperolateral sclera.',
    function: 'Intorsion (primary), plus depression (greatest in adduction) and abduction. Nerve supply: trochlear nerve (CN IV).',
    clinical: 'CN IV palsy causes vertical double vision that is worse looking down, for example on stairs or when reading. Patients tilt their head away from the affected side to compensate.',
    facts: ['Effectively pulls from the trochlea, in front of the eye’s centre'],
  },
  InferiorOblique: {
    name: 'Inferior oblique', latin: 'Musculus obliquus inferior', group: 'muscles', mesh: 'InferiorOblique', explode: [-0.4, -1.9, -1.2],
    summary: 'The only extraocular muscle that does not arise from the orbital apex.',
    structure: 'Arises from the orbital floor (maxilla) just lateral to the nasolacrimal groove, passes beneath the inferior rectus, and inserts on the posteroinferolateral sclera near the macula.',
    function: 'Extorsion (primary), plus elevation (greatest in adduction) and abduction. Nerve supply: CN III, inferior division.',
    clinical: 'Overaction of the inferior oblique causes the eye to drift up when looking towards the nose. It is a common target of strabismus surgery.',
    facts: ['Its nerve carries the parasympathetic root to the ciliary ganglion'],
  },
};

// Guided tour: follows the eye's layers and the path of light.
export const TOUR = [
  { title: 'Welcome: the eyeball', parts: [], explode: 0, cutaway: false, view: [3.6, 1.6, 4.6],
    text: 'The eyeball is roughly a 24 mm sphere sitting in the bony orbit. Its wall has three layers (tunics): the outer fibrous tunic, the middle vascular tunic (uvea) and the inner neural tunic (retina). Inside are the lens and two fluids, the aqueous humour and the vitreous body. Drag to rotate, scroll to zoom, and click any structure to learn about it.' },
  { title: 'Inside the globe: a cutaway', parts: [], explode: 0, cutaway: true, view: [4.4, 1.4, 2.4],
    text: 'Cutting the eye in half shows the three tunics stacked from outside to inside: sclera, then choroid, then retina. The front segment holds the cornea, iris, ciliary body and lens, while the large vitreous chamber fills the back.' },
  { title: '1 · Fibrous tunic', parts: ['Sclera', 'Cornea'], explode: 0.55, cutaway: true, view: [4.6, 1.8, 3.4],
    text: 'The outer coat is made of collagen. Behind, it is the opaque white sclera; in front, it is the transparent cornea. They meet at the limbus. The cornea is the eye’s most powerful focusing surface (about 43 D).' },
  { title: '2 · Aqueous humour and drainage', parts: ['AqueousHumor', 'CanalOfSchlemm', 'CiliaryBody'], explode: 0.35, cutaway: true, view: [3.0, 1.0, 3.8],
    text: 'The ciliary body secretes aqueous humour into the posterior chamber. It flows through the pupil into the anterior chamber and drains at the iridocorneal angle through the trabecular meshwork into the canal of Schlemm. When drainage is poor, pressure rises, which is a key risk factor for glaucoma.' },
  { title: '3 · Iris and pupil', parts: ['Iris', 'Pupil'], explode: 0.35, cutaway: true, view: [2.4, 0.8, 4.4],
    text: 'The iris works like a camera’s aperture. The parasympathetic sphincter pupillae (CN III) constricts the pupil, and the sympathetic dilator pupillae widens it. The pupillary light reflex is a key bedside test of the optic nerve and CN III.' },
  { title: '4 · Lens, zonules and accommodation', parts: ['Lens', 'Zonules', 'CiliaryBody'], explode: 0.45, cutaway: true, view: [3.2, 1.2, 2.6],
    text: 'The lens hangs from the ciliary body on the zonules. For near vision the ciliary muscle contracts, the zonules slacken, and the elastic lens becomes rounder, adding focusing power. With age the lens stiffens (presbyopia) and can cloud over (cataract).' },
  { title: '5 · Vitreous body', parts: ['VitreousBody'], explode: 0.3, cutaway: true, view: [4.2, 1.0, 1.4],
    text: 'This clear gel fills about 80% of the eye. It keeps the globe’s shape and lets light pass undisturbed to the retina. With age it liquefies and can pull away from the retina (posterior vitreous detachment).' },
  { title: '6 · Vascular tunic: the choroid', parts: ['Choroid', 'CiliaryBody', 'Iris'], explode: 0.55, cutaway: true, view: [4.6, 1.6, 0.6],
    text: 'The uvea is the iris, the ciliary body and the choroid. The choroid’s dense capillary bed (the choriocapillaris) feeds the photoreceptors, and its pigment absorbs stray light.' },
  { title: '7 · Retina, macula and fovea', parts: ['Retina', 'Macula', 'Fovea'], explode: 0.4, cutaway: true, view: [2.0, 0.6, 1.6],
    text: 'The retina turns light into nerve signals. At the posterior pole, the macula (yellow) contains the fovea, a cone-only pit that gives the sharpest vision. This is where the image falls when you look straight at something.' },
  { title: '8 · Optic disc and blind spot', parts: ['OpticDisc', 'OpticNerve', 'CentralRetinalArtery', 'CentralRetinalVein'], explode: 0.3, cutaway: true, view: [2.6, 0.8, 1.2],
    text: 'Ganglion cell axons leave the eye nasal to the fovea at the optic disc, which has no photoreceptors (the blind spot). The central retinal artery and vein enter and leave here, branching over the retina to supply its inner layers.' },
  { title: '9 · Extraocular muscles', parts: ['SuperiorRectus', 'InferiorRectus', 'MedialRectus', 'LateralRectus', 'SuperiorOblique', 'InferiorOblique'], explode: 0.0, cutaway: false, view: [3.6, 3.0, -4.6],
    text: 'Six muscles move each eye. The four recti arise from the common tendinous ring at the orbital apex; the superior oblique’s tendon runs through the trochlea; and the inferior oblique arises from the orbital floor. Nerve supply: LR6 SO4, all the rest 3.' },
  { title: 'Summary: the path of light', parts: ['Cornea', 'AqueousHumor', 'Pupil', 'Lens', 'VitreousBody', 'Retina', 'OpticNerve'], explode: 1.0, cutaway: true, view: [6.0, 2.4, 3.6],
    text: 'Light passes through the cornea, then the aqueous humour, the pupil, the lens, the vitreous body, and on to the retina (photoreceptors). Signals then travel along the optic nerve to the brain. Try the Quiz tab to test yourself.' },
];

export const MCQ = [
  { q: 'Which structure provides most of the eye’s refractive power?', options: ['Cornea', 'Lens', 'Vitreous body', 'Aqueous humour'], a: 0, part: 'Cornea' },
  { q: 'Aqueous humour is secreted by the…', options: ['Iris stroma', 'Ciliary body epithelium', 'Choroid', 'Lens epithelium'], a: 1, part: 'CiliaryBody' },
  { q: 'Aqueous humour mainly drains into the…', options: ['Vortex veins', 'Central retinal vein', 'Canal of Schlemm', 'Nasolacrimal duct'], a: 2, part: 'CanalOfSchlemm' },
  { q: 'Which part of the retina has only cones and gives the sharpest vision?', options: ['Optic disc', 'Ora serrata', 'Fovea centralis', 'Peripheral retina'], a: 2, part: 'Fovea' },
  { q: 'Why is the optic disc a “blind spot”?', options: ['It is covered by blood vessels', 'It contains no photoreceptors', 'It is full of rods only', 'The vitreous is opaque there'], a: 1, part: 'OpticDisc' },
  { q: 'Which nerve supplies the lateral rectus?', options: ['Oculomotor (CN III)', 'Trochlear (CN IV)', 'Abducens (CN VI)', 'Facial (CN VII)'], a: 2, part: 'LateralRectus' },
  { q: 'Which nerve supplies the superior oblique?', options: ['Trochlear (CN IV)', 'Abducens (CN VI)', 'Oculomotor (CN III)', 'Optic (CN II)'], a: 0, part: 'SuperiorOblique' },
  { q: 'For near vision, the ciliary muscle…', options: ['Relaxes and the zonules tighten', 'Contracts and the zonules slacken', 'Contracts and the lens flattens', 'Has no role'], a: 1, part: 'Zonules' },
  { q: 'Which layer supplies the photoreceptors with blood?', options: ['Sclera', 'Choroid (choriocapillaris)', 'Vitreous', 'Central retinal artery only'], a: 1, part: 'Choroid' },
  { q: 'Pupil constriction (miosis) is produced by the…', options: ['Dilator pupillae, sympathetic', 'Sphincter pupillae, parasympathetic', 'Ciliary muscle, sympathetic', 'Superior tarsal muscle'], a: 1, part: 'Iris' },
  { q: 'Opacification of the crystalline lens is called…', options: ['Glaucoma', 'Keratoconus', 'Cataract', 'Papilloedema'], a: 2, part: 'Lens' },
  { q: 'Lens dislocation in Marfan syndrome is due to weakness of the…', options: ['Zonular fibres', 'Cornea', 'Iris dilator', 'Vitreous base'], a: 0, part: 'Zonules' },
  { q: 'About what fraction of the eye’s volume is the vitreous body?', options: ['10%', '30%', '50%', '80%'], a: 3, part: 'VitreousBody' },
  { q: 'The central retinal artery is a branch of the…', options: ['Facial artery', 'Ophthalmic artery', 'Maxillary artery', 'Posterior cerebral artery'], a: 1, part: 'CentralRetinalArtery' },
  { q: 'The only extraocular muscle that does NOT arise from the orbital apex is the…', options: ['Superior oblique', 'Inferior oblique', 'Lateral rectus', 'Medial rectus'], a: 1, part: 'InferiorOblique' },
  { q: 'The tough white outer coat of the eye is the…', options: ['Choroid', 'Retina', 'Sclera', 'Conjunctiva'], a: 2, part: 'Sclera' },
];

export const LESSONS = [
  { title: 'The three tunics', html: `
    <table><thead><tr><th>Tunic</th><th>Parts</th><th>Key role</th></tr></thead><tbody>
    <tr><td>Fibrous (outer)</td><td>Sclera, cornea</td><td>Protection, shape, refraction (cornea)</td></tr>
    <tr><td>Vascular / uvea (middle)</td><td>Iris, ciliary body, choroid</td><td>Blood supply, light control, accommodation, aqueous production</td></tr>
    <tr><td>Neural (inner)</td><td>Retina (macula, fovea, optic disc)</td><td>Phototransduction</td></tr></tbody></table>` },
  { title: 'Chambers of the eye', html: `
    <ul><li><b>Anterior chamber</b>: between the cornea and the iris; contains aqueous humour.</li>
    <li><b>Posterior chamber</b>: a narrow space between the iris and the lens/zonules; contains aqueous humour.</li>
    <li><b>Vitreous chamber</b>: behind the lens; contains the vitreous body.</li></ul>` },
  { title: 'Path of light', html: `<p>Cornea → aqueous humour → pupil → lens → vitreous body → retina (through the inner layers to the photoreceptors) → bipolar cells → ganglion cells → optic nerve → optic chiasm → optic tract → lateral geniculate nucleus → optic radiation → primary visual cortex (V1).</p>` },
  { title: 'Accommodation (near response)', html: `<p>Looking at a near object triggers the <b>near triad</b>: accommodation (ciliary muscle contracts, the zonules slacken, the lens rounds), <b>convergence</b> (medial recti) and <b>miosis</b> (sphincter pupillae). All three are mediated by CN III.</p>` },
  { title: 'Pupillary light reflex', html: `<p><b>Afferent:</b> retina → optic nerve → optic tract → pretectal nucleus. <b>Efferent:</b> both Edinger–Westphal nuclei → CN III → ciliary ganglion → short ciliary nerves → sphincter pupillae. Light in one eye constricts both pupils (direct and consensual).</p>` },
  { title: 'Extraocular muscle actions', html: `
    <table><thead><tr><th>Muscle</th><th>Primary</th><th>Secondary / tertiary</th><th>Nerve</th></tr></thead><tbody>
    <tr><td>Medial rectus</td><td>Adduction</td><td>–</td><td>CN III</td></tr>
    <tr><td>Lateral rectus</td><td>Abduction</td><td>–</td><td>CN VI</td></tr>
    <tr><td>Superior rectus</td><td>Elevation</td><td>Intorsion, adduction</td><td>CN III</td></tr>
    <tr><td>Inferior rectus</td><td>Depression</td><td>Extorsion, adduction</td><td>CN III</td></tr>
    <tr><td>Superior oblique</td><td>Intorsion</td><td>Depression, abduction</td><td>CN IV</td></tr>
    <tr><td>Inferior oblique</td><td>Extorsion</td><td>Elevation, abduction</td><td>CN III</td></tr></tbody></table>
    <p class="muted">Mnemonic: <b>LR6 SO4</b>, all the rest 3.</p>` },
  { title: 'Key dimensions (adult)', html: `<ul>
    <li>Axial length ≈ 24 mm</li><li>Central corneal thickness ≈ 0.52 mm; horizontal diameter ≈ 11.5 mm</li>
    <li>Lens ≈ 10 mm diameter × 4 mm thick</li><li>Vitreous volume ≈ 4 mL</li>
    <li>Optic disc ≈ 1.5–1.8 mm; macula ≈ 5.5 mm; fovea ≈ 1.5 mm</li>
    <li>Normal intraocular pressure ≈ 10–21 mmHg</li><li>Refractive power: cornea ≈ 43 D, lens ≈ 15–20 D, total ≈ 60 D</li></ul>` },
];

export const REFERENCES = [
  'Standring S (ed.). Gray’s Anatomy: The Anatomical Basis of Clinical Practice, 42nd ed. Elsevier, 2020: chapter on the eye.',
  'Remington LA, Goodwin D. Clinical Anatomy and Physiology of the Visual System, 4th ed. Elsevier, 2021.',
  'American Academy of Ophthalmology. Basic and Clinical Science Course, Section 2: Fundamentals and Principles of Ophthalmology.',
  'Bowling B. Kanski’s Clinical Ophthalmology: A Systematic Approach, 9th ed. Elsevier, 2020.',
  'Snell RS, Lemp MA. Clinical Anatomy of the Eye, 2nd ed. Blackwell Science, 1998.',
  'National Eye Institute (NIH). “How the Eyes Work” and “Parts of the Eye”, nei.nih.gov.',
  'StatPearls: Anatomy, Head and Neck, Eye; Anatomy, Head and Neck, Eye Muscles. NCBI Bookshelf.',
];

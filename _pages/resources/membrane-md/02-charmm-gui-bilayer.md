---
layout: page
title: "Part 2: Building a lipid bilayer with CHARMM-GUI"
permalink: /resources/membrane-md/02-charmm-gui-bilayer/
nav: false
---

*Part 2 of the [Getting Started with Membrane MD]({{ '/resources/membrane-md/' | relative_url }}) series. Last updated: April 2026. Tested with CHARMM-GUI v3.7 generating output for NAMD 3.0.2 with the CHARMM36 force field.*

In [Part 1]({{ '/resources/membrane-md/01-mac-setup/' | relative_url }}) you installed NAMD and VMD. Now we'll use [CHARMM-GUI](https://www.charmm-gui.org/) — a free web-based system builder — to construct an all-atom DOPC bilayer with explicit water and ions. By the end of this tutorial you'll have a fully-prepared simulation system ready to run in NAMD.

CHARMM-GUI handles a lot of complexity behind the scenes: placing lipids in two leaflets, solvating with water, neutralizing charge with counter-ions, and generating force-field-compatible structure files plus equilibration scripts. We'll walk through the interface step by step, explaining every choice we make.

---

## Why CHARMM-GUI?

Building a lipid bilayer from scratch is a real engineering project — you'd need to place hundreds of lipid molecules in two leaflets without atomic clashes, equilibrate water around them, place ions in physically reasonable positions, and generate parameter files that match the chosen force field. Researchers used to do this by hand or with custom scripts, and it took days.

CHARMM-GUI automates the whole process and gives you, at the end, a tarball with everything NAMD needs to start simulating: structure files, force field parameters, and a multi-step equilibration protocol. It's used by thousands of labs and is widely cited (Lee et al. 2016 *J. Chem. Theory Comput.* 12:405). It's free for academic use and well-supported.

The flip side is that CHARMM-GUI is a *web service* — you don't get full programmatic control, and rebuilding a slightly different system requires going through the web interface again. For starting out, the web workflow is a feature rather than a bug; later, when you're building dozens of systems, you may want to script things differently.

---

## Step 1: Register and log in

Go to [https://www.charmm-gui.org/](https://www.charmm-gui.org/) and click **Register** in the top-right. Fill in the form (name, email, institutional affiliation, intended use). You'll receive a confirmation email; click the link to activate the account. Approval is usually fast — sometimes immediate, occasionally up to 24 hours if there's a manual review.

Once activated, log in. The CHARMM-GUI homepage has a sidebar listing many tools (membrane builder, ligand reader, glycan reader, etc.). We want **Input Generator → Membrane Builder → Bilayer Builder**.

---

## Step 2: Choose a system type

On the Bilayer Builder entry page, you'll see options for:

- **Protein/Membrane System** — a transmembrane protein embedded in a bilayer
- **Membrane Only System** — a pure lipid bilayer with no protein
- **Lipid bilayer with ligands** — a bilayer with small molecules
- A few others

Choose **Membrane Only System**. This skips all the protein placement options that don't apply to a pure bilayer.

---

## Step 3: System size and lipid composition

This is the most important configuration page. CHARMM-GUI gives you several ways to specify the box size and composition.

### Heterogeneous vs Homogeneous

Near the top you'll see a notice: *"Homogeneous Lipid option is no longer supported. You can use 'Heterogeneous Lipid' option even for homogeneous lipid bilayer building."* Just leave **Heterogeneous Lipid** selected. CHARMM-GUI consolidated their UI; the heterogeneous interface works fine for single-lipid systems too.

### Box geometry settings

- **Box Type:** Rectangular
- **Length of Z based on:** Water thickness, set to **17.5 Å**
- **Length of XY based on:** Numbers of lipid components

Why these values?

- **Rectangular** is the standard choice for a flat bilayer. The hexagonal option is sometimes used to study things like membrane proteins where you want to minimize edge effects, but rectangular boxes are more common and simpler.
- **17.5 Å of water above and below the bilayer** is the standard "full hydration" amount — it gives ~50 waters per lipid, comfortably enough to ensure water near the bilayer surface behaves like bulk water and doesn't see its own periodic image across the box.
- **Numbers of lipid components** lets you specify the lipid count directly, and CHARMM-GUI computes the box size to fit. The alternative ("Ratios of lipid components") asks for an XY box size and lipid ratios, then computes counts — slightly more cumbersome when you know the number of lipids you want.

### Lipid composition

Below the geometry settings is a long table of lipid types organized by class (Sterols, PA, PC, PE, PG, etc.). Find **DOPC** under **PC (phosphatidylcholine) Lipids**. Set **upper leaflet = 100** and **lower leaflet = 100**, leaving everything else at zero.

DOPC's per-lipid surface area appears in the table as **69.7 Å²** — this is CHARMM-GUI's default estimate, consistent with experimental measurements of DOPC at ~30°C.

### Calculate the system size

Once your composition is filled in, click **Show the system info**. The right-hand panel updates to show:

- DOPC: 100 / 100 lipids per leaflet
- Lipid Area per leaflet: 6970 Å² (= 100 × 69.7)
- A = B = 83.49 Å (= √6970 — the side length of a square with that area)

Numbers will be slightly different if you used a different composition or surface area. For pure DOPC at 100/leaflet, expect XY dimensions around 83 Å.

When everything looks right, click **Next Step** at the bottom.

[screenshot: System Size Determination Options page with Heterogeneous Lipid selected, Rectangular box, water thickness 17.5, Numbers of lipid components, DOPC 100/100, system info populated]

---

## Step 4: Initial lipid placement

After clicking Next Step, CHARMM-GUI runs a server-side calculation that:

1. Selects 200 DOPC molecules from its lipid library
2. Generates an initial scaffold of "pseudo-spheres" representing the headgroup and tail positions
3. Performs preliminary geometry checks for clashes

This step takes 1–3 minutes. You'll see streaming output from the CHARMM program — including many lines that look like:

```
PARRDR> Error: Repeated DIHE parameter (5771): CG2D CG2D ...
```

**These look alarming but are not errors.** CHARMM is loading multiple parameter files in sequence, and when two files happen to define the same dihedral angle, it warns you. The later definition correctly overrides the earlier one. The fact that processing continues confirms nothing is actually broken.

Wait for the page to advance automatically. You'll land on Step 3 of the workflow (the page numbers are confusing — CHARMM-GUI's "Step 1, 2..." labels are different from the website's overall workflow steps. Just follow the prompts.).

---

## Step 5: Add ions and build components

The next page lets you specify the ionic environment and choose how lipids are placed in the actual simulation box.

### System Building Method

CHARMM-GUI offers two methods: **Insertion** and **Replacement**. For most bilayer systems including yours, only Replacement is available, and CHARMM-GUI will say so. Don't worry about it — Replacement is the standard choice and works well.

### Ion settings

- **Include Ions:** checked
- **Ion Placing Method:** Distance — places ions based on a minimum distance criterion
- **Concentration:** 0.15 M (= 150 mM, a common physiological concentration)
- **Neutralizing:** on (adjusts ion count to neutralize any net charge)

Now the important choice: ion species. CHARMM-GUI defaults to **KCl** (potassium chloride). For lipid bilayer simulations, **NaCl** (sodium chloride) is more common and matches most published work. Switch the ion species:

- In the dropdown showing "KCl", select **NaCl**
- Click **Add Simple Ion Type** if needed
- If KCl appears in the table at the bottom, remove it (the `-` button on the right)
- Confirm the table shows: Formula NaCl, Cation Na⁺, Anion Cl⁻, Concentration 0.15 M

For a neutral DOPC bilayer at 0.15 M NaCl in a box of this size, expect about **15 Na⁺ and 15 Cl⁻** to be added (the exact numbers will be confirmed in the next step).

[screenshot: System Building Options page with NaCl 0.15M selected, ion count showing roughly 15 each]

Click **Next Step** to begin the major build.

---

## Step 6: Build the components

This step does the actual work of:

1. Replacing the pseudo-spheres with real DOPC molecules with random orientations
2. Solvating the system with TIP3P water
3. Placing 15 Na⁺ and 15 Cl⁻ ions in the water layers
4. A short minimization to relieve steric clashes

It takes 3–5 minutes, depending on server load. Output streams by, including more "Repeated DIHE" warnings (still harmless).

When it finishes, the page advances automatically. You'll see output files for the lipid component (`step4_lipid.pdb`) and a "view structure" link. Click the link to inspect — you should see a recognizable bilayer with two leaflets of DOPC, headgroups (red oxygens, blue nitrogens) facing outward, hydrocarbon tails facing the bilayer midplane. No water or ions yet — those come in the next sub-step.

CHARMM-GUI splits the lipid placement and water/ion addition into two server jobs to avoid timing out. Click **Next Step** to add water and ions.

This sub-step takes another 1–2 minutes. When it finishes, you have separate files for lipids (`step4_lipid.pdb`), water (`step4.2_waterbox.crd`), and ions (`step4.3_ion.pdb`).

Click **Next Step: Assemble Components**.

---

## Step 7: Final assembly

The assembly step combines lipids + water + ions into unified system files. This step is fast — usually under a minute. The output is a coherent set of master files:

- **`step5_assembly.pdb`** — final atomic coordinates
- **`step5_assembly.psf`** — topology (atom types, masses, partial charges, bonds)
- **`step5_assembly.crd`** — alternative coordinate format (CHARMM CRD)
- **`step5_assembly.str`** — system metadata (box dimensions, lipid counts, ion counts)

These are the four files you'll work with going forward.

[screenshot: Assembly page with step5 files listed]

You can also click **view structure** here to see the complete system: bilayer in the middle, water above and below, ions scattered through the water. This is your starting structure — exactly what NAMD will begin simulating.

---

## Step 8: Choose force field and output options

This is the final configuration page and contains a lot of choices. Let's walk through them.

### Determined System Size

At the top, CHARMM-GUI summarizes what you've built:

- 48,412 atoms total
- 200 DOPC lipids (100 per leaflet)
- 6,926 water molecules
- 17 Na⁺ + 17 Cl⁻ ions (slightly more than the geometric estimate from Step 5 — the final count is computed based on the actual water volume)
- Box: A = B = 83.49 Å, C = 75 Å

For a neutral DOPC bilayer system, this is exactly what you'd expect.

### Force Field Options

- **Force field dropdown:** CHARMM36m

CHARMM36m is the modern CHARMM force field for proteins. For lipids (which is what we have), CHARMM-GUI automatically uses **CHARMM36** for lipid parameters, which is the standard choice well-validated against experimental data on bilayer thickness, area per lipid, and lipid order parameters.

Three checkboxes below the dropdown:

- **WYF parameter for cation-π interactions** — leave unchecked (only relevant for systems with aromatic residues and cations)
- **Hydrogen mass repartitioning (HMR)** — leave unchecked (this lets you use a 4 fs timestep instead of 2 fs, doubling speed, but it changes simulation dynamics slightly and is best learned later)
- **Multi-site Ca²⁺** — leave unchecked (no calcium in this system)

### Input Generation Options

- **More CHARMM minimization during input generation:** keep checked. Runs an extra minimization round before generating output, helping ensure NAMD doesn't blow up at simulation start.
- **NAMD:** **CHECK THIS BOX**. This is critical — without it, no NAMD scripts will be generated.
- **Other engines** (GROMACS, AMBER, OpenMM, etc.): leave unchecked unless you specifically want input files for those too.

### Equilibration Options

- **Generate grid information for PME FFT automatically:** selected (NAMD will figure out the FFT grid size)
- **NPT ensemble:** selected. This is critical for membranes — constant pressure lets the box flex laterally as the bilayer relaxes. Don't use NVT (constant volume), which would artificially fix the area per lipid.
- **Surface tension:** 0 dyne/cm. For a single-component bilayer, surface tension = 0 is the standard convention.
- **Temperature:** 303.15 K (= 30°C). DOPC's main phase transition is at -17°C, so the bilayer is well into the fluid phase here.

[screenshot: Force Field Options page with NAMD checkbox highlighted]

When everything is set, click **Next Step**.

---

## Step 9: Generation

CHARMM-GUI now generates all the output files: the equilibration scripts, the production script, restraint files, and metadata. It's the longest step — typically 5–10 minutes — because the server is doing one final round of minimization plus generating ~30 input files for various engines.

When it completes, you land on the final page. You'll see:

- A **download.tgz** button (top-right of the file list area)
- All the output files listed
- A description of the equilibration scheme at the bottom

The equilibration scheme is worth reading: it shows that CHARMM-GUI sets up a 6-step protocol with gradually relaxing restraints. Lipids start with strong positional restraints (pinning them roughly in place) and dihedral restraints (preventing tail conformations from flying off), and over six cycles these restraints decay to zero. The whole equilibration runs ~1.875 ns of MD by default. We'll cover this in detail in Part 3.

[screenshot: Final generation page with download.tgz highlighted]

---

## Step 10: Download and unpack

Click **download.tgz**. The file is named like `charmm-gui-XXXXXXXXX.tgz` where the number is your CHARMM-GUI job ID — yours will be different from anyone else's, but that's fine, the contents are what matters. The tarball is roughly 50–100 MB.

It lands in your `~/Downloads/` folder by default. Move it to your project's Dropbox folder (or wherever you keep simulation inputs):

```
mv ~/Downloads/charmm-gui-*.tgz ~/Dropbox/path/to/project/folder/
```

Then unpack:

```
cd ~/Dropbox/path/to/project/folder/
tar -xzf charmm-gui-*.tgz
```

This creates a folder named after the job ID (e.g., `charmm-gui-7736644910/`). Navigate into it and look around:

```
cd charmm-gui-7736644910
ls
```

You'll see a lot of files. The most important ones for our purposes are:

| File or folder | Purpose |
|---|---|
| `step5_assembly.psf` / `.pdb` / `.crd` / `.str` | Master structure files |
| `step6.1_equilibration.inp` ... `step6.6_equilibration.inp` | The six equilibration scripts |
| `step7_production.inp` | Production script |
| `toppar/` | CHARMM36 force field parameter files |
| `namd/` | NAMD-specific subset of files (we'll use these in Part 3) |
| `step1_*.{inp,out}` ... `step4_*.{inp,out}` | Records of each build stage (useful for reproducibility) |

The intermediate `step1`–`step4` files document how the system was built. You don't need them for running, but they're useful if you ever want to know exactly what CHARMM-GUI did.

---

## Step 11: Verify the build

Before moving on to running simulations, take a moment to verify what you built. Look at the system info file:

```
cat step5_assembly.str
```

You'll see CHARMM variables for the box dimensions, lipid counts, water count, and ion counts — these are the canonical record of what's in your system. For our DOPC build:

```
SET BOXTYPE = RECT
SET A = 83.4865259
SET B = 83.4865259
SET C = 75
SET NLIPTOP = 100
SET NLIPBOT = 100
SET NWATER = 6926
SET NPOSTOT = 17
SET NNEGTOT = 17
SET NIONTOT = 34
```

If anything looks unexpected — wrong number of lipids, wrong box size, way more or fewer ions than expected — go back through the CHARMM-GUI workflow and find where the mistake came in. The intermediate files document each step, which makes debugging easier.

You can also load `step5_assembly.psf` and `step5_assembly.pdb` into VMD (which we installed in Part 1) for a visual sanity check. We'll cover the visualization workflow in detail in [Part 4]({{ '/resources/membrane-md/' | relative_url }}). For now, a quick `vmd step5_assembly.psf step5_assembly.pdb` from the command line will open VMD with your system loaded — even just rotating the view in OpenGL is enough to confirm the bilayer looks right.

---

## What you have now

After completing this part, you should have:

- A CHARMM-GUI account with at least one completed bilayer build job
- A downloaded and unpacked `charmm-gui-*` folder containing all the simulation files
- A 200-lipid pure DOPC bilayer at 30°C with 150 mM NaCl, fully solvated and ready to simulate
- 48,412 atoms total, in a ~83 × 83 × 75 Å rectangular box

The next part of the series covers running the actual simulation in NAMD: equilibration, common parameter file gotchas, and chunked production runs.

---

## Troubleshooting

**"Show the system info" button doesn't update the panel**
This happened in our first attempt — clicking the button seemed to do nothing. The fix turned out to be entering an initial guess in the "Length of X and Y" field (around 84 Å for a 100/leaflet DOPC system). With "Numbers of lipid components" mode selected, this becomes a non-issue, but with "Ratios" mode you need an initial size guess for the calculation to start.

**Server timeouts during long build steps**
CHARMM-GUI server steps can occasionally time out under heavy load. If a step fails, you can usually use the **Job Retriever** with your Job ID (which is shown at the top-right of every page) to resume from the failed step. Bookmarks of intermediate pages also work — CHARMM-GUI persists your job state on the server.

**The downloaded tarball is much smaller than expected**
A complete tarball is 50–100 MB. If yours is much smaller (a few MB), it may be that NAMD output wasn't checked in Step 8. Re-run that step with NAMD checked.

**"View structure" link doesn't show anything**
This is occasionally a browser issue with CHARMM-GUI's embedded JSmol viewer. Try a different browser (Chrome and Firefox are most reliable for CHARMM-GUI) or skip this preview — it's only a sanity check, not required for the build.

**Forgotten Job ID**
If you lose your Job ID and want to revisit a job: log into CHARMM-GUI, click your username in the top-right, and select **Job Retriever** or **My Jobs**. You'll see a list of your completed jobs with their IDs, dates, and descriptions.

---

*Next: Part 3 — Running your first simulation in NAMD (coming soon)*

*Previous: [Part 1 — Setting up your Mac for MD simulations]({{ '/resources/membrane-md/01-mac-setup/' | relative_url }})*

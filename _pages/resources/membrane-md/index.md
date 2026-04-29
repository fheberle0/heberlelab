---
layout: page
title: Getting Started with Membrane MD
permalink: /resources/membrane-md/
nav: false
---

This is a multi-part tutorial series on running all-atom molecular dynamics (MD) simulations of lipid bilayers. It's written for someone who has never run an MD simulation before, and assumes only a basic level of comfort with the command line — enough to open a terminal, run commands, and edit text files. We'll cover everything else from there.

The simulations we'll set up use the CHARMM36 force field for lipids, are built with [CHARMM-GUI](https://www.charmm-gui.org/), and run in [NAMD 3](https://www.ks.uiuc.edu/Research/namd/). Visualization and analysis are done in [VMD](https://www.ks.uiuc.edu/Research/vmd/). All of these tools are freely available for academic use. The instructions are written for an Apple Silicon Mac (M1 or later); the workflow is similar on Intel Macs and Linux machines, but specific commands and screenshots may differ.

A "test" bilayer of pure 1,2-dioleoyl-sn-glycero-3-phosphocholine (DOPC) is used as the example throughout the series. DOPC is one of the most-studied bilayers in the literature, with well-established experimental values for area per lipid (~67 Å²) and bilayer thickness (~38 Å) at 30°C. This makes it an ideal first system because you can directly check that your simulation reproduces these values — a powerful sanity check that the workflow is set up correctly.

---

## Series contents

**[Part 1: Setting up your Mac for MD simulations →]({{ '/resources/membrane-md/01-mac-setup/' | relative_url }})**
A gentle introduction to the command line, followed by step-by-step installation of NAMD and VMD on an Apple Silicon Mac. By the end you'll have both programs working and ready to run simulations.

**[Part 2: Building a lipid bilayer with CHARMM-GUI →]({{ '/resources/membrane-md/02-charmm-gui-bilayer/' | relative_url }})**
Walking through the CHARMM-GUI Membrane Builder interface to construct a fully-hydrated DOPC bilayer with explicit ions. We'll discuss the choices CHARMM-GUI offers and explain what each one does.

**[Part 3: Running your first simulation in NAMD →]({{ '/resources/membrane-md/03-running-namd/' | relative_url }})**
Equilibrating and running a production MD trajectory. Covers the multi-step CHARMM-GUI equilibration protocol, common gotchas with parameter files, and how to set up a simple launcher script for chunked production runs.

**Part 4: Visualization and analysis in VMD** *(coming soon)*
Loading a simulation in VMD, creating useful representations, rendering high-quality images, and running basic analyses (area per lipid, bilayer thickness) using the Tk Console.

---

## What you'll need

A reasonably modern Mac. The instructions are written specifically for Apple Silicon (M1 or later), which is what we use in our lab. An Intel Mac will work too, with minor adjustments at the install steps. You'll also need free accounts at [CHARMM-GUI](https://www.charmm-gui.org/) and the [NAMD download site](https://www.ks.uiuc.edu/Development/Download/download.cgi?PackageName=NAMD), both of which require academic affiliation.

You don't need a GPU. NAMD on Apple Silicon currently runs CPU-only, but a small bilayer (200 lipids) will simulate at roughly 5–10 ns/day on a recent Mac Studio — fast enough for a first project, though slower than a CUDA-equipped Linux box. We'll discuss performance tradeoffs in Part 3.

---

## A note on conventions

Throughout the series, **commands you should type in the terminal** appear in code blocks like this:

```
cd ~/simulations/dopc_test
```

When the output of a command is shown, it will be in a separate code block following the command.

When we describe a click path through a graphical menu, we'll write it as **Menu → Submenu → Item**.

Files and directories you'll create are referred to using the standard Unix path conventions — e.g., `~/software/` means a folder called "software" inside your home directory.

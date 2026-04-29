---
layout: page
title: Resources
permalink: /resources/
nav: true
nav_order: 4
---

This page collects tools, tutorials, and other resources we've developed in the course of our research that may be useful to the broader membrane biophysics community. Some are interactive web-based calculators, some are step-by-step guides for techniques we use in the lab, and some are code repositories with analysis pipelines we've built. Everything here is free to use, and we welcome feedback.

---

## Tutorials

**[Getting Started with Membrane MD →]({{ '/resources/membrane-md/' | relative_url }})**
A multi-part series on running all-atom molecular dynamics simulations of lipid bilayers, written for newcomers to the field. Part 1 covers software installation on a Mac. Part 2 walks through building a bilayer in CHARMM-GUI. Part 3 covers running the simulation in NAMD. Part 4 covers visualization and analysis in VMD. Each part is self-contained and can be followed without prior MD experience, though some familiarity with the command line is helpful.

---

## Interactive tools

**[Asymmetric Bilayer Phase Diagram →]({{ '/resources/phase-diagram/' | relative_url }})**
Interactive phase diagram calculator for asymmetric lipid bilayers based on the Bragg–Williams mean-field model. Adjust the Flory–Huggins interaction parameter χ and the interleaflet coupling Λ to see registered and anti-registered coexistence regions, tielines, and consolute points.

**[FRET Analyzer →]({{ '/resources/fret-analyzer/' | relative_url }})**
Quantify nanoscopic miscibility transitions in lipid bilayers from FRET vs. temperature data. Upload an Excel file with fluorescence intensity data and the tool fits uniform-mixing and phase-separation models, using AICc model selection to determine whether a transition exists.

**[Monte Carlo Lattice Simulator →]({{ '/resources/mc-simulator/' | relative_url }})**
Interactive 2D Monte Carlo simulation of lipid mixing on a triangular lattice with periodic boundary conditions and nearest-neighbor pairwise interactions. A binary A/B mixture evolves via Kawasaki exchange dynamics with the Metropolis acceptance criterion.

---

## Data and code

This section is under development. Repositories with analysis code, datasets, and processing pipelines for our published work will be linked here as they are organized for public release. For specific requests in the meantime, please contact us directly.

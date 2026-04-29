---
layout: page
title: "Part 1: Setting up your Mac for MD simulations"
permalink: /resources/membrane-md/01-mac-setup/
nav: false
---

*Part 1 of the [Getting Started with Membrane MD]({{ '/resources/membrane-md/' | relative_url }}) series. Last updated: April 2026. Tested on a Mac Studio with Apple M1 Ultra running macOS Tahoe 26.3, with NAMD 3.0.2 and VMD 1.9.4a57.*

This first part of the series covers everything you need to do *before* running any simulations: getting comfortable with the macOS terminal, organizing where your files will live, and installing the two pieces of software we'll use throughout the series — NAMD (the simulation engine) and VMD (for visualization and analysis). Both programs are free for academic use.

If you've used a terminal before and just want the install steps, skip ahead to "Installing NAMD" and "Installing VMD". Otherwise, read straight through — the early sections will save you headaches later.

---

## A short tour of the macOS terminal

The terminal is where almost everything in MD simulation happens — running simulations, organizing files, editing scripts, checking results. Most macOS users rarely open it, but for our purposes you'll need to be comfortable with a few basic commands. Don't worry: the things you'll need are simple, and they become natural with a few hours of use.

### Opening the terminal

Press **Cmd+Space** to open Spotlight, type "Terminal", and press **Enter**. A window opens with a text prompt that looks something like:

```
yourname@yourmac ~ %
```

The `%` (or `$` on some systems) is the **prompt**: it's the terminal's way of saying "I'm ready for a command." Everything before it tells you who you are and where you are. The `~` is shorthand for your **home directory** — a folder named after your username that lives at `/Users/yourname`. We'll use `~` a lot.

### Checking which shell you're using

The terminal runs a program called a **shell** that interprets your commands. Modern macOS uses **zsh** (Z shell) by default. To confirm which shell you have, type:

```
echo $SHELL
```

and press Enter. You should see something like `/bin/zsh`. If it says `/bin/bash` instead, the commands in this tutorial will still work, but a few configuration steps will be slightly different. We'll flag those when they come up.

### Five commands you'll use constantly

These five cover most of what you'll do in the terminal for these tutorials.

**`pwd`** — print working directory. Tells you which folder you're currently "inside."

```
pwd
```

You'll see something like `/Users/yourname`.

**`ls`** — list files. Shows the contents of the current folder.

```
ls
```

You'll see your familiar folders: Desktop, Documents, Downloads, etc. Add `-lh` to see file sizes and timestamps in human-readable form:

```
ls -lh
```

**`cd`** — change directory. Move into a different folder.

```
cd Documents
```

Now `pwd` will say `/Users/yourname/Documents`. To go back to your home directory, type `cd` with no arguments, or `cd ~`.

**`mkdir`** — make directory. Create a new folder.

```
mkdir simulations
```

Creates a folder named `simulations` inside the current directory.

**`cat`** — print file contents to the screen. Useful for quickly inspecting text files.

```
cat my_file.txt
```

That's it for the basics. We'll introduce a few more commands as we go (`cp` for copying files, `mv` for moving/renaming, and a couple of others), but these five will get you most of the way.

### A philosophical note on the terminal

The terminal can feel intimidating because, unlike a graphical interface, there's no visible "Are you sure?" before something happens. If you tell it to delete a file, it deletes the file — instantly, with no recycle bin. This makes it powerful but unforgiving.

Our recommended habit: when in doubt, run `pwd` and `ls` to see where you are and what's around you, *before* running anything destructive. We'll never ask you to run a destructive command in this series without explaining what it does, but adopting this habit will protect you from typos and accidents.

---

## Organizing your files

Before installing anything, let's set up a clean folder structure. The principle: keep installed software in one place, keep simulation files in another, and keep your "important" stuff (configs, scripts, results worth saving) somewhere that's backed up.

### Why backup matters

MD simulations produce a lot of intermediate data — multi-gigabyte trajectory files, restart files, log files. Most of this isn't worth backing up: it's regenerable and ephemeral. But the configuration scripts, your custom analysis code, and the final analyzed data definitely *are* worth backing up. So we suggest splitting things into:

- **Software** lives on your local disk, never in cloud-synced folders
- **Active simulation runs** also stay on your local disk for performance
- **Inputs, scripts, notes, and final results** go into a cloud-synced folder (Dropbox, iCloud, Google Drive, etc.)

The reason for not running simulations from a cloud-synced folder is twofold: cloud sync continuously reads and writes files, which can interfere with NAMD writing trajectory data; and trajectory files are huge, which would burn through your sync quota. Keep them local.

### Creating the folders

Open Terminal and create two folders:

```
mkdir -p ~/software
mkdir -p ~/simulations
```

The `-p` flag means "make any parent directories that don't exist yet." Then verify:

```
ls ~
```

You should see `software` and `simulations` listed alongside your other home folders.

For the cloud-synced folder, use whatever you already have set up. In our lab, we use Dropbox under a path like `~/Dropbox/HeberleLabUTK/data/MD-sims/`. Adjust to match your own organization.

---

## Installing NAMD

NAMD is the simulation engine — the program that actually computes the time evolution of all the atoms in your system. The current version is **NAMD 3.0.2** (released August 2025), and there's a native Apple Silicon build that runs efficiently on M-series Macs.

### A note on GPU acceleration

NAMD 3's flagship feature is GPU-resident mode, which gives massive speedups by running everything on the GPU. The catch: it only works with NVIDIA GPUs (via CUDA). NAMD does not currently support Apple Silicon GPUs (which use the Metal API), so on a Mac you'll be running CPU-only. This is slower than a Linux box with a CUDA-capable GPU, but a modern Mac Studio with the multicore CPU build can still get respectable performance — roughly 5–10 ns/day for a small bilayer like the one we'll build later.

If you need maximum throughput, you'll want a Linux machine with an NVIDIA GPU. If you're learning, want to do small-to-medium projects, or value the convenience of having simulations run locally on your work machine, NAMD on Apple Silicon is plenty.

### Step 1: Download NAMD

In your web browser, go to [the NAMD download page](https://www.ks.uiuc.edu/Development/Download/download.cgi?PackageName=NAMD).

Find the line for **MacOS-universal-multicore (Apple silicon and Intel-based)** and click the link for **Version 3.0.2** (do *not* choose "Nightly Build" — that's for active developers and may have unfinished features).

You'll be taken through a registration page if you haven't downloaded NAMD before. Fill in your name, email, and academic affiliation, and accept the non-commercial use agreement. Registration is fast and the download starts automatically afterward.

The file you download will be named something like `NAMD_3.0.2_MacOS-universal-multicore.tar.gz` and will land in your `~/Downloads/` folder.

### Step 2: Move the archive into ~/software/

Back in Terminal:

```
cd ~/software
mv ~/Downloads/NAMD_3.0.2_MacOS-universal-multicore.tar.gz .
```

The `mv` command moves a file. The `.` at the end means "to the current directory" (which is `~/software/` because we just `cd`'d into it).

### Step 3: Unpack the archive

```
tar -xzf NAMD_3.0.2_MacOS-universal-multicore.tar.gz
```

The `tar` command unpacks compressed archives. The `-xzf` flags mean "extract, gzip-compressed, file (next argument)." It produces a folder called `NAMD_3.0.2_MacOS-universal-multicore/` containing the NAMD program and its libraries.

Confirm:

```
ls
```

You should now see both the original `.tar.gz` file and the new folder.

### Step 4: Add NAMD to your PATH

The PATH is an environment variable that tells your shell which folders to search when you type a command. We need to add the NAMD folder to your PATH so you can run `namd3` from anywhere on your system.

For zsh (the macOS default), the configuration file is `~/.zshrc`. Add a line to it:

```
echo 'export PATH="$HOME/software/NAMD_3.0.2_MacOS-universal-multicore:$PATH"' >> ~/.zshrc
```

A few notes about this command:

- `>>` appends to the file (a single `>` would *overwrite* the file, which would be bad)
- The single quotes prevent the shell from expanding `$HOME` and `$PATH` *now* — we want them to be expanded later, every time the shell starts up
- The line we're adding tells zsh to look in the NAMD folder *first* when finding commands

Reload your shell config so the change takes effect in this terminal:

```
source ~/.zshrc
```

(Alternatively, close and reopen Terminal — same effect.)

If you're using bash instead of zsh, the file to edit is `~/.bash_profile` instead of `~/.zshrc`.

### Step 5: Test that NAMD runs

```
which namd3
```

Should print the full path to the NAMD executable, something like `/Users/yourname/software/NAMD_3.0.2_MacOS-universal-multicore/namd3`.

```
namd3 --version
```

Should print NAMD's version banner. If it instead pops up a macOS security warning ("namd3 cannot be opened because Apple cannot check it for malicious software"), see the next section.

### Handling the macOS Gatekeeper warning

The first time you run NAMD, macOS may block it because the binary is unsigned. This is normal — NAMD's developers don't pay Apple's developer fee to code-sign their builds.

To allow it:

1. Click **Done** on the warning dialog (NOT "Move to Trash")
2. Open **System Settings → Privacy & Security**
3. Scroll down to the **Security** section
4. You should see a message like *"namd3 was blocked to protect your Mac"* with an **Open Anyway** button
5. Click **Open Anyway**, authenticate with Touch ID or password
6. A second confirmation dialog appears — click **Open Anyway** again
7. Return to Terminal and re-run `namd3 --version`

This approval is permanent. You shouldn't need to repeat it for `namd3` again.

You may need to repeat the same dance for a few helper binaries the first time NAMD actually runs a simulation, but those situations will be flagged by similar warnings when they occur.

### A first sanity check

Run NAMD with no arguments (or with a flag it doesn't recognize) just to confirm the binary works end-to-end:

```
namd3 --version
```

You should see output like:

```
NAMD 3.0.2 for MacOS-ARM64-multicore
```

If it says `MacOS-ARM64-multicore`, you have the native Apple Silicon build (good — much faster than running an x86_64 binary through Rosetta translation). If you see `MacOS-x86_64-multicore`, you have the Intel build, which will work but won't be as fast on Apple Silicon.

---

## Installing VMD

VMD (Visual Molecular Dynamics) is the visualization and analysis tool we'll use throughout the series. Like NAMD, it's free for academic use.

A small wrinkle: the most stable Apple Silicon build of VMD is technically labeled as an "alpha" release (version 1.9.4a57), even though it's been the de-facto standard for years and is what everyone in the field uses. There's also a newer 2.0 alpha, but it has a different interface and isn't yet broadly adopted, and existing tutorials reference 1.9.4. We'll install **1.9.4a57** for compatibility.

### Step 1: Download VMD

Go to [https://www.ks.uiuc.edu/Research/vmd/alpha/](https://www.ks.uiuc.edu/Research/vmd/alpha/).

Look for **VMD 1.9.4a57 (signed) for Apple Silicon** — typically distributed as `vmd194a57-macarm64-signed.dmg`. Download it. (Like NAMD, this requires a quick free registration.)

The "signed" version is important — Apple has signed this binary, so you won't have to deal with the Gatekeeper dance you did with NAMD.

### Step 2: Install

Once the `.dmg` file finishes downloading, double-click it. A Finder window opens showing a VMD icon and a shortcut to your Applications folder. Drag the VMD icon into Applications. Done.

You can eject the disk image now: in the Finder sidebar, find the mounted "VMD" volume and click the eject icon next to it.

### Step 3: Rename (optional)

The app installs with a long name like `VMD 1.9.4a57-arm64-Rev12`. If you'd like to rename it to something cleaner, find it in Applications, click once on it, press **Return** to make the name editable, type `VMD`, and press Return again. macOS apps are bundles, not single files — renaming the bundle doesn't break anything inside.

### Step 4: Add a Terminal alias

VMD is primarily a graphical program, but it's useful to be able to launch it from Terminal too — especially when you want to load specific files at startup.

For zsh:

```
echo 'alias vmd="/Applications/VMD.app/Contents/vmd/vmd_MACOSXARM64"' >> ~/.zshrc
source ~/.zshrc
```

(If you didn't rename the app, replace `VMD.app` with whatever the actual app name is. You can find out with `ls /Applications/ | grep -i vmd`.)

### Step 5: Test

```
vmd
```

Three windows should open:

- **VMD Main** — the control panel with all the menus
- **OpenGL Display** — a black window (currently empty) where molecules will be rendered
- **VMD Console** — where text output and Tcl commands appear

If all three windows appear, VMD is installed correctly. Quit it (Cmd+Q in the Main window) for now; we'll come back to it in Part 4 of the series.

---

## What you have now

After completing this part, you should have:

- A working terminal you can navigate
- A `~/software/` folder containing NAMD 3.0.2
- VMD 1.9.4a57 in your Applications folder
- A `~/simulations/` folder ready to hold your simulations
- A cloud-synced folder somewhere (Dropbox/iCloud/etc.) for backing up inputs and results
- Both `namd3` and `vmd` runnable from any Terminal location

That's a complete software stack for membrane MD on a Mac. The next parts of the series will use this setup to build, run, and analyze a DOPC bilayer simulation.

---

## Troubleshooting

**`namd3: command not found` when running NAMD**
Your PATH change didn't take effect. Either close and reopen Terminal, or run `source ~/.zshrc`. If it still doesn't work, check that the line you added to `~/.zshrc` references the actual NAMD folder name on your system (run `ls ~/software/` to confirm).

**Gatekeeper repeatedly blocks NAMD even after "Open Anyway"**
On some macOS versions, the approval doesn't always stick on the first try. Try running `namd3 --version` from Terminal again immediately after clicking "Open Anyway" — if it still fails, repeat the System Settings → Privacy & Security flow once more. If that doesn't work, you can manually remove the quarantine attribute with `xattr -d com.apple.quarantine ~/software/NAMD_*/namd3`.

**VMD opens but the OpenGL window is blank or shows graphical glitches**
Make sure you have the Apple Silicon build (filename includes `macarm64`), not the Intel build. The Intel build runs through Rosetta and can have rendering issues. You can verify by going to **Help → About** in VMD Main — it should show "MacOS-ARM" in the version string.

**The terminal window has weird formatting or autocompletes things you didn't type**
Some users have aggressive autocomplete or AI-shell plugins installed (e.g., Warp, Fig). These can occasionally interfere with copy-pasted commands. If you hit unexplained errors, try running commands in the standard macOS Terminal app to rule this out.

---

*Next: [Part 2 — Building a lipid bilayer with CHARMM-GUI →]({{ '/resources/membrane-md/' | relative_url }})* (coming soon)

---
layout: page
title: "Part 3: Running your first simulation in NAMD"
permalink: /resources/membrane-md/03-running-namd/
nav: false
---

*Part 3 of the [Getting Started with Membrane MD]({{ '/resources/membrane-md/' | relative_url }}) series. Last updated: April 2026. Tested with NAMD 3.0.2 on Apple Silicon (M1 Ultra, 20 CPU cores).*

In [Part 2]({{ '/resources/membrane-md/02-charmm-gui-bilayer/' | relative_url }}) you used CHARMM-GUI to build a fully-prepared DOPC bilayer system. Now we'll actually run the simulation: minimization, multi-step equilibration with relaxing restraints, and chunked production. By the end of this tutorial you'll have a real MD trajectory you can analyze.

This is the longest tutorial of the series because there's the most to cover — and because CHARMM-GUI's NAMD output requires some patching before it runs cleanly on a fresh install. Don't worry: we'll explain *why* each fix is needed so you'll be equipped to debug similar issues on future systems.

---

## What we're going to do

The simulation runs in three phases:

1. **Minimization** (a few minutes): adjust atomic positions to relieve any clashes left over from system building
2. **Equilibration** (~6 hours wall time): six chained simulation segments with gradually relaxing restraints, letting the bilayer relax from CHARMM-GUI's geometric guess to a properly equilibrated state
3. **Production** (~14 hours wall time for 10 ns): the actual data-generating run, broken into 1-ns chunks for safety

CHARMM-GUI generates input scripts for all three phases. We'll patch them, build a launcher script to chain segments together, and run the whole pipeline.

---

## Step 1: Set up your simulation directory

Following the principle from Part 1 (cloud-synced storage for inputs and results, local disk for active simulations), we'll work from a local folder. The CHARMM-GUI tarball stays in your Dropbox folder as a clean reference; we copy what's needed into a working folder on local disk.

```
mkdir -p ~/simulations/dopc_test
cd ~/simulations/dopc_test
```

Copy the NAMD-specific files from your unpacked CHARMM-GUI output:

```
cp -r ~/Dropbox/path/to/charmm-gui-XXXXXXXXX/namd/* .
cp -r ~/Dropbox/path/to/charmm-gui-XXXXXXXXX/toppar .
cp ~/Dropbox/path/to/charmm-gui-XXXXXXXXX/step5_assembly.str .
```

Adjust paths to match where your unpacked tarball lives.

A note on what just got copied:

- The `namd/` subfolder of the CHARMM-GUI output contains everything specific to NAMD: the structure files (`.psf`, `.pdb`, `.crd`), the equilibration and production scripts (`.inp`), and a few helper files
- The `toppar/` folder contains the CHARMM force field parameter files (the actual force constants and atom type definitions)
- `step5_assembly.str` is the system metadata file with box dimensions and lipid counts; one of the equilibration scripts looks for it

Verify:

```
ls
```

You should see structure files (`step5_input.psf`, `.pdb`, `.crd`), equilibration scripts (`step6.1_equilibration.inp` through `step6.6_equilibration.inp`), the production script (`step7_production.inp`), the `toppar/` folder, and some helper files.

---

## Step 2: Patch the parameter file list

Now for the first big gotcha. CHARMM-GUI's NAMD scripts try to load every parameter file in the `toppar/` collection — about 50 files covering proteins, nucleic acids, carbohydrates, lipids, ions, fluorophore labels, and many other systems. Most of these are irrelevant for a pure DOPC bilayer, and some of them contain CHARMM scripting syntax (variable assignments, conditionals) that **NAMD's parser cannot handle**.

If you try to run the equilibration as-is, you'll get errors like:

```
FATAL ERROR: UNKNOWN PARAMETER IN CHARMM PARAMETER FILE toppar/toppar_water_ions.str
LINE=*set nat ?NATC*
```

These aren't NAMD's fault — the toppar files are designed to be read by the CHARMM program (which understands its own scripting language), and NAMD only knows how to parse parameter declarations, not control flow.

The cleanest fix is to **prune the parameter list to only the files NAMD actually needs**. For a pure DOPC + water + NaCl system, that's just six files:

- `par_all36m_prot.prm` (loaded but not used; clean syntax)
- `par_all36_na.prm` (loaded but not used; clean syntax)
- `par_all36_carb.prm` (loaded but not used; clean syntax)
- `par_all36_lipid.prm` (DOPC parameters)
- `par_all36_cgenff.prm` (loaded but not used; clean syntax)
- `toppar_water_ions.str` (TIP3P water and ion parameters)

Apply this pruning to all seven NAMD scripts (six equilibration + one production):

```
for f in step6.1_equilibration.inp step6.2_equilibration.inp step6.3_equilibration.inp step6.4_equilibration.inp step6.5_equilibration.inp step6.6_equilibration.inp step7_production.inp; do
  sed -i '' 's|^parameters|#parameters|' "$f"
  sed -i '' \
    -e 's|^#parameters\(.*par_all36m_prot.prm\)|parameters\1|' \
    -e 's|^#parameters\(.*par_all36_na.prm\)|parameters\1|' \
    -e 's|^#parameters\(.*par_all36_carb.prm\)|parameters\1|' \
    -e 's|^#parameters\(.*par_all36_lipid.prm\)|parameters\1|' \
    -e 's|^#parameters\(.*par_all36_cgenff.prm\)|parameters\1|' \
    -e 's|^#parameters\(.*toppar_water_ions.str\)|parameters\1|' \
    "$f"
done
```

This loop is dense — let's break it down. For each `.inp` file:

1. **First sed:** comment out *every* `parameters` line by prepending `#`
2. **Second sed:** un-comment the six lines we actually need (using regex captures to preserve the file path)

The end result: only six `parameters` lines remain active in each script.

Verify:

```
for f in step6.1_equilibration.inp step6.2_equilibration.inp step6.3_equilibration.inp step6.4_equilibration.inp step6.5_equilibration.inp step6.6_equilibration.inp step7_production.inp; do
  echo "=== $f ==="
  grep -c "^parameters" "$f"
done
```

Each file should report **6**.

---

## Step 3: Patch one final scripting issue in toppar_water_ions.str

The water/ions parameter file we kept *also* contains a few CHARMM scripting directives (`set`, `if`, `WRNLEV`, `BOMLEV`) that NAMD chokes on. We need to comment them out within that file. Since this is a copy of the toppar file in our working directory (not the original in Dropbox), it's safe to edit:

```
sed -i '' '/^set /s|^|!|' toppar/*.str
sed -i '' -E '/^(set|if|else|endif|goto|label|return|bomlev|wrnlev|prnlev) /s|^|!|' toppar/*.str
sed -i '' '/^WRNLEV /s|^|!|' toppar/toppar_water_ions.str
sed -i '' '/^BOMLEV /s|^|!|' toppar/toppar_water_ions.str
```

These four sed commands comment out (with `!`, the CHARMM/NAMD comment character) any line that starts with a CHARMM scripting keyword. The first two are case-sensitive lowercase patterns; the third and fourth catch the uppercase `WRNLEV` and `BOMLEV` directives we missed in the lowercase patterns.

Verify nothing's left:

```
grep -nE "^(WRNLEV|BOMLEV|set |if ) " toppar/*.str
```

Should return nothing (all matching lines now start with `!`).

---

## Step 4: Fix the path in step6.1

One more small fix. The first equilibration script reads metadata from `step5_assembly.str` using a relative path that assumes a specific directory structure:

```
exec tr "\[:upper:\]" "\[:lower:\]" < ../step5_assembly.str | sed -e "s/ =//g" > step5_input.str
```

The `../step5_assembly.str` looks one directory up — but in our setup, we copied `step5_assembly.str` into the current directory. Fix the path:

```
sed -i '' 's|< \.\./step5_assembly\.str|< step5_assembly.str|' step6.1_equilibration.inp
```

---

## Step 5: Run a quick test

Before committing to the full ~6 hour equilibration, verify the pipeline works with a short test run.

Make a copy of step6.1 with reduced step counts:

```
cp step6.1_equilibration.inp test_run.inp
sed -i '' 's|^minimize[[:space:]]*[0-9]*|minimize         100|' test_run.inp
sed -i '' 's|^run[[:space:]]*[0-9]*|run              500|' test_run.inp
sed -i '' 's|set outputname.*step6.1_equilibration|set outputname        test_run|' test_run.inp
```

This reduces the minimization from 10,000 steps to 100, the dynamics from 125,000 steps to 500, and changes the output name so it doesn't collide with the real step 6.1 later.

Now run NAMD:

```
namd3 +p8 test_run.inp > test_run.log 2>&1
```

A note on the `+p8` argument: this tells NAMD to use 8 CPU threads. On Apple Silicon Macs, NAMD's multicore performance often peaks around 8 threads even on machines with more cores (like the M1 Ultra's 20). Higher thread counts can sometimes cause crashes or actually slow things down. Start with 8; you can experiment with other values once everything is working.

The test should take about 30 seconds. When the prompt returns, check the log:

```
tail -10 test_run.log
```

Look for **`End of program`** and **`WallClock:`** near the bottom. If you see those plus an `ENERGY:` line a few lines above, the test passed.

If you see `FATAL ERROR` instead, the test failed. Read the error message and revisit Steps 2–4: the most common cause is a parameter file we missed pruning.

---

## Step 6: Build the equilibration launcher

Now that the pipeline works, we need to chain the six equilibration segments together. Each segment reads from the previous one's output, so they have to run in order. We'll use a shell script to automate this.

Create `run_equilibration.sh` in your simulations folder:

```
cat > run_equilibration.sh << 'EOF'
#!/bin/zsh
# Run NAMD equilibration steps 6.1 through 6.6 in sequence

NCORES=8

for i in 1 2 3 4 5 6; do
  echo "=========================================="
  echo "Starting step6.${i}_equilibration at $(date)"
  echo "=========================================="
  namd3 +p${NCORES} step6.${i}_equilibration.inp > step6.${i}_equilibration.log 2>&1
  EXIT_CODE=$?
  
  if [ $EXIT_CODE -ne 0 ]; then
    echo "ERROR: namd3 exited with code $EXIT_CODE on step6.${i}"
    echo "Check step6.${i}_equilibration.log for details"
    exit 1
  fi
  
  if ! tail -5 step6.${i}_equilibration.log | grep -q "End of program"; then
    echo "ERROR: step6.${i} did not finish cleanly (no 'End of program' marker)"
    echo "Check step6.${i}_equilibration.log for details"
    exit 1
  fi
  
  echo "Finished step6.${i} at $(date)"
done

echo "=========================================="
echo "All equilibration steps completed successfully!"
echo "=========================================="
EOF
chmod +x run_equilibration.sh
```

What this script does:

- Loops through steps 6.1 through 6.6
- For each step, runs NAMD redirecting all output to a per-step log file
- After each NAMD invocation, checks both the exit code and looks for "End of program" in the log to confirm clean completion
- Halts immediately if any step fails, with a clear error message

The `chmod +x` at the end makes the script executable.

---

## Step 7: Launch the full equilibration

Equilibration takes about 6 hours wall-clock for our DOPC system at 8 CPU threads. To leave it running while you do other things — or while you sleep — we want it to survive Terminal closure and prevent your Mac from sleeping.

**Prevent your Mac from sleeping:**

```
caffeinate -i &
```

`caffeinate -i` is a built-in macOS command that prevents idle sleep. The `&` runs it in the background. Display sleep is still allowed (you can lock your screen and the simulation continues), but the CPU will not idle.

**Launch the equilibration detached from Terminal:**

```
nohup ./run_equilibration.sh > equilibration_master.log 2>&1 &
```

`nohup` ("no hangup") protects the process from Terminal closure. The `&` runs it in the background. All output goes to `equilibration_master.log`.

You can now close Terminal entirely; the simulation will keep running. To check progress later, open a new Terminal window from anywhere:

```
tail -f ~/simulations/dopc_test/equilibration_master.log
```

You'll see "Starting step6.X" / "Finished step6.X" messages as the launcher progresses through the six steps. (Press Ctrl+C to exit `tail -f` — this only stops the live monitoring, not NAMD itself.)

You can also check NAMD itself is alive:

```
ps aux | grep namd3 | grep -v grep
```

You should see a `namd3` process with high CPU usage (around 800% on a multi-core build, since CPU usage is reported per-core).

---

## Step 8: What to expect during equilibration

Equilibration runs six segments with progressively relaxing restraints:

| Step | Timestep | Steps | Sim time | Wall time |
|---|---|---|---|---|
| 6.1 | 1 fs | 125,000 | 125 ps | ~40 min |
| 6.2 | 1 fs | 125,000 | 125 ps | ~40 min |
| 6.3 | 1 fs | 125,000 | 125 ps | ~40 min |
| 6.4 | 2 fs | 250,000 | 500 ps | ~85 min |
| 6.5 | 2 fs | 250,000 | 500 ps | ~85 min |
| 6.6 | 2 fs | 250,000 | 500 ps | ~85 min |

Total simulated time is ~1.875 ns; total wall time is ~6 hours. Real performance varies with machine load — if you compile something or run a heavy browser tab while NAMD is going, expect things to slow down.

A key thing to know: **steps 6.1 and 6.2 don't yet enable pressure coupling.** The Langevin piston (which lets the simulation box flex to maintain ~1 atm pressure) only kicks in starting at step 6.3. So during 6.1 and 6.2, your bilayer's area per lipid will be exactly fixed at CHARMM-GUI's initial guess; only after step 6.3 will it begin relaxing toward the equilibrium value.

If you analyze area per lipid vs. time during equilibration (we'll show how in Part 4), you'll see APL flat at 69.7 Å² for the first ~250 ps, then dropping during step 6.3 and settling around 66 Å² for the remainder. That's the expected and welcome sign of a successful equilibration: the bilayer self-corrects to its preferred state.

---

## Step 9: Set up production

When the equilibration finishes (look for "All equilibration steps completed successfully!" in `equilibration_master.log`), you're ready to launch production.

The production phase is where you generate trajectory data for analysis. Unlike equilibration, production has no restraints and runs at the equilibrated state — so the data here is the "real" simulation. CHARMM-GUI's `step7_production.inp` is configured to run **1 nanosecond per launch**. To get a longer trajectory, you call NAMD multiple times, with each invocation continuing from the previous one. This pattern is called **chunking**.

Why chunked? Several reasons:

- If your machine crashes mid-run, you only lose at most one chunk's worth of data (not your entire production run)
- You can analyze segments independently before committing to a longer run
- Output files are smaller and easier to manage
- You can decide to extend or stop the production at any chunk boundary

The chunking pattern uses the same kind of file-chaining as equilibration: each chunk reads the previous chunk's `.coor`, `.vel`, and `.xsc` files as its starting point.

Build a production launcher that runs 10 chunks (= 10 ns of total simulation):

```
cat > run_production.sh << 'EOF'
#!/bin/zsh
# Run 10 chunks of NAMD production, 1 ns each (10 ns total)

NCORES=8
NCHUNKS=10

for i in $(seq 1 $NCHUNKS); do
  if [ $i -eq 1 ]; then
    PREV="step6.6_equilibration"
  else
    PREV="step7_production_$((i-1))"
  fi
  CURR="step7_production_${i}"
  INP="${CURR}.inp"
  LOG="${CURR}.log"
  
  # Generate this chunk's input file by editing the template
  sed -e "s|set inputname.*step6.6_equilibration|set inputname           ${PREV}|" \
      -e "s|outputName              step7_production|outputName              ${CURR}|" \
      step7_production.inp > "$INP"
  
  echo "=========================================="
  echo "Starting chunk ${i}/${NCHUNKS} (${CURR}) at $(date)"
  echo "Reads from: ${PREV}"
  echo "=========================================="
  
  namd3 +p${NCORES} "$INP" > "$LOG" 2>&1
  EXIT_CODE=$?
  
  if [ $EXIT_CODE -ne 0 ]; then
    echo "ERROR: namd3 exited with code $EXIT_CODE on chunk ${i}"
    exit 1
  fi
  
  if ! tail -5 "$LOG" | grep -q "End of program"; then
    echo "ERROR: chunk ${i} did not finish cleanly"
    exit 1
  fi
  
  echo "Finished chunk ${i} at $(date)"
done

echo "=========================================="
echo "All ${NCHUNKS} production chunks completed successfully!"
echo "=========================================="
EOF
chmod +x run_production.sh
```

The script's design:

- For each chunk, it generates a new `.inp` file by `sed`-ing the template with the right input/output names
- Chunk 1 reads from `step6.6_equilibration.{coor,vel,xsc}` (the equilibrated state)
- Chunk N (for N > 1) reads from `step7_production_(N-1).{coor,vel,xsc}` (the previous chunk's output)
- Each chunk gets its own log file
- Same error-checking as the equilibration launcher

To launch production:

```
caffeinate -i &
nohup ./run_production.sh > production_master.log 2>&1 &
```

10 chunks × ~85 minutes/chunk ≈ **14 hours wall-clock** for 10 ns of simulation.

---

## Step 10: Monitoring and managing the run

Once production is launched, you can use these commands at any time to check on progress:

**See which chunk is currently running:**
```
tail -20 ~/simulations/dopc_test/production_master.log
```

**Check that NAMD is still alive:**
```
ps aux | grep namd3 | grep -v grep
```

**Watch the current chunk's progress in real time:**
```
tail -f ~/simulations/dopc_test/step7_production_X.log
```
(Replace X with the current chunk number.)

**Stop the run early (without losing finished chunks):**
```
pkill namd3
```

This kills NAMD; the launcher script will detect the failure and stop. Your finished chunks (e.g., `step7_production_1.dcd` through `step7_production_3.dcd` if NAMD was on chunk 4) remain valid and analyzable.

**To resume after stopping early or after a crash:**

Edit `run_production.sh` to start at the chunk after the last successful one. For example, if chunks 1-3 finished and chunk 4 was killed, change the loop start from `seq 1 $NCHUNKS` to `seq 4 $NCHUNKS`. The script will pick up at chunk 4, which correctly reads from `step7_production_3` outputs. (Note: restarting *mid-chunk* is also possible using the `.restart.coor/vel/xsc` files NAMD writes every 5,000 steps; we won't cover that here but it's documented in the NAMD User's Guide.)

---

## What you have now

After completing this part, you should have:

- A patched and tested NAMD setup
- A working DOPC bilayer that has equilibrated through the standard 6-step CHARMM-GUI protocol
- 10 ns of production trajectory across 10 numbered DCD files
- Energy logs, restart files, and box-dimension records for each chunk

The production trajectory (`step7_production_*.dcd`) is what you'll analyze — 100 frames total at 50,000-step DCD frequency = 100 frames over 10 ns = one frame per 100 ps.

[Part 4]({{ '/resources/membrane-md/' | relative_url }}) covers the visualization and analysis: loading the trajectory in VMD, computing area per lipid and bilayer thickness vs. time, and validating against published experimental values for DOPC.

---

## Troubleshooting

**NAMD hangs at startup with no error**

Sometimes happens when `+p` is set higher than the machine can handle, or when the macOS Gatekeeper hasn't yet fully approved a NAMD subbinary. Try `+p4` first as a defensive test; if that runs cleanly, work back up. If you see Gatekeeper warnings, follow the same "Open Anyway" workflow from Part 1.

**`FATAL ERROR: UNKNOWN PARAMETER IN CHARMM PARAMETER FILE`**

We pruned the obvious offenders in Steps 2-3, but newer versions of CHARMM-GUI might add new parameter files with the same kinds of CHARMM scripting. Find the offending file by looking at the FATAL ERROR line, then add a corresponding sed command to comment out the bad line. The general pattern: any line that starts with `set`, `if`, `WRNLEV`, `BOMLEV`, etc. inside a `.str` file is CHARMM scripting and must be commented out for NAMD.

**Equilibration runs but APL doesn't stabilize**

If you see APL drifting steadily across all of equilibration without leveling off, the system may need more time. Try extending step 6.6 by editing its `run` count in the `.inp` file, or just letting production run longer and treating early production as additional equilibration time.

**Production crashes partway through with cryptic errors**

Most often a sign that the system became unstable for some reason — typically because equilibration was too short or had a bad starting structure. Check the energy values in the last `step7_production_X.log` before the crash. If kinetic energy spikes or temperature exceeds 350 K, the simulation became unstable. Restart from the last good chunk's `.coor/vel/xsc` files, possibly with a shorter timestep (try 1 fs in `step7_production.inp` instead of 2 fs).

**Caffeinate won't keep my Mac awake**

Verify caffeinate is actually running with `ps aux | grep caffeinate | grep -v grep`. Also check **System Settings → Battery → Options → "Prevent automatic sleeping when display is off"** is enabled. Some macOS versions require both for full effectiveness.

---

*Next: [Part 4 — Visualization and analysis in VMD →]({{ '/resources/membrane-md/04-vmd-analysis/' | relative_url }})*

*Previous: [Part 2 — Building a lipid bilayer with CHARMM-GUI]({{ '/resources/membrane-md/02-charmm-gui-bilayer/' | relative_url }})*

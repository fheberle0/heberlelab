---
layout: page
title: Phosphate Assay Analyzer — Methods
permalink: /resources/phosphate-assay-methods/
nav: false
description: The statistical methodology behind the phosphate assay analyzer — calibration, uncertainty, and outlier detection.
---

This page documents the statistical methods used by the
[Phosphate Assay Analyzer]({{ '/resources/phosphate-assay/' | relative_url }}). The assay itself
(wet-ashing followed by colorimetric quantitation of released inorganic phosphate) follows Heberle
Lab **SOP-PIASSAY-001** ([PDF]({{ '/assets/pdf/SOP-PIASSAY-001.pdf' | relative_url }})), after
Bartlett (1959). The tool turns the raw absorbance readings into a phospholipid stock concentration
with a defensible uncertainty, and screens the data for outliers.

## The standard curve

The assay relates absorbance $A$ to the amount of inorganic phosphate $n$ (in nmol) by a straight
line,

$$ A = a + b\,n, $$

fit by ordinary least squares to the standards. The intercept $a$ is left **free** — estimated from
the blanks rather than forced through zero — because the blank carries a small absorbance from trace
phosphate in the reagents (chiefly the hydrogen peroxide). The fit returns the slope $b$, intercept
$a$, and the residual standard error

$$ s = \sqrt{\frac{1}{N-2}\sum_{i=1}^{N}\bigl(A_i - \hat{A}_i\bigr)^2}, \qquad \hat{A}_i = a + b\,n_i, $$

where $N$ is the number of standards. (This is the quantity Excel calls `STEYX`.) The amount of
phosphate in each standard tube is computed from the dispensed volume of standard and its
concentration, since $1~\text{mM} = 1~\text{nmol}/\mu\text{L}$.

## From absorbance to stock concentration

Each sample's absorbance $A_0$ is converted back to phosphate by inverting the curve,
$n_0 = (A_0 - a)/b$, and the lipid stock concentration follows from the dispensed sample volume $V$
(µL) and the number of phosphates per lipid $p$ (one for most phospholipids; two for cardiolipin):

$$ c = \frac{n_0}{V\,p}. $$

Again because $1~\text{mM} = 1~\text{nmol}/\mu\text{L}$, $c$ is obtained directly in mM. The reported
stock concentration is the mean $\bar{c}$ over the replicate tubes.

## Uncertainty

Two independent sources of error contribute, and the tool reports both separately and combined.

**Replicate scatter** — the tube-to-tube spread (pipetting, ashing, reading) — is captured
empirically as the standard error of the mean of the $m$ per-replicate concentrations:

$$ u_\text{rep} = \frac{s_c}{\sqrt{m}}, $$

with $s_c$ the standard deviation of the replicate concentrations.

**Standard-curve uncertainty** — how well the calibration line itself is known — shifts _every_
replicate together, so it can never show up in the replicate scatter and must be added separately.
For a reading that maps to amount $n$, the line contributes

$$ u_\text{cal,line}(n) = \frac{s}{|b|}\sqrt{\frac{1}{N} + \frac{(n-\bar{n})^2}{S_{nn}}}, \qquad
   S_{nn} = \sum_i (n_i-\bar{n})^2, $$

which is converted to concentration by dividing by $V\,p$. Because this term is *shared* across
replicates (a systematic offset, not random scatter), its contribution to the mean is the linear
average of the per-replicate values rather than a $1/\sqrt{m}$ reduction. The two independent
sources add in quadrature,

$$ u = \sqrt{u_\text{rep}^2 + u_\text{cal}^2}, $$

and the reported confidence interval is $\pm\,t_{0.975,\,\nu}\,u$, with the effective degrees of
freedom from the Welch–Satterthwaite formula,

$$ \nu = \frac{\bigl(u_\text{rep}^2 + u_\text{cal}^2\bigr)^2}
              {u_\text{rep}^4/(m-1) + u_\text{cal}^4/(N-2)}. $$

A useful consequence: because $u_\text{cal}$ grows with $(n-\bar{n})^2$, a sample measured far from
the centre of the standards pays a larger calibration penalty — which is why the tool's planner
encourages you to bracket and centre the standards on your samples. And since running more replicate
tubes shrinks $u_\text{rep}$ but leaves $u_\text{cal}$ untouched, the standard-curve term sets a floor
that only better curve design can lower.

## Detecting outliers {#outliers}

The tool screens both the standard curve and the replicate samples for outliers at a significance
level of $\alpha = 0.05$. The two datasets are statistically different — the standards define a
*line*, the replicates are *repeated measurements of one quantity* — so each is tested with the
method appropriate to it. In both cases suspected outliers are **flagged, not deleted**: a
statistical test only identifies a *candidate*, and the decision to discard a point should be made
deliberately, ideally after checking the lab notebook for a physical cause (an air bubble, a
mis-pipette, a cracked tube). This matters most with small samples, where discarding one of a handful
of points is a large move.

### Standards — studentized residuals

A bad standard is one that does not fit the *line*, so each standard's residual is judged against how
much scatter is expected at that point. Using the leverage
$h_i = 1/N + (n_i - \bar{n})^2/S_{nn}$ and the residual standard error recomputed *without* point $i$,

$$ s_{(i)}^2 = \frac{(N-2)\,s^2 - e_i^2/(1-h_i)}{N-3}, \qquad e_i = A_i - \hat{A}_i, $$

the **externally studentized (deleted) residual** is

$$ t_i = \frac{e_i}{s_{(i)}\sqrt{1-h_i}}. $$

A standard is flagged when $|t_i|$ exceeds the Bonferroni-corrected critical value
$t_{\,1-\alpha/(2N),\,N-3}$; the $1/N$ correction accounts for screening all $N$ standards at once.
This is the classical single-outlier test from regression diagnostics (Cook & Weisberg, 1982). It is
applied only when there are at least 5 standards.

### Samples — Grubbs' test

For the replicate concentrations the tool uses **Grubbs' test** (the extreme studentized deviate
test), the method recommended by ISO and IUPAC for detecting an outlier in a normally distributed
sample. It takes the most extreme replicate,

$$ G = \frac{\max_i \lvert c_i - \bar{c}\rvert}{s_c}, $$

and compares it with the critical value

$$ G_\text{crit} = \frac{N-1}{\sqrt{N}}
   \sqrt{\frac{t^2}{\,N-2+t^2\,}}, \qquad t = t_{\,\alpha/(2N),\,N-2}. $$

If $G > G_\text{crit}$ the extreme point is flagged; the test is then repeated on the remaining
points (a capped, iterated Grubbs / generalized-ESD procedure), up to two flagged replicates, and is
applied only when there are at least 5 replicates. Grubbs' test is preferred here over the
median/IQR rule and Dixon's $Q$ test for its statistical rigour — though all such tests are
deliberately conservative, so that genuine data is rarely discarded.

### What happens in the tool

Flagged points are highlighted in amber and listed with their test statistic (for example,
*"Replicate #3 — 2.9σ from the mean"*). You can uncheck the highlighted rows yourself, or use the
**"Exclude flagged & re-analyze"** button, which drops them and refits; the standard curve,
uncertainty, and outlier flags are all recomputed on the remaining points. Nothing is ever removed
automatically.

## References

1. Bartlett, G. R. (1959). Phosphorus assay in column chromatography. *J. Biol. Chem.* **234**, 466–468.
2. Grubbs, F. E. (1969). Procedures for detecting outlying observations in samples. *Technometrics* **11**, 1–21.
3. Rosner, B. (1983). Percentage points for a generalized ESD many-outlier procedure. *Technometrics* **25**, 165–172.
4. Cook, R. D., & Weisberg, S. (1982). *Residuals and Influence in Regression.* Chapman & Hall.
5. Miller, J. N., & Miller, J. C. (2018). *Statistics and Chemometrics for Analytical Chemistry* (7th ed.). Pearson.

---

*[← Back to the Phosphate Assay Analyzer]({{ '/resources/phosphate-assay/' | relative_url }})*
$$

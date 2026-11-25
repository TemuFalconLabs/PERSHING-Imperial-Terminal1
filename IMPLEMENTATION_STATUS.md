# December 11 station release

Branch: feature/pershing-live-session. Previous Pages release: 8eaf2b6cc5209fa64ab308a4ee47d70aa4603ce7.

Baseline: main contains README and one inline HTML station requiring a local cartridge. No tests, rules or build workflow. Existing Pages address responded. Preserve legacy file at legacy.html in the candidate. Reviewed master sections 1–16, all five Chronicle tabs, existing recap extracts and prior DM kit. Kids scanner outcomes remain undecided.

Content milestone: complete gated terminal, DM dashboard, rules, two campaign paths, scripts and public DM materials. Prior station retained in legacy.html. Staged source and single-file offline build are available on this branch.

Verification so far: both engine tests, emulator permissions, two independent-Chromium-context paths (clean and optional), refresh and offline continuation passed. Production anonymous sign-in passed, but production session creation returned 401 Permission denied. Test identity was removed. Production rules publication and post-publication smoke test remain release gates. Next: verify checkpoint/connection recovery and open PR.

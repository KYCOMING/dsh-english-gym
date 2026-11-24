# Third-party notices

## English word banks (`src/features/word/data/*.json`)

The static vocabulary used by 单词训练 is derived from the **CET4, CET6, IELTS,
and TOEFL** word lists in:

- **KyleBing/english-vocabulary** — https://github.com/KyleBing/english-vocabulary
- Pinned revision for the CET6, IELTS, and TOEFL source lists: [`731240a848dca14e2cf17510f384312b788863c1`](https://github.com/KyleBing/english-vocabulary/tree/731240a848dca14e2cf17510f384312b788863c1)
- License: **BSD 3-Clause** (`BSD-3-Clause`)

| Bundled file | Word list |
| --- | --- |
| `src/features/word/data/cet4.json` | CET4 |
| `src/features/word/data/cet6.json` | 六级 (`full_line_jsonl/simple/正序/六级.jsonl`) |
| `src/features/word/data/ielts.json` | 雅思 (`full_line_jsonl/simple/正序/雅思.jsonl`) |
| `src/features/word/data/toefl.json` | 托福 (`full_line_jsonl/simple/正序/托福.jsonl`) |

The CET4 list was trimmed to single English words with a concise Chinese gloss,
and a small number of AI/tech terms were added by hand. The CET6, IELTS, and
TOEFL lists were filtered to single ASCII English words; duplicate entries were
merged with their Chinese glosses and normalized parts of speech. These are
study vocabulary lists, not official examination word lists.

The `example` and `exampleZh` fields were generated for this project with an
LLM; they are not part of the upstream word lists and are not covered by the
BSD-3-Clause license above.

```
BSD 3-Clause License

Copyright (c) KyleBing and contributors
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

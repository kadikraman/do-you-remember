export type CategoryId = 'git' | 'http' | 'js-quirks';

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  description: string;
  color: string;
  iconName: string;
}

export interface Question {
  id: string;
  categoryId: CategoryId;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation?: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'git',
    label: 'Git Commands',
    emoji: '🌿',
    description: 'Test your knowledge of Git commands, flags, and workflows. From basic commits to advanced rebasing — how sharp are your version control skills?',
    color: '#2D6A4F',
    iconName: 'arrow.triangle.branch',
  },
  {
    id: 'http',
    label: 'HTTP Status Codes',
    emoji: '🌐',
    description: 'Do you know your 200s from your 500s? Test whether you can identify what each HTTP status code means — no Googling allowed.',
    color: '#7C3AED',
    iconName: 'globe',
  },
  {
    id: 'js-quirks',
    label: 'JavaScript Quirks',
    emoji: '✨',
    description: 'JavaScript: the language that keeps on giving. Test your knowledge of its most infamous quirks, coercions, and "wat" moments.',
    color: '#D97706',
    iconName: 'curlybraces',
  },
];

export const QUESTIONS: Question[] = [
  // Git Commands
  {
    id: 'git-1',
    categoryId: 'git',
    prompt: 'Which command creates a new branch and immediately switches to it?',
    options: [
      'git branch new-branch && git checkout new-branch',
      'git checkout -b new-branch',
      'git switch --create new-branch',
      'Both B and C are correct',
    ],
    correctIndex: 3,
    explanation: 'Both `git checkout -b` and `git switch --create` (or `-c`) create and switch to a new branch.',
  },
  {
    id: 'git-2',
    categoryId: 'git',
    prompt: 'What does `git stash pop` do differently from `git stash apply`?',
    options: [
      'Nothing — they are identical',
      '`pop` applies and removes the stash; `apply` keeps it',
      '`pop` only works on the latest stash',
      '`apply` merges conflicts automatically',
    ],
    correctIndex: 1,
    explanation: '`git stash pop` applies the stash and removes it from the stash list. `git stash apply` applies it but leaves it in the list.',
  },
  {
    id: 'git-3',
    categoryId: 'git',
    prompt: 'What does the `--amend` flag do in `git commit --amend`?',
    options: [
      'Creates a new branch from the last commit',
      'Modifies the most recent commit (message or content)',
      'Reverts the last commit entirely',
      'Stages all modified files',
    ],
    correctIndex: 1,
    explanation: '`--amend` replaces the tip of the current branch with a new commit, letting you fix the message or add forgotten changes.',
  },
  {
    id: 'git-4',
    categoryId: 'git',
    prompt: 'What is a "detached HEAD" state in Git?',
    options: [
      'A corrupted repository',
      'HEAD points directly to a commit, not a branch',
      'A merge conflict that wasn\'t resolved',
      'When a remote branch is deleted',
    ],
    correctIndex: 1,
    explanation: 'Detached HEAD means HEAD points to a specific commit SHA rather than a branch name. Commits made here aren\'t on any branch.',
  },
  {
    id: 'git-5',
    categoryId: 'git',
    prompt: 'What does `git rebase -i HEAD~3` allow you to do?',
    options: [
      'Merge the last 3 branches',
      'Interactively edit the last 3 commits',
      'Revert the last 3 commits',
      'View the diff of the last 3 commits',
    ],
    correctIndex: 1,
    explanation: 'Interactive rebase (`-i`) opens an editor letting you reorder, squash, edit, or drop the specified commits.',
  },
  {
    id: 'git-6',
    categoryId: 'git',
    prompt: 'Which command shows the commit history as a compact one-line-per-commit graph?',
    options: [
      'git log --oneline --graph',
      'git show --compact',
      'git history --tree',
      'git status --verbose',
    ],
    correctIndex: 0,
    explanation: '`git log --oneline --graph` displays an ASCII art graph with short hashes and messages.',
  },
  {
    id: 'git-7',
    categoryId: 'git',
    prompt: 'What does `git cherry-pick <sha>` do?',
    options: [
      'Deletes a commit by its hash',
      'Applies the changes from a specific commit onto the current branch',
      'Creates a tag at the specified commit',
      'Reverts a commit without deleting history',
    ],
    correctIndex: 1,
    explanation: 'Cherry-pick lets you copy a commit from another branch and apply it to your current branch.',
  },
  {
    id: 'git-8',
    categoryId: 'git',
    prompt: 'What is the difference between `git reset --soft` and `git reset --hard`?',
    options: [
      'They are the same; only the message differs',
      '`--soft` keeps staged changes; `--hard` discards everything',
      '`--hard` keeps the working tree; `--soft` clears it',
      '`--soft` resets remote; `--hard` resets local only',
    ],
    correctIndex: 1,
    explanation: '`--soft` moves HEAD but keeps changes staged. `--hard` moves HEAD and discards all changes in working tree and index.',
  },
  {
    id: 'git-9',
    categoryId: 'git',
    prompt: 'What does `.gitignore` do?',
    options: [
      'Removes tracked files from the repository',
      'Prevents specified files/patterns from being tracked by Git',
      'Stores credentials securely',
      'Encrypts files before committing',
    ],
    correctIndex: 1,
    explanation: '`.gitignore` lists patterns of files Git should not track. Already-tracked files are not affected.',
  },
  {
    id: 'git-10',
    categoryId: 'git',
    prompt: 'What command would you use to see which commits introduced a specific string into the codebase?',
    options: [
      'git find -S "string"',
      'git log -S "string"',
      'git search --all "string"',
      'git blame --string "string"',
    ],
    correctIndex: 1,
    explanation: '`git log -S "string"` (the "pickaxe" flag) shows commits that added or removed the given string.',
  },

  // HTTP Status Codes
  {
    id: 'http-1',
    categoryId: 'http',
    prompt: 'What does HTTP status code 418 mean?',
    options: [
      'Payment Required',
      'I\'m a teapot',
      'Service Unavailable',
      'Unprocessable Entity',
    ],
    correctIndex: 1,
    explanation: '418 "I\'m a teapot" is an April Fools\' joke from RFC 2324 (Hyper Text Coffee Pot Control Protocol). Many servers implement it for fun.',
  },
  {
    id: 'http-2',
    categoryId: 'http',
    prompt: 'What is the difference between 401 and 403?',
    options: [
      'They mean the same thing',
      '401 = unauthenticated; 403 = authenticated but unauthorized',
      '401 = server error; 403 = client error',
      '401 = rate limited; 403 = forbidden by firewall',
    ],
    correctIndex: 1,
    explanation: '401 means you aren\'t logged in (or your token is bad). 403 means you\'re authenticated but don\'t have permission.',
  },
  {
    id: 'http-3',
    categoryId: 'http',
    prompt: 'A 301 response means:',
    options: [
      'The resource was found temporarily at a different URL',
      'The resource has moved permanently to a new URL',
      'The request succeeded but has no content',
      'The server is redirecting due to maintenance',
    ],
    correctIndex: 1,
    explanation: '301 is a permanent redirect. Browsers and search engines update their records. 302 is for temporary redirects.',
  },
  {
    id: 'http-4',
    categoryId: 'http',
    prompt: 'What does a 204 status code indicate?',
    options: [
      'The request failed with no error message',
      'The request succeeded but there is no content to return',
      'The content has been partially delivered',
      'The resource was created successfully',
    ],
    correctIndex: 1,
    explanation: '204 No Content is commonly returned by DELETE or PUT endpoints when the operation succeeded but there\'s nothing to send back.',
  },
  {
    id: 'http-5',
    categoryId: 'http',
    prompt: 'What does 429 mean?',
    options: [
      'Too Many Requests (rate limited)',
      'Request Timeout',
      'Payload Too Large',
      'Upgrade Required',
    ],
    correctIndex: 0,
    explanation: '429 Too Many Requests means the client has sent too many requests in a given time. APIs use this for rate limiting.',
  },
  {
    id: 'http-6',
    categoryId: 'http',
    prompt: 'Which status code would a REST API return when a new resource is successfully created?',
    options: [
      '200 OK',
      '204 No Content',
      '201 Created',
      '202 Accepted',
    ],
    correctIndex: 2,
    explanation: '201 Created indicates that the request succeeded and a new resource was created. The response often includes a Location header.',
  },
  {
    id: 'http-7',
    categoryId: 'http',
    prompt: 'What does 503 Service Unavailable typically indicate?',
    options: [
      'The client sent a malformed request',
      'The resource no longer exists',
      'The server is temporarily down or overloaded',
      'Authentication failed',
    ],
    correctIndex: 2,
    explanation: '503 means the server can\'t handle the request right now — usually due to maintenance or being overwhelmed. Retry-After header may be included.',
  },
  {
    id: 'http-8',
    categoryId: 'http',
    prompt: 'What is the 304 Not Modified response used for?',
    options: [
      'Telling the client to use the cached version',
      'Indicating partial content delivery',
      'Redirecting to a new URL',
      'Confirming a file was not changed by the server',
    ],
    correctIndex: 0,
    explanation: '304 is used with conditional requests (If-Modified-Since / ETag). It tells the client the cached version is still valid.',
  },
  {
    id: 'http-9',
    categoryId: 'http',
    prompt: 'What does 422 Unprocessable Entity mean?',
    options: [
      'The request body is too large',
      'The syntax is valid but the semantics are wrong',
      'The endpoint doesn\'t exist',
      'The server can\'t process this file type',
    ],
    correctIndex: 1,
    explanation: '422 means the request was well-formed but contained semantic errors (e.g., validation failures). Common in REST APIs.',
  },
  {
    id: 'http-10',
    categoryId: 'http',
    prompt: 'What\'s the difference between 500 and 502?',
    options: [
      'They\'re identical',
      '500 = internal error on the origin server; 502 = bad response from upstream',
      '500 = client error; 502 = server error',
      '502 only occurs with WebSockets',
    ],
    correctIndex: 1,
    explanation: '500 Internal Server Error is a generic server crash. 502 Bad Gateway means a proxy/load balancer got an invalid response from an upstream server.',
  },

  // JavaScript Quirks
  {
    id: 'js-1',
    categoryId: 'js-quirks',
    prompt: 'What does `typeof null` return in JavaScript?',
    options: [
      '"null"',
      '"undefined"',
      '"object"',
      '"boolean"',
    ],
    correctIndex: 2,
    explanation: 'This is a long-standing bug in JavaScript. `typeof null === "object"` — it\'s never been fixed to avoid breaking existing code.',
  },
  {
    id: 'js-2',
    categoryId: 'js-quirks',
    prompt: 'What is the result of `0.1 + 0.2 === 0.3` in JavaScript?',
    options: [
      'true',
      'false',
      'It throws an error',
      'undefined',
    ],
    correctIndex: 1,
    explanation: 'Due to IEEE 754 floating-point arithmetic, `0.1 + 0.2` equals `0.30000000000000004`. Use `Number.EPSILON` for comparisons.',
  },
  {
    id: 'js-3',
    categoryId: 'js-quirks',
    prompt: 'What does `[] + []` evaluate to?',
    options: [
      '[]',
      '0',
      '"" (empty string)',
      'undefined',
    ],
    correctIndex: 2,
    explanation: 'Both arrays are coerced to empty strings, then concatenated: `"" + "" = ""`.',
  },
  {
    id: 'js-4',
    categoryId: 'js-quirks',
    prompt: 'What does `[] + {}` evaluate to?',
    options: [
      '{}',
      '"[object Object]"',
      'undefined',
      '0',
    ],
    correctIndex: 1,
    explanation: '`[]` becomes `""`, `{}` becomes `"[object Object]"`, so `"" + "[object Object]" = "[object Object]"`.',
  },
  {
    id: 'js-5',
    categoryId: 'js-quirks',
    prompt: 'What is the result of `typeof NaN`?',
    options: [
      '"NaN"',
      '"undefined"',
      '"number"',
      '"error"',
    ],
    correctIndex: 2,
    explanation: 'Despite standing for "Not a Number", `NaN` has type `"number"`. Also, `NaN !== NaN` — use `Number.isNaN()` to check for it.',
  },
  {
    id: 'js-6',
    categoryId: 'js-quirks',
    prompt: 'What does `"5" - 3` evaluate to in JavaScript?',
    options: [
      '"53" (string)',
      'NaN',
      '2 (number)',
      '53 (number)',
    ],
    correctIndex: 2,
    explanation: 'The `-` operator always coerces to numbers, so `"5"` becomes `5` and the result is `2`. The `+` operator would concatenate instead.',
  },
  {
    id: 'js-7',
    categoryId: 'js-quirks',
    prompt: 'What is the value of `!!""` in JavaScript?',
    options: [
      'true',
      'false',
      '"" (empty string)',
      'undefined',
    ],
    correctIndex: 1,
    explanation: '`""` is falsy. `!""` is `true`. `!!""` is `false`. Double negation converts any value to its boolean equivalent.',
  },
  {
    id: 'js-8',
    categoryId: 'js-quirks',
    prompt: 'What does `console.log(1 < 2 < 3)` print?',
    options: [
      'false',
      'true',
      'It throws a TypeError',
      'NaN',
    ],
    correctIndex: 1,
    explanation: '`1 < 2` is `true`, then `true < 3` coerces `true` to `1`, so `1 < 3` is `true`. Chained comparisons don\'t work mathematically in JS.',
  },
  {
    id: 'js-9',
    categoryId: 'js-quirks',
    prompt: 'What does `console.log(3 > 2 > 1)` print?',
    options: [
      'true',
      'false',
      'It throws a TypeError',
      'undefined',
    ],
    correctIndex: 1,
    explanation: '`3 > 2` is `true`, then `true > 1` coerces `true` to `1`, so `1 > 1` is `false`. Gotcha!',
  },
  {
    id: 'js-10',
    categoryId: 'js-quirks',
    prompt: 'What is the result of `+[]` in JavaScript?',
    options: [
      'undefined',
      'NaN',
      '0',
      '""',
    ],
    correctIndex: 2,
    explanation: 'The unary `+` coerces `[]` to a number: `[]` → `""` → `0`. So `+[] === 0`.',
  },
];

export const FEEDBACK = {
  correct: [
    "Correct! There's hope for you yet.",
    'Look at you, remembering things!',
    'Right! The neurons still fire.',
    "Correct! Who needs AI anyway?",
    'Nailed it. Your rubber duck would be proud.',
    'You still got it. Barely.',
  ],
  incorrect: [
    'Nope. Maybe ask ChatGPT?',
    'Wrong. The AI has taken this one from you.',
    'Incorrect. This is why we built autocomplete.',
    "Not quite. Stack Overflow is judging you.",
    'Wrong! Your senior dev is sighing somewhere.',
    'Nah. Back to the docs with you.',
  ],
};

export function getQuestionsForCategory(id: CategoryId): Question[] {
  return QUESTIONS.filter((q) => q.categoryId === id);
}

export function getCategoryById(id: CategoryId): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

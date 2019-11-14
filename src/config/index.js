const options = {
  "root": true,
  "files": {
    "include": ["*/*"]
  }
}

const config = {
  'doclint.json': { ...options },
  'doclintrc.js': { ...options },
  doclintrc: { ...options }
}

export function getConfig (fileType) {
  return config[fileType]
};

export const defaultRules = {
  "no-use-of-simple": "on",
  "no-use-of-simply": "on",
  "no-use-of-easy": "on",
  "no-use-of-obviously": "on",
  "no-use-of-easily": "on",
  "no-use-of-just": "on",
  "no-unhelpful-phrases": "on",
  "no-race-related-terms": ["on", { "default": true }],
  "use-docs-folder": "warn",
  "modular-root-file": ["on", { "default": true }],
  "no-use-of-white-without-qualifier": ["on", { "qualifiers": ["color"] }],
  "no-use-of-black-without-qualifier": ["on", { "qualifiers": ["color"] }]
}

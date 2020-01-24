# DocLint Roadmap

## About DocLint

DocLint is first and foremost a documentation linter that enables people to write better documentation. The main goal of doclint is to improve the state of documentation. This project was initiated out of necessity to due to the amount of neglect given to documentation in terms of Grammar, Readablity and modularization.

## Target Platforms

To ensure that there are no excuses for bad documentation, DocLint intends to target as many platforms as possible i.e. we are open to suggestions for target platforms and help in bringing DocLint to the various platforms.

At the moment however, the platforms currently targetted are the following

* JavaScript - This is due to the sheer amount of JavaScript projects currently open sourced. The JavaScript platform/language is supported via a cli package hosted in npm.

* CLI - To ensure that regardless of the programming language used or editor used in development doclint is available, a CLI tool is to be built in RUST. The choice of Rust was mostly due to speed, the growing community and the possibility it brings in terms of readability and ease of use for new contributors.

* Extentions - The concept of extentions was introduced to ensure that there could be the possibility to have a plug-and-play like functionality for both the browser and different editors. The idea is to bring the tool to be available in such a way that non technical people would als be able to use it in order to analyze the state of the documentation and offer ideas for improvements as well. The targetted extentions at the moment are as follows:

    1. Broswer based extentions - Targetted to both Chrome and Mozilla for a start.
    2. VSCode extention - This is an editor/IDE extension that aims to bring the possibility of doclint to developers while they write thier docs as opposed to running from the CLI after they write thier docs.

## Current Rules

Whilst we work internally at the TSC level, the following rules have generally been adopted as a start off point for linting:

### no-use-of-[word] Ruleset

This refers to the rule set that begins with the `no-use-of` prefix followed by the actual word that shouldn't be used. Currently these are the following `no-use-of` rules available

```json
"no-use-of-simple": "on",
"no-use-of-simply": "on",
"no-use-of-easy": "on",
"no-use-of-obviously": "on",
"no-use-of-easily": "on",
"no-use-of-just": "on",
```

These rules can be set to either `on`, `off` or `warn`. When set to `on`, every occurence of the word will be highlighted in the linting report with a color `red` and counted as an error. When set to `off`, every occurence of the word will be totally ignored when linting. When set to `warn`, every occurence of the given word would highlighted in the linting with the color `yellow` however it will not be counted as an error.

This list of rules would continue being updated as we get more feedback from people so if you believe there is a word that needs to be added to the rule list please reach out to us.

### no-use-of-[color]-without-qualifier Ruleset

This rule refers to ensuring that racial bias does no exist in our documentation by avoiding race related words i.e. `white` and `black` without a qualifying word before or after it to ensure it correctly passes the intended message.

```json
"no-use-of-white-without-qualifier": ["on", { "qualifiers": ["color"] }],
"no-use-of-black-without-qualifier": ["on", { "qualifiers": ["color"] }]
```

### no-unhelpful-phrases Ruleset

This rule refers to ensuring that unhelpful phrases which do not add any value to documentation (rather reduces the readability) are highlighted. For a list of the current unhelpful phrases see [here](/js/src/rules/unhelpfulPhrases.js)

### no-race-related-terms Ruleset

This rule refers to ensuring that racial based terms which do not add any value to documentation (rather reduces the readability) are highlighted. 

This rule accepts an array where the first index contains either one of `on`, `off` or `warn` and the second index contains a configuration object option which allows users to put `key-value` pairs where the `key` refers to the race related term and the `value` refers to the replacement term to be used. 

The configuration object option also accepts a `key-value` pair to override the default as opposed to just extending them. The example below will override the defaults an use only the definition added

```json
"no-race-related-phrases": [
  "on",
  { 
    "default": false,
    "slave": "replica"
  }
],
```

However, when the default is set to true or not set at all, the configuration option rules are added to the default rules when performing linting. The example below will use the default rules as well as the rule provided in the configuration object option in the second index

```json
"no-race-related-phrases": [
  "on",
  { 
    "default": true,
    "slave": "replica"
  }
],
```

For a list of the current race relatedterms see [here](/src/rules/raceRelatedTerms.js)

### use-docs-folder Ruleset

The use-docs-folder ruleset refers to ensuring that a docs folder should be used to reference required sections of the entry file. This rule is by default set to "warn" because we understand that some docs might not involve so many sections that would warrant a seperate docs folder.

```json
"use-docs-folder": "warn",
```

The rule can be set to either `on`, `off` or `warn`. When set to `on`, if a doc folder is missing in the project root, it will be highlighted in the linting report with a color `red` and counted as an error. When set to `off`, if a doc folder is missing in the project root, it will be totally ignored when linting. When set to `warn`, if a doc folder is missing in the project root, it will be highlighted in the linting report with the color `yellow` however it will not be counted as an error.

### modular-root-file Ruleset

The `modular-root-file` Ruleset is used help in keeping the documentation entry file to be modular. It accepts an array where the first index corresponds to one of either `on`, `off`, or `warn`. The second index accepts a configuration object option with a list of rules that can be used to modify the linting rules. The linting rule default can be found [here](/js/src/rules/modularRootFile.js)

```json
"modular-root-file": ["on", { "default": true }]
```
The linting rules can be overriding by providing alternate values to the current rules. The example below will override the default `no-of-lines` rule for modular root file and instead use the rule modification provided.

```json
"modular-root-file": [
  "on",
  { 
    "no-of-lines": 200,
  }
]
```




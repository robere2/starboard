# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-pre.30](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.29...@mcsb/schemas@1.0.0-pre.30) (2023-12-03)

### Bug Fixes

- `skills.json` schema top-level key changed to `skills` ([3395b5c](https://github.com/robere2/starboard/commit/3395b5cd83f7295f763d03829442364a372a8ab4))

### Features

- Update `skyblock/profile` schema to v2 ([edb5434](https://github.com/robere2/starboard/commit/edb54344c24d4425f363bb88dfec5184495edbd6))
- Update all Hypixel API urls to API v2 ([876c9ac](https://github.com/robere2/starboard/commit/876c9ac95a9ccf71a466da07b5db4c6fdce41d21))

# [1.0.0-pre.29](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.28...@mcsb/schemas@1.0.0-pre.29) (2023-12-03)

### Bug Fixes

- Fix inconsistencies with the `logger` function and its usage ([4b98f6b](https://github.com/robere2/starboard/commit/4b98f6b62833647fb449509a2cf15e2dbffe9dc2))
- switch all uses of `oneOf` to `anyOf` ([a8a9f81](https://github.com/robere2/starboard/commit/a8a9f8151c2e72e8d4f407a72bf0a1f218c8170b))

### Features

- Add percentage completion to generator logs ([07190c4](https://github.com/robere2/starboard/commit/07190c409fb61c1c626006c2800d7edeafc70ec3))
- Add post-generation testing to make sure no new errors have been introduced ([2d81946](https://github.com/robere2/starboard/commit/2d8194608db6205127922fe4faf0cc6825d10cfd))
- Detect schema type divergence and automatically update the type with `oneOf` ([7e96495](https://github.com/robere2/starboard/commit/7e9649582ccce62284bb70374e4fc816e017ede4))
- Disable line overwriting by the logger, reverting back to something more similar to how it was in previous versions ([616d7e4](https://github.com/robere2/starboard/commit/616d7e42f793d1dda46f2874887dac6c734b5464))
- Merge overlapping schema types in "anyOf" arrays into a single type ([df7aa7c](https://github.com/robere2/starboard/commit/df7aa7c4f103e7724ea0f12a2ee83d0aa2a3a812))
- Schema generator refactoring, now employing worker threads for CPU-heavy tasks ([c007a4c](https://github.com/robere2/starboard/commit/c007a4c9f45d14cf155f7c394366fb30271916aa))
- Schema updates ([20daa98](https://github.com/robere2/starboard/commit/20daa982b1f276f37959b0766f7ea651482dead6))

# [1.0.0-pre.28](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.24...@mcsb/schemas@1.0.0-pre.28) (2023-11-04)

### Features

- JSON schema updates ([#33](https://github.com/robere2/starboard/issues/33)) ([06785bf](https://github.com/robere2/starboard/commit/06785bf87949b7d54783253ede4a783dcf6886c9))

# [1.0.0-pre.27](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.26...@mcsb/schemas@1.0.0-pre.27) (2023-11-04)

**Note:** Version bump only for package @mcsb/schemas

# [1.0.0-pre.26](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.25...@mcsb/schemas@1.0.0-pre.26) (2023-11-04)

**Note:** Version bump only for package @mcsb/schemas

# [1.0.0-pre.25](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.24...@mcsb/schemas@1.0.0-pre.25) (2023-11-04)

### Bug Fixes

- Remove unused runtime dependencies used by schema generator ([#37](https://github.com/robere2/starboard/issues/37)) ([967e3e8](https://github.com/robere2/starboard/commit/967e3e89c6bc8e63aec134d66281ad787de163b0))

# [1.0.0-pre.24](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.23...@mcsb/schemas@1.0.0-pre.24) (2023-11-04)

### Features

- Update schemas ([589f8d6](https://github.com/robere2/starboard/commit/589f8d69e52118829abcd2604bf94266b96eff26))

# [1.0.0-pre.23](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.22...@mcsb/schemas@1.0.0-pre.23) (2023-11-04)

### Features

- schema updates ([068648f](https://github.com/robere2/starboard/commit/068648f1c0e3785e4b4725bbcb37879b214ef9d8))

# [1.0.0-pre.22](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.21...@mcsb/schemas@1.0.0-pre.22) (2023-11-04)

**Note:** Version bump only for package @mcsb/schemas

# [1.0.0-pre.21](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.20...@mcsb/schemas@1.0.0-pre.21) (2023-11-04)

**Note:** Version bump only for package @mcsb/schemas

# [1.0.0-pre.20](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.19...@mcsb/schemas@1.0.0-pre.20) (2023-11-04)

### Features

- Significantly improve memory usage ([e68665a](https://github.com/robere2/starboard/commit/e68665a6d0f8e79946711600221e53f3039695ff))

# [1.0.0-pre.19](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.18...@mcsb/schemas@1.0.0-pre.19) (2023-11-04)

**Note:** Version bump only for package @mcsb/schemas

# [1.0.0-pre.18](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.17...@mcsb/schemas@1.0.0-pre.18) (2023-11-03)

**Note:** Version bump only for package @mcsb/schemas

# [1.0.0-pre.17](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.16...@mcsb/schemas@1.0.0-pre.17) (2023-11-03)

### Bug Fixes

- Logs formatting errors ([5ca36cf](https://github.com/robere2/starboard/commit/5ca36cf1b233e50d8545f6ba7bf4c054c32eb86d))

# [1.0.0-pre.16](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.15...@mcsb/schemas@1.0.0-pre.16) (2023-11-03)

### Features

- schema updates ([0079be5](https://github.com/robere2/starboard/commit/0079be599496b704436068e2a9c56ef682c38887))

# [1.0.0-pre.15](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.13...@mcsb/schemas@1.0.0-pre.15) (2023-11-03)

### Bug Fixes

- package version number ([fcfa52a](https://github.com/robere2/starboard/commit/fcfa52a5ae0e004e34c0f429275ca3fecc52644b))

### Features

- Implement remaining schemas ([#28](https://github.com/robere2/starboard/issues/28)) ([0274cb7](https://github.com/robere2/starboard/commit/0274cb775003d6262875a831830aacc736558a1a))

# [1.0.0-pre.13](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.12...@mcsb/schemas@1.0.0-pre.13) (2023-11-02)

### Bug Fixes

- remove duplicate properties ([7317271](https://github.com/robere2/starboard/commit/7317271908fc4158be1ca9bf557176ddbdde7e70))

# [1.0.0-pre.12](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.11...@mcsb/schemas@1.0.0-pre.12) (2023-11-02)

### Bug Fixes

- Schema references weren't being generated for the docs ([0ad4759](https://github.com/robere2/starboard/commit/0ad47592fa1338b79166af736c85e7e6ce639c52))

# [1.0.0-pre.11](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.10...@mcsb/schemas@1.0.0-pre.11) (2023-11-02)

### Bug Fixes

- Schema references weren't being generated for the docs ([b15891b](https://github.com/robere2/starboard/commit/b15891b7d25458eb17ae2d7fff837bdd5f9b0a4f))

# [1.0.0-pre.10](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.9...@mcsb/schemas@1.0.0-pre.10) (2023-11-02)

### Bug Fixes

- npmignore tsconfig.typedoc.json ([d188a4c](https://github.com/robere2/starboard/commit/d188a4c12a86d4ee6c4eb9d8df68c2cb7cc253fb))

### Features

- **docs:** Schema reference generation ([ecce95a](https://github.com/robere2/starboard/commit/ecce95a3233bb7ba1ad75376d421b2f5a249f326))

# [1.0.0-pre.9](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.8...@mcsb/schemas@1.0.0-pre.9) (2023-11-02)

**Note:** Version bump only for package @mcsb/schemas

# [1.0.0-pre.8](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.7...@mcsb/schemas@1.0.0-pre.8) (2023-11-02)

### Features

- Sort schema objects to decrease commit diffs ([c6834c2](https://github.com/robere2/starboard/commit/c6834c24a766673647be6ef67e3df7174f525bd7))

# [1.0.0-pre.7](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.6...@mcsb/schemas@1.0.0-pre.7) (2023-11-02)

### Bug Fixes

- remove duplicate and unnecessary files from published package ([23e3780](https://github.com/robere2/starboard/commit/23e37802311edd131535901c6feb6448657a1243))

# [1.0.0-pre.6](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.5...@mcsb/schemas@1.0.0-pre.6) (2023-11-02)

### Bug Fixes

- duplicate schema keys ([26dc6a4](https://github.com/robere2/starboard/commit/26dc6a4d918af30629ec6e312b4603ffcaa47e46))

### Features

- Separate build and generate steps ([b52a36d](https://github.com/robere2/starboard/commit/b52a36d07f1be0bc344ef6f24a388dc5c5ed4209))

# [1.0.0-pre.5](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.4...@mcsb/schemas@1.0.0-pre.5) (2023-11-02)

**Note:** Version bump only for package @mcsb/schemas

# [1.0.0-pre.4](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.3...@mcsb/schemas@1.0.0-pre.4) (2023-11-02)

### Bug Fixes

- remove debugging comment ([9df8c07](https://github.com/robere2/starboard/commit/9df8c0772cc5776ba1f83066a2f52be6eaa4b606))

# [1.0.0-pre.3](https://github.com/robere2/starboard/compare/@mcsb/schemas@1.0.0-pre.2...@mcsb/schemas@1.0.0-pre.3) (2023-11-02)

### Bug Fixes

- build process ([212e8dc](https://github.com/robere2/starboard/commit/212e8dc72eb936d0d535010b77719b4094d72661))

# 1.0.0-pre.2 (2023-11-02)

### Features

- `@mcsb/schemas` package ([#15](https://github.com/robere2/starboard/issues/15)) ([e5239d1](https://github.com/robere2/starboard/commit/e5239d12e3dc7296f2c56bc627d5f28c94690ecf))

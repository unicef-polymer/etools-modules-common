# etools-modules-common

Common styles, mixins, utils

## Publish process

### Auto-generate
First of all build src files using comand
`./node_modules/.bin/gulp`
Then publish package using
`npm publish`

### Manual
Run `tsc`.
`tsc` will fail for some mixin, because of the dependency on LitElement wich has protected members.
The `d.ts` files for these, can be moved manually from `mixins/definition_files/` to `dist/mixins`. 
If there are ny changes made to the mixins, make sure to update `mixins/definition_files`

## Circle CI

Package will be automatically published after tag push (`git tag 1.2.3` , `git push --tags`). Tag name must correspond to SemVer (Semantic Versioning) rules.  
Examples:

| Version match      | Result   |
| ------------------ | -------- |
| `1.2.3`            | match    |
| `1.2.3-pre`        | match    |
| `1.2.3+build`      | match    |
| `1.2.3-pre+build`  | match    |
| `v1.2.3-pre+build` | match    |
| `1.2`              | no match |

You can see more details [here](https://rgxdb.com/r/40OZ1HN5)

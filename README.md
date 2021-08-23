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


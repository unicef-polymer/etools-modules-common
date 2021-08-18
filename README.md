# etools-modules-common

Common styles, mixins, utils

## Workaround for tsc not being able to generate definition files for mixins

CTRL+Shift+H `<T extends Constructor<LitElement>>` with `<T extends Constructor<any>>`. Run tsc.  After, replace back `any` with `LitElement` (including in d.ts files).

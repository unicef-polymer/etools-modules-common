/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require('gulp');
const through2 = require('through2').obj;
const path = require('path');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json', {noEmitOnError: false});

const SRC = 'src_ts/';
const DIST = 'dist/';

const LIT_CONSTRUCTOR = 'Constructor<LitElement>';
const ANY_CONSTRUCTOR = 'Constructor<any>';
const LIT_IMPORT = `import {LitElement} from 'lit';\n`;

const INDEXED_PROPERTY_REG = /\n\s+\[x: string]: any;/;
const DEPENDENCY_REG = /class\s+\S+?\s+extends\s+(\S+?)\s+{/s;
const DEPS_PARSING_REG = /([^(]+?)\(/g;
const createDepsImportReg = (depsName) => new RegExp(`import\\s[^;]*?${depsName}[^;]*?;`, 's');
const dependenciesMap = {};
/**
 * Gulp is used instead of tsc , because tsc can't generate the d.ts files for mixins.
 * That's because the mixins inherit from LitElement which has protected members and tsc has a problem with that.
 * The approach is to replace LitElement with 'any' before running tsc then put back LitElement.
 */
gulp.task('default', () =>
  gulp
    .src(`${SRC}/**/*.ts`)
    .pipe(
      through2((file, enc, callback) => {
        if (isMixin(file)) {
          prepareAndMapFile(file);
        }
        callback(null, file);
      })
    )
    .pipe(tsProject())
    .on('error', () => {
      /* Ignore compiler errors */
    })
    .pipe(
      through2((file, enc, callback) => {
        // check if file exists in global map object
        const filePath = path.relative(`${__dirname}/${DIST}`, file.path);
        const interoperabilFilePath = cleanUpFilePath(filePath);
        if (isMixinDeclarationFile(interoperabilFilePath) && dependenciesMap[interoperabilFilePath]) {
          fixDeclarationFile(file, interoperabilFilePath);
        }
        callback(null, file);
      })
    )
    .pipe(gulp.dest(DIST))
);

function cleanUpFilePath(filePath) {
  // Make it work on both Windows and Linux
  while (filePath.indexOf('\\') > -1) {
    filePath = filePath.replace('\\', '/');
  }

  return filePath;
}

function isMixinDeclarationFile(filePath) {
  return filePath.indexOf('.d.ts') > -1 && filePath.indexOf('mixins') > -1;
}

function isMixin(file) {
  if (!file.isBuffer() || !file.path.includes('mixins')) {
    return false;
  }

  // check if this is mixin
  const fileContent = String(file.contents);
  return new RegExp(LIT_CONSTRUCTOR).test(fileContent);
}

function prepareAndMapFile(file) {
  // set constructor to any
  const replacedContent = String(file.contents).replace(LIT_CONSTRUCTOR, ANY_CONSTRUCTOR);
  file.contents = Buffer.from(replacedContent);

  // check if other mixins are used inside mixin
  // eslint-disable-next-line max-len
  const [, dependencies = ''] = replacedContent.match(DEPENDENCY_REG) || []; // ends up with SomeMixin(OtherMixin(BaseClass))
  const parsed = Array.from(dependencies.matchAll(DEPS_PARSING_REG)).map(([, name]) => {
    // find import path for dependency
    const reg = createDepsImportReg(name);
    const [importLine] = replacedContent.match(reg);
    return {name, importLine};
  });

  // create declaration file path and use it as object key
  const filePath = path.relative(`${__dirname}/${SRC}`, file.dirname);
  const declarationFileName = `${file.stem}.d.ts`;

  // set to the global object map
  dependenciesMap[`${filePath}/${declarationFileName}`] = parsed;
}

function fixDeclarationFile(file, filePath) {
  // remove indexed property ([x: string]: any), revert constructor changes
  let replacedContent = String(file.contents)
    .replace(INDEXED_PROPERTY_REG, '')
    .replace(new RegExp(ANY_CONSTRUCTOR), LIT_CONSTRUCTOR);

  let imports = LIT_IMPORT;
  const types = [];
  // add additional imports and typings for dependencies if exists
  dependenciesMap[filePath].forEach(({importLine, name}) => {
    imports += `${importLine}\n`;
    types.push(`ReturnType<typeof ${name}>`);
  });
  if (types.length) {
    replacedContent = replacedContent.replace(/(} & T)/, `$1 & ${types.join(' & ')}`);
  }
  file.contents = Buffer.from(`${imports}${replacedContent}`);
}

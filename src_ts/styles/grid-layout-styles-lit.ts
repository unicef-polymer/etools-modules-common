import {css, unsafeCSS} from 'lit';

export const gridLayoutStylesContent = `
*[hidden] {
  display: none;
}
.w100 {
  width: 100%;
}

.content-wrapper {
  padding: 16px 24px;
}

.layout-horizontal,
.layout-vertical {
  box-sizing: border-box;
}

.layout-horizontal {
  display: flex;
  flex-direction: row;
}

.layout-vertical,
.col.layout-vertical {
  display: flex;
  flex-direction: column;
}

.layout-wrap {
  flex-wrap: wrap;
}

.row-padding {
  padding: 16px 24px;
}

.row-padding-h {
  padding-inline-start: 24px;
  padding-inline-end: 24px;
}

.row-padding-v {
  padding-top: 8px;
  padding-bottom: 8px;
}

.space-between {
  justify-content: space-between;
}

.align-items-center {
  align-items: center;
}

.row-h {
  display: flex;
  flex-direction: row;
}

.row-v {
  display: flex;
  flex-direction: column;
}

.flex-c {
  /* flex container */
  flex: 1;
}

.row-h,
.row-v {
  padding: 16px 24px;
}

.row-v.t-border,
.row-h.t-border {
  border-top: 1px solid var(--light-divider-color);
}

.row-v.b-border,
.row-h.b-border {
  border-bottom: 1px solid var(--light-divider-color);
}

.row-v.header-row,
.row-h.header-row {
  color: var(--secondary-text-color);
  border-bottom: 1px solid var(--light-divider-color);
  font-weight: 600;
}

.row-v.header-row > .col,
.row-h.header-row > .col {
  line-height: 24px;
}

.table .row-h:not(.header-row) {
  border-top: 1px solid var(--light-divider-color);
}

.table.form-fields .row-h:not(.header-row) {
  padding: 8px 24px;
}

.row-second-bg {
  background-color: var(--light-theme-background-color);
}

.center-align {
  justify-content: center !important;
  align-items: center;
  text-align: center;
}

.right-align {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  text-align: right;
}

.bottom-aligned {
  align-items: flex-end;
}

.no-overflow {
  /* used to prevent flexbox to change it's size if content grows */
  overflow: hidden;
}

.col {
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
}

.col:not(:first-of-type) {
  padding-inline-start: 24px;
}

.col-1 {
  flex: 0 0 8.333333333%;
  max-width: 8.333333333%;
  box-sizing: border-box;
}

.col-2 {
  flex: 0 0 16.66666667%;
  max-width: 16.66666667%;
  box-sizing: border-box;
}

.col-3 {
  flex: 0 0 25%;
  max-width: 25%;
  box-sizing: border-box;
}

.col-4 {
  flex: 0 0 33.333333%;
  max-width: 33.333333%;
  box-sizing: border-box;
}

.col-5 {
  flex: 0 0 41.66666667%;
  max-width: 41.66666667%;
  box-sizing: border-box;
}

.col-6 {
  flex: 0 0 50%;
  max-width: 50%;
  box-sizing: border-box;
}

.col-7 {
  flex: 0 0 58.333333%;
  max-width: 58.333333%;
  box-sizing: border-box;
}

.col-8 {
  flex: 0 0 66.66666667%;
  max-width: 66.66666667%;
  box-sizing: border-box;
}

.col-9 {
  flex: 0 0 75%;
  max-width: 75%;
  box-sizing: border-box;
}

.col-10 {
  flex: 0 0 83.33333333%;
  max-width: 83.33333333%;
  box-sizing: border-box;
}

.col-12 {
  flex: 0 0 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.flex-1 {
  flex: 1;
}
.flex-2 {
  flex: 2;
}
.flex-3 {
  flex: 3;
}
.flex-4 {
  flex: 4;
}
.flex-5 {
  flex: 5;
}
.flex-6 {
  flex: 6;
}
.flex-7 {
  flex: 7;
}
.flex-auto {
  flex: auto;
}
.flex-none {
  flex: none;
}
.flex-fix {
  min-width: 0;
  min-height: 0;
}

`;

// language=CSS
export const gridLayoutStylesLit = css`
  ${unsafeCSS(gridLayoutStylesContent)}
`;

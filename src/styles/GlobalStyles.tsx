import { Global, css } from '@emotion/react';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';

const GlobalStyles = () => (
  <Global
    styles={css`
      @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
      html,
      body,
      div,
      span,
      applet,
      object,
      iframe,
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      p,
      blockquote,
      pre,
      a,
      abbr,
      acronym,
      address,
      big,
      cite,
      code,
      del,
      dfn,
      em,
      img,
      ins,
      kbd,
      q,
      s,
      samp,
      small,
      strike,
      strong,
      sub,
      sup,
      tt,
      var,
      b,
      u,
      i,
      center,
      dl,
      dt,
      dd,
      ol,
      ul,
      li,
      fieldset,
      form,
      label,
      legend,
      table,
      caption,
      tbody,
      tfoot,
      thead,
      tr,
      th,
      td,
      article,
      aside,
      canvas,
      details,
      embed,
      figure,
      figcaption,
      footer,
      header,
      hgroup,
      menu,
      nav,
      output,
      ruby,
      section,
      summary,
      time,
      mark,
      audio,
      video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
      }
      article,
      aside,
      details,
      figcaption,
      figure,
      footer,
      header,
      hgroup,
      menu,
      nav,
      section {
        display: block;
      }
      body {
        line-height: 1;
      }
      ol,
      ul {
        list-style: none;
      }
      blockquote,
      q {
        quotes: none;
      }
      blockquote:before,
      blockquote:after,
      q:before,
      q:after {
        content: '';
        content: none;
      }
      table {
        border-collapse: collapse;
        border-spacing: 0;
      }
      * {
        box-sizing: border-box;
      }
      html {
        width: 100%;
        height: 100%;
        font-size: 10px;
        overflow-y: auto;
      }
      body,
      #root {
        width: 100%;
        height: 100%;
        font-size: ${FONT_SIZE.TEXT_MD};
        font-family: 'Pretendard Variable', Pretendard, 'Malgun Gothic',
          Helvetica, 'Apple SD Gothic Neo', Sans-serif;
        color: ${COLOR.TEXT_BLACK};
      }
      h1 {
        font-size: ${FONT_SIZE.TITLE_XXL};
        font-weight: ${FONT_WEIGHT.BOLD};
      }
      h2 {
        font-size: ${FONT_SIZE.TITLE_XL};
        font-weight: ${FONT_WEIGHT.BOLD};
      }
      h3 {
        font-size: ${FONT_SIZE.TITLE_LG};
        font-weight: ${FONT_WEIGHT.BOLD};
      }
      h4 {
        font-size: ${FONT_SIZE.TITLE_MD};
        font-weight: ${FONT_WEIGHT.BOLD};
      }
      h5 {
        font-size: ${FONT_SIZE.TITLE_SM};
        font-weight: ${FONT_WEIGHT.BOLD};
      }
      h6 {
        font-size: ${FONT_SIZE.TITLE_XS};
        font-weight: ${FONT_WEIGHT.BOLD};
      }
      button {
        font-size: ${FONT_SIZE.TEXT_SM};
      }
      svg {
        color: ${COLOR.BLACK};
      }
    `}
  />
);

export default GlobalStyles;

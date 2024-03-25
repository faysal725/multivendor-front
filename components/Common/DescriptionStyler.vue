<template>
    <div class="py-2">
      <span class="ProseMirror" v-html="text"> </span>
    </div>
  </template>
  
  <script>
  export default {
    props: ["text"],
    data() {
      return {};
    },
  };
  </script>
  
  <style lang="scss" >
  /* Basic editor styles */
  .ProseMirror {
    margin-top: 1rem;
    min-height: 60vh;
  
    > * + * {
      margin-top: 0.75em;
    }
  
    ul,
    ol {
      padding: 0 1rem;
    }
  
    ol {
      list-style-type: upper-roman;
    }
  
    ul {
      list-style-type: circle;
    }
  
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1.1;
    }
  
    h1 {
      font-size: 2rem;
      font-weight: bold;
      color: #00308f;
    }
  
    h2 {
      font-size: 1.8rem;
      font-weight: bold;
      color: #00308f;
    }
  
    h3 {
      font-size: 1.7rem;
      font-weight: bold;
      color: #00308f;
    }
  
    h4 {
      font-size: 1.6rem;
      font-weight: bold;
      color: #00308f;
    }
  
    h5 {
      font-size: 1.5rem;
      font-weight: bold;
      color: #00308f;
    }
  
    h6 {
      font-size: 1.4rem;
      font-weight: bold;
      color: #00308f;
    }
  
    a {
      color: blue;
    }
  
    code {
      background-color: rgba(#616161, 0.1);
      color: #616161;
    }
  
    pre {
      background: #0d0d0d;
      color: #fff;
      font-family: "JetBrainsMono", monospace;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
  
      code {
        color: inherit;
        padding: 0;
        background: none;
        font-size: 0.8rem;
      }
    }
  
    mark {
      background-color: #faf594;
    }
  
    img {
      max-width: 100%;
      height: auto;
    }
  
    blockquote {
      padding-left: 1rem;
      border-left: 2px solid rgba(#0d0d0d, 0.1);
    }
  
    hr {
      border: none;
      border-top: 2px solid rgba(#0d0d0d, 0.1);
      margin: 2rem 0;
    }
  }
  </style>
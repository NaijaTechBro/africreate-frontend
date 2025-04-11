

// globalStyles.ts
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`

  * {
    margin: 0;s
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', sans-serif;
    background-color: ;
    color: ;
    transition: all 0.3s ease;
  }
  
  h1, h2, h;
    font-weight: 700;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  
  section {
    padding: 5rem 0;
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }
  
  a {
    color: ;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: ;
    }
  }
  
  button {
    cursor: pointer;
  }
`;

export default GlobalStyles;
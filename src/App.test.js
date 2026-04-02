import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

test('<App/> renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(React.createElement(App));
});

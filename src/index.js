import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './components/App';
import configureStore from './store';

const store = configureStore();
const container = document.getElementById('app');

if (container) {
  const root = createRoot(container);

  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
} else {
  console.error('Target container is not a DOM element');
}

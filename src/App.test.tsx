import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import App from './App';
import { store } from './store/store';

const mockStore = configureStore();
const mock_store = mockStore(store.getState());

it('renders learn react link', () => {
    // render(
    //     <Provider store={mock_store}>
    //         <App />
    //     </Provider>
    // );
    // const linkElement = screen.getByText(/learn react/i);
    // expect(linkElement).toBeInTheDocument();
});

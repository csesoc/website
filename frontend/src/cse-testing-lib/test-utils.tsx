import React from 'react'
import { Provider } from 'react-redux';
import { GlobalStore } from 'src/redux-state/index';
import {render, queries, RenderOptions} from '@testing-library/react'
import * as customQueries from './custom-queries'
import { BrowserRouter } from 'react-router-dom';

// with redux
const AllTheProviders: React.FC = ({ children }) => {
  return (
    <BrowserRouter>
      <Provider store={GlobalStore}>
        {children}
      </Provider>
    </BrowserRouter>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
) => render(
  ui, {
  queries: {...queries, ...customQueries},
  wrapper: AllTheProviders,
  ...options
})

export * from '@testing-library/react'
export {customRender as render}
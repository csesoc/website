import { queryHelpers, buildQueries, GetAllBy } from '@testing-library/react'

// The queryAllByAttribute is a shortcut for attribute-based matchers
// You can also use document.querySelector or a combination of existing
// testing library utilities to find matching nodes for your query

const queryAllByDataAnchor: GetAllBy<[dataAnchorValue: any]> = (...args: any[]) => {
  // @ts-ignore
  return queryHelpers.queryAllByAttribute('data-anchor', ...args)
}

const getMultipleError = (c: HTMLElement, dataAnchorValue: any) =>
  `Found multiple elements with the data-anchor attribute of: ${dataAnchorValue}`
const getMissingError = (c: HTMLElement, dataAnchorValue: any) =>
  `Unable to find an element with the data-anchor attribute of: ${dataAnchorValue}`

const [
  queryByDataAnchor,
  getAllByDataAnchor,
  getByDataAnchor,
  findAllByDataAnchor,
  findByDataAnchor,
] = buildQueries(queryAllByDataAnchor, getMultipleError, getMissingError)

export {
  queryByDataAnchor,
  queryAllByDataAnchor,
  getByDataAnchor,
  getAllByDataAnchor,
  findAllByDataAnchor,
  findByDataAnchor,
}
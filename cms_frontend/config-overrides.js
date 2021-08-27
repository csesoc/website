const {alias} = require('react-app-rewire-alias')

module.exports = function override(config) {
  alias({
    '@components': 'src/components',
    '@assets' : 'src/assets',
    '@pages' : 'src/pages',
    '@css' : 'src/css'
  })(config)

  return config
}
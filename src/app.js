
import * as guiHtml from './lib/views/gui.html'

import './lib/styles/index.scss'
document.body.style.touchAction = 'none'
document.body.insertAdjacentHTML('afterbegin', guiHtml)

import { CubeEnvMap } from './lib/components/cube-env-map'
import { TeleportMove } from './lib/components/drag-move'

import './lib/components/terrainloader.js';
import './lib/components/terrain-model.js'

const projectComponents = {
  'cube-envmap': CubeEnvMap,
  'drag-move': TeleportMove
}

const registerComponents = components =>
  Object.keys(components).forEach(name => {
    if (!AFRAME.components[name]) {
      AFRAME.registerComponent(name, components[name])
    }
  })

registerComponents(projectComponents)
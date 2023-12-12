
import * as guiHtml from './lib/views/gui.html'

import './lib/styles/index.scss'
document.body.style.touchAction = 'none'
document.body.insertAdjacentHTML('afterbegin', guiHtml)

// import { ComponentName } from './lib/components/project/component-name'
const projectComponents = {
  //'coponent-name': ComponentName
}

const registerComponents = components =>
  Object.keys(components).map(k =>
    AFRAME.registerComponent(k, components[k]))
registerComponents(projectComponents)
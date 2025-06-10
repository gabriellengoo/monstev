export const CubeEnvMap = {
  init: function () {
    const sceneEl = this.el.sceneEl;
    const renderer = sceneEl.renderer;
    const loader = new THREE.CubeTextureLoader();
    loader.setPath('/assets/textures/skybox/');

    const texture = loader.load([
      'posx.png', 'negx.png',
      'posy.png', 'negy.png',
      'posz.png', 'negz.png'
    ]);

    sceneEl.object3D.background = texture;
  }
}
export const TeleportMove = {
        schema: {
          speed: { type: "number", default: 500 }, // Animation duration in ms
          minX: { type: "number", default: -10 }, // Rectangular perimeter boundaries
          maxX: { type: "number", default: 10 },
          minZ: { type: "number", default: -10 },
          maxZ: { type: "number", default: 10 },
          perimeterType: { type: "string", default: "rectangle" }, // "rectangle" or "circle"
          maxRadius: { type: "number", default: 10 }, // For circular perimeter
        },

        init: function () {
          this.raycaster = new THREE.Raycaster();
          this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Plane at y=0
          this.intersection = new THREE.Vector3();
          this.isAnimating = false;

          // Bind event listener
          this.onMouseDown = this.onMouseDown.bind(this);

          // Delay canvas setup to ensure scene is ready
          this.canvasReady = false;
          this.tick = function () {
            if (!this.canvasReady && this.el.sceneEl.canvas) {
              this.canvasReady = true;
              const canvas = this.el.sceneEl.canvas;
              console.log("Attaching event listeners to canvas");
              canvas.addEventListener("mousedown", this.onMouseDown);
            }
          };
        },

        onMouseDown: function (event) {
          if (this.isAnimating) return; // Prevent new teleport during animation
          event.preventDefault();

          // Get camera
          const cameraEl = this.el.querySelector("a-camera");
          if (!cameraEl) {
            console.error("No <a-camera> found inside the rig.");
            return;
          }
          const camera = cameraEl.getObject3D("camera");
          if (!camera) {
            console.error("Camera object3D not found.");
            return;
          }

          // Calculate mouse position in normalized device coordinates
          const rect = this.el.sceneEl.canvas.getBoundingClientRect();
          const mouse = new THREE.Vector2();
          mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

          console.log("Mouse down at:", { x: event.clientX, y: event.clientY });

          // Cast ray
          this.raycaster.setFromCamera(mouse, camera);
          if (this.raycaster.ray.intersectPlane(this.plane, this.intersection)) {
            let targetPosition = {
              x: this.intersection.x,
              y: this.el.getAttribute("position").y, // Preserve Y
              z: this.intersection.z,
            };

            // Apply perimeter constraints
            if (this.data.perimeterType === "rectangle") {
              targetPosition.x = Math.max(this.data.minX, Math.min(this.data.maxX, targetPosition.x));
              targetPosition.z = Math.max(this.data.minZ, Math.min(this.data.maxZ, targetPosition.z));
            } else if (this.data.perimeterType === "circle") {
              const distance = Math.sqrt(targetPosition.x ** 2 + targetPosition.z ** 2);
              if (distance > this.data.maxRadius) {
                const scale = this.data.maxRadius / distance;
                targetPosition.x *= scale;
                targetPosition.z *= scale;
              }
            }

            console.log("Target position:", {
              x: targetPosition.x.toFixed(4),
              y: targetPosition.y.toFixed(4),
              z: targetPosition.z.toFixed(4),
            });

            // Create animation
            const animation = document.createElement("a-animation");
            animation.setAttribute("attribute", "position");
            animation.setAttribute("to", `${targetPosition.x} ${targetPosition.y} ${targetPosition.z}`);
            animation.setAttribute("dur", this.data.speed);
            animation.setAttribute("easing", "ease-in-out");
            this.el.appendChild(animation);

            // Track animation state
            this.isAnimating = true;
            animation.addEventListener("animationend", () => {
              this.isAnimating = false;
              this.el.removeChild(animation);
              const appliedPosition = this.el.getAttribute("position");
              console.log("Applied position:", {
                x: appliedPosition.x.toFixed(4),
                y: appliedPosition.y.toFixed(4),
                z: appliedPosition.z.toFixed(4),
              });
            });

            // Fallback: Directly set position to ensure update
            this.el.object3D.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
          } else {
            console.log("No intersection with plane.");
          }
        },

        remove: function () {
          const canvas = this.el.sceneEl.canvas;
          if (canvas) {
            canvas.removeEventListener("mousedown", this.onMouseDown);
          }
        },
      };
(function () {
  var wrap = document.getElementById('cursor3d');
  var canvas = document.getElementById('cursor3dCanvas');
  if (!wrap || !canvas) return;

  // Skip on touch / small screens (no real cursor to follow)
  if (window.matchMedia('(hover: none)').matches || window.innerWidth <= 768) return;

  var started = false;

  async function init() {
    if (started) return;
    started = true;

    var THREE, GLTFLoader;
    try {
      THREE = await import('three');
      ({ GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js'));
    } catch (e) { return; }

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    } catch (e) { wrap.style.display = 'none'; return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    var SIZE = wrap.clientWidth || 55;
    renderer.setSize(SIZE, SIZE, false);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.01, 5000);

    scene.add(new THREE.AmbientLight(0xffffff, 0.95));
    var key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(2, 4, 5); scene.add(key);
    var rim = new THREE.DirectionalLight(0xfff2a8, 0.6); rim.position.set(-3, -2, -4); scene.add(rim);

    // pivot = click spin + bounce (animated by GSAP); spinner = continuous idle rotation
    var pivot = new THREE.Group();
    var spinner = new THREE.Group();
    pivot.add(spinner);
    scene.add(pivot);

    new GLTFLoader().load('assets/models/cursor-companion.glb', function (gltf) {
      var obj = gltf.scene;
      var box = new THREE.Box3().setFromObject(obj);
      var ctr = box.getCenter(new THREE.Vector3());
      var sz = box.getSize(new THREE.Vector3());
      obj.position.sub(ctr);
      spinner.add(obj);

      var maxd = Math.max(sz.x, sz.y, sz.z) || 1;
      var dist = (maxd / (2 * Math.tan((Math.PI * 45) / 360))) * 1.45;
      camera.position.set(0, 0, dist);
      camera.near = dist / 100; camera.far = dist * 100; camera.updateProjectionMatrix();
      camera.lookAt(0, 0, 0);

      loaded = true;
      wrap.classList.add('is-ready');
      document.body.classList.add('cursor3d-active'); // the model replaces the native cursor
      start();
    }, undefined, function () { wrap.style.display = 'none'; });

    // --- pointer follow (smooth trailing) ---
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var px = mx, py = my;
    var half = SIZE / 2, offset = 0; // centered on the pointer — it *is* the cursor
    var loaded = false;
    window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    // Pointer left the window: show the model/cursor only inside the page
    window.addEventListener('mouseout', function (e) {
      if (!e.relatedTarget && !e.toElement) {
        wrap.classList.remove('is-ready');
        document.body.classList.remove('cursor3d-active');
      }
    });
    window.addEventListener('mouseover', function () {
      if (started && loaded) {
        wrap.classList.add('is-ready');
        document.body.classList.add('cursor3d-active');
      }
    });

    // --- click: bounce + two fast spins ---
    var gsap = window.gsap;
    document.addEventListener('click', function () {
      if (reduce) return;
      if (gsap) {
        gsap.to(pivot.rotation, { y: pivot.rotation.y + Math.PI * 4, duration: 0.65, ease: 'power2.out', overwrite: true });
        gsap.to(pivot.scale, { x: 1.35, y: 1.35, z: 1.35, duration: 0.16, ease: 'power2.out', yoyo: true, repeat: 1, overwrite: true });
      } else {
        spinTo = pivot.rotation.y + Math.PI * 4; // fallback handled in loop
      }
    });
    var spinTo = null;

    var raf = null, last = 0;
    function loop(t) {
      raf = requestAnimationFrame(loop);
      var dt = last ? Math.min((t - last) / 1000, 0.05) : 0.016; last = t;

      // follow the pointer (slight smoothing so it feels alive, but tight enough to act as the cursor)
      px += (mx - px) * 0.3; py += (my - py) * 0.3;
      wrap.style.transform = 'translate(' + (px - half + offset) + 'px,' + (py - half + offset) + 'px)';

      // idle spin
      if (!reduce) spinner.rotation.y += dt * 0.6;

      // gsap-less click fallback
      if (spinTo !== null) {
        pivot.rotation.y += (spinTo - pivot.rotation.y) * 0.2;
        if (Math.abs(spinTo - pivot.rotation.y) < 0.01) { pivot.rotation.y = spinTo; spinTo = null; }
      }

      renderer.render(scene, camera);
    }
    function start() { if (!raf) { last = 0; raf = requestAnimationFrame(loop); } }

    // pause render when tab hidden
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = null; } }
      else start();
    });
  }

  // Defer the heavy (61MB) load until the page is idle and the user moves the pointer
  function kick() {
    window.removeEventListener('mousemove', kick);
    init();
  }
  window.addEventListener('load', function () {
    var idle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 1200); };
    idle(function () { window.addEventListener('mousemove', kick, { passive: true, once: true }); });
  });
})();

import { Asset, Entity, BoundingBox, Color, Script, Vec3, MiniStats } from 'playcanvas';

document.addEventListener('DOMContentLoaded', async () => {
//    const position = new Vec3([-0.5216721296310425, 1.8032106161117554, 0.8622002005577087]);
    const position = new Vec3([0, 0, 0]);
    const target = new Vec3([0, 1.4649281998059114, 0]);

    const appElement = await document.querySelector('pc-app').ready();
    const app = await appElement.app;

    const cameraEntityElement = await document.querySelector('pc-entity[name="camera"]').ready();
    const cameraEntity = cameraEntityElement.entity;
    cameraEntity.camera.clearColor = new Color([0.8862745098039215, 0.9529411764705882, 0.9725490196078431]);
    cameraEntity.camera.fov = 80;
    cameraEntity.camera.nearClip = 0.00001;

    class FrameScene extends Script {

        resetCamera(bbox) {
            this.entity.script.cameraControls.focus(target, position);
        }

        calcBound() {
            const gsplatComponents = this.app.root.findComponents('gsplat');
            return gsplatComponents?.[0]?.instance?.meshInstance?.aabb ?? new BoundingBox();
        }

        initCamera() {
            const cameraControls = window.cameraControls = this.entity.script.cameraControls;
            cameraControls.sceneSize = 5;
            cameraControls.lookSensitivity  = 0.1;
            cameraControls.moveSpeed = 0.1;
            cameraControls.moveFastSpeed = 0.2;
            cameraControls.moveSlowSpeed = 0.05;
            cameraControls.moveDamping = 0.98;
            cameraControls.rotateSpeed = 0.35;
            cameraControls.rotateDamping = 0.99;
            cameraControls.zoomDamping = window.isMobile ? 0.995 : 0.98;
            cameraControls.focusDamping = 0.995
            cameraControls.zoomMax = 1
            cameraControls.zoomPinchSens = 15

            cameraControls.on('clamp:position', (position) => {
                const xz_dist = Math.sqrt(position.x ** 2 + position.z ** 2);
                if (xz_dist > 5) {
                    position.x  = position.x / xz_dist * 5;
                    position.z  = position.z / xz_dist * 5;
                }
                position.y = Math.min(Math.max(0.1, position.y), 4);
            });

            cameraControls.on('clamp:angles', (angles) => {
                angles.x = Math.max(-90, Math.min(90, angles.x));
            });

            const bbox = this.calcBound();
            this.resetCamera(bbox);
            cameraControls._spinning = true

            window.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'r':
                        this.resetCamera(bbox);
                        break;
                }
            });
        }

        postInitialize() {
            this.initCamera();
        }
    }

    const asset = new Asset(null, 'gsplat', {url: 'data/meta.json'}, null, {
        mapUrl: mapUrl => {
            return 'data/' + mapUrl; // for fetching *.webp files
        }
    });
    app.assets.add(asset);
    app.assets.load(asset);
    asset.on('load', () => {
        const gsplatEntity = new Entity();
        gsplatEntity.addComponent('gsplat', { asset });
        gsplatEntity.gsplat.material.setDefine('GSPLAT_AA', true);
        gsplatEntity.gsplat.highQualitySH = true;
        gsplatEntity.setEulerAngles(0, 0, 180);
        app.root.addChild(gsplatEntity);

        cameraEntity.script.create(FrameScene);
    });

    const dom = ['info', 'infoPanel'].reduce((acc, id) => {
        acc[id] = document.getElementById(id);
        return acc;
    }, {});
    dom.info.addEventListener('click', () => {
        dom.infoPanel.classList.toggle('hidden');
    });
});

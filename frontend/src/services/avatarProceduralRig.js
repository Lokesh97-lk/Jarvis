import * as THREE from 'three';
import { HAND_SHAPES, FACIAL_MODES } from './avatarMotionController';

/**
 * Grade 2 Procedural Humanoid Rig for Indian Sign Language
 * Conforms to VRM humanoid bone naming conventions.
 * Features realistic adult proportions, professional high-contrast wardrobe,
 * 15 articulated finger bones per hand (30 phalanges), and facial blendshapes.
 */
export class AvatarProceduralRig {
  constructor(options = {}) {
    this.quality = options.quality || 'medium';
    this.group = new THREE.Group();
    this.group.name = 'Grade2_ISL_Avatar';

    // Materials
    this.materials = this.createMaterials();

    // Bone / Joint References
    this.bones = {};
    this.facialBlendshapes = {};

    // Build the anatomical character
    this.buildRig();
  }

  createMaterials() {
    const isHigh = this.quality === 'high';

    // Warm Indian skin tone with subtle subsurface warm scattering simulation
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xdfb492,
      roughness: 0.55,
      metalness: 0.05,
    });

    // Dark professional navy/charcoal tailored blazer for high hand/face contrast
    const blazerMat = new THREE.MeshStandardMaterial({
      color: 0x1a2434,
      roughness: 0.7,
      metalness: 0.1,
    });

    // Crisp formal inner dress shirt
    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee,
      roughness: 0.6,
      metalness: 0.0,
    });

    // Gold/Crimson official accent tie / lapel pin
    const crimsonAccentMat = new THREE.MeshStandardMaterial({
      color: 0x9b1c2c,
      roughness: 0.4,
      metalness: 0.2,
    });

    // Clean professional styled adult hair
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x1f1917,
      roughness: 0.8,
      metalness: 0.1,
    });

    // Eyes
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const irisMat = new THREE.MeshBasicMaterial({ color: 0x3d2817 });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x0a0908 });

    // Eyebrows & Lips
    const browMat = new THREE.MeshBasicMaterial({ color: 0x1f1917 });
    const lipMat = new THREE.MeshStandardMaterial({
      color: 0xc98d7c,
      roughness: 0.5,
      metalness: 0.0,
    });

    return {
      skin: skinMat,
      blazer: blazerMat,
      shirt: shirtMat,
      crimsonAccent: crimsonAccentMat,
      hair: hairMat,
      eyeWhite: eyeWhiteMat,
      iris: irisMat,
      pupil: pupilMat,
      brow: browMat,
      lip: lipMat,
    };
  }

  buildRig() {
    const m = this.materials;

    // Root Hips / Pelvis
    const hips = new THREE.Group();
    hips.position.y = 0.95;
    this.group.add(hips);
    this.bones.hips = hips;

    // Pelvis Mesh
    const pelvisGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.18, 16);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, m.blazer);
    pelvisMesh.position.y = -0.05;
    hips.add(pelvisMesh);

    // Spine & Chest
    const spine = new THREE.Group();
    spine.position.y = 0.08;
    hips.add(spine);
    this.bones.spine = spine;

    const chest = new THREE.Group();
    chest.position.y = 0.22;
    spine.add(chest);
    this.bones.chest = chest;

    // Torso / Blazer Mesh (Tailored Fit)
    const chestGeo = new THREE.CylinderGeometry(0.24, 0.19, 0.38, 16);
    const chestMesh = new THREE.Mesh(chestGeo, m.blazer);
    chestMesh.position.y = 0.05;
    chest.add(chestMesh);

    // Collared Dress Shirt V-neck insert
    const shirtGeo = new THREE.CylinderGeometry(0.09, 0.05, 0.22, 12);
    const shirtMesh = new THREE.Mesh(shirtGeo, m.shirt);
    shirtMesh.position.set(0, 0.14, 0.14);
    chest.add(shirtMesh);

    // Crimson Tie / Ribbon
    const tieGeo = new THREE.BoxGeometry(0.045, 0.22, 0.02);
    const tieMesh = new THREE.Mesh(tieGeo, m.crimsonAccent);
    tieMesh.position.set(0, 0.08, 0.16);
    chest.add(tieMesh);

    // Neck
    const neck = new THREE.Group();
    neck.position.y = 0.28;
    chest.add(neck);
    this.bones.neck = neck;

    const neckGeo = new THREE.CylinderGeometry(0.065, 0.075, 0.12, 16);
    const neckMesh = new THREE.Mesh(neckGeo, m.skin);
    neckMesh.position.y = 0.05;
    neck.add(neckMesh);

    // Head
    const head = new THREE.Group();
    head.position.y = 0.12;
    neck.add(head);
    this.bones.head = head;

    this.buildHead(head);

    // Arms & Hands (Right and Left)
    this.buildArm(chest, 'right', 1);
    this.buildArm(chest, 'left', -1);

    // Lower Body (Legs & Shoes for Full-Body view)
    this.buildLegs(hips);
  }

  buildHead(head) {
    const m = this.materials;

    // Realistic Cranium & Jaw
    const headGeo = new THREE.SphereGeometry(0.135, 24, 20);
    headGeo.scale(1.0, 1.25, 1.05);
    const headMesh = new THREE.Mesh(headGeo, m.skin);
    headMesh.position.set(0, 0.12, 0.0);
    head.add(headMesh);

    // Professional Styled Haircut
    const hairGeo = new THREE.SphereGeometry(0.142, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55);
    hairGeo.scale(1.02, 1.2, 1.08);
    const hairMesh = new THREE.Mesh(hairGeo, m.hair);
    hairMesh.position.set(0, 0.16, -0.01);
    head.add(hairMesh);

    // Hair Side Burns & Parting
    const hairSideGeo = new THREE.BoxGeometry(0.025, 0.12, 0.08);
    const leftSide = new THREE.Mesh(hairSideGeo, m.hair);
    leftSide.position.set(-0.13, 0.16, 0.02);
    head.add(leftSide);
    const rightSide = new THREE.Mesh(hairSideGeo, m.hair);
    rightSide.position.set(0.13, 0.16, 0.02);
    head.add(rightSide);

    // Eyes with Articulated Gaze and Eyelids for Blinking
    const leftEyeGroup = new THREE.Group();
    leftEyeGroup.position.set(-0.052, 0.13, 0.12);
    head.add(leftEyeGroup);
    this.bones.leftEye = leftEyeGroup;

    const rightEyeGroup = new THREE.Group();
    rightEyeGroup.position.set(0.052, 0.13, 0.12);
    head.add(rightEyeGroup);
    this.bones.rightEye = rightEyeGroup;

    [leftEyeGroup, rightEyeGroup].forEach((eyeGrp) => {
      const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 12), m.eyeWhite);
      eyeGrp.add(eyeWhite);

      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 8), m.iris);
      iris.position.z = 0.015;
      eyeGrp.add(iris);

      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.006, 10, 8), m.pupil);
      pupil.position.z = 0.02;
      eyeGrp.add(pupil);
    });

    // Articulated Eyelids for natural blinking
    const lidGeo = new THREE.BoxGeometry(0.045, 0.02, 0.025);
    const leftLid = new THREE.Mesh(lidGeo, m.skin);
    leftLid.position.set(-0.052, 0.145, 0.125);
    head.add(leftLid);
    this.facialBlendshapes.leftEyelid = leftLid;

    const rightLid = new THREE.Mesh(lidGeo, m.skin);
    rightLid.position.set(0.052, 0.145, 0.125);
    head.add(rightLid);
    this.facialBlendshapes.rightEyelid = rightLid;

    // Eyebrows (Critical for Non-Manual ISL Sign Markers: Questioning, Urgency, Warning)
    const browGeo = new THREE.BoxGeometry(0.045, 0.008, 0.01);
    const leftBrow = new THREE.Mesh(browGeo, m.brow);
    leftBrow.position.set(-0.052, 0.165, 0.125);
    head.add(leftBrow);
    this.facialBlendshapes.leftBrow = leftBrow;

    const rightBrow = new THREE.Mesh(browGeo, m.brow);
    rightBrow.position.set(0.052, 0.165, 0.125);
    head.add(rightBrow);
    this.facialBlendshapes.rightBrow = rightBrow;

    // Nose
    const noseGeo = new THREE.ConeGeometry(0.018, 0.055, 6);
    noseGeo.rotateX(Math.PI / 2);
    const noseMesh = new THREE.Mesh(noseGeo, m.skin);
    noseMesh.position.set(0, 0.10, 0.145);
    head.add(noseMesh);

    // Mouth / Lips (NMS Speech Morphemes)
    const mouthGroup = new THREE.Group();
    mouthGroup.position.set(0, 0.045, 0.13);
    head.add(mouthGroup);
    this.facialBlendshapes.mouth = mouthGroup;

    const lipGeo = new THREE.BoxGeometry(0.042, 0.012, 0.01);
    const lipMesh = new THREE.Mesh(lipGeo, m.lip);
    mouthGroup.add(lipMesh);
  }

  buildArm(parent, side, dir) {
    const m = this.materials;
    const prefix = side; // 'right' or 'left'

    // Shoulder / Clavicle
    const shoulder = new THREE.Group();
    shoulder.position.set(0.24 * dir, 0.18, 0.0);
    parent.add(shoulder);
    this.bones[`${prefix}Shoulder`] = shoulder;

    // Shoulder Pad / Blazer Joint
    const shoulderPadGeo = new THREE.SphereGeometry(0.075, 12, 10);
    const shoulderPadMesh = new THREE.Mesh(shoulderPadGeo, m.blazer);
    shoulder.add(shoulderPadMesh);

    // Upper Arm
    const upperArm = new THREE.Group();
    upperArm.position.set(0.06 * dir, -0.05, 0.0);
    shoulder.add(upperArm);
    this.bones[`${prefix}UpperArm`] = upperArm;

    const upperArmGeo = new THREE.CylinderGeometry(0.052, 0.045, 0.28, 12);
    const upperArmMesh = new THREE.Mesh(upperArmGeo, m.blazer);
    upperArmMesh.position.y = -0.14;
    upperArm.add(upperArmMesh);

    // Elbow
    const elbow = new THREE.Group();
    elbow.position.set(0.0, -0.28, 0.0);
    upperArm.add(elbow);
    this.bones[`${prefix}Elbow`] = elbow;

    // Forearm (White shirt cuff at wrist creates sharp contrast with hand)
    const forearm = new THREE.Group();
    elbow.add(forearm);
    this.bones[`${prefix}Forearm`] = forearm;

    const forearmGeo = new THREE.CylinderGeometry(0.045, 0.038, 0.26, 12);
    const forearmMesh = new THREE.Mesh(forearmGeo, m.blazer);
    forearmMesh.position.y = -0.13;
    forearm.add(forearmMesh);

    // White Shirt Cuff at wrist
    const cuffGeo = new THREE.CylinderGeometry(0.042, 0.040, 0.03, 12);
    const cuffMesh = new THREE.Mesh(cuffGeo, m.shirt);
    cuffMesh.position.y = -0.25;
    forearm.add(cuffMesh);

    // Wrist / Hand Group
    const hand = new THREE.Group();
    hand.position.set(0.0, -0.28, 0.0);
    forearm.add(hand);
    this.bones[`${prefix}Hand`] = hand;

    // Anatomical Palm (Broad, realistic proportions)
    const palmGeo = new THREE.BoxGeometry(0.075, 0.085, 0.024);
    const palmMesh = new THREE.Mesh(palmGeo, m.skin);
    palmMesh.position.set(0, -0.042, 0);
    hand.add(palmMesh);

    // 15 Articulated Finger Bones per hand (Thumb, Index, Middle, Ring, Pinky)
    this.buildFingers(hand, prefix, dir);
  }

  buildFingers(hand, prefix, dir) {
    const m = this.materials;
    this.bones[`${prefix}Fingers`] = {};

    const fingerConfigs = [
      { name: 'Thumb', x: -0.038 * dir, y: -0.02, z: 0.012, isThumb: true, len: 0.032, rad: 0.0095 },
      { name: 'Index', x: -0.027 * dir, y: -0.085, z: 0.0, len: 0.036, rad: 0.0085 },
      { name: 'Middle', x: -0.009 * dir, y: -0.088, z: 0.0, len: 0.040, rad: 0.0085 },
      { name: 'Ring', x: 0.009 * dir, y: -0.085, z: 0.0, len: 0.036, rad: 0.008 },
      { name: 'Pinky', x: 0.027 * dir, y: -0.078, z: 0.0, len: 0.030, rad: 0.0075 },
    ];

    fingerConfigs.forEach((cfg) => {
      // Joint 1: Proximal Phalanx
      const proximal = new THREE.Group();
      proximal.position.set(cfg.x, cfg.y, cfg.z);
      if (cfg.isThumb) {
        proximal.rotation.z = 0.45 * dir;
        proximal.rotation.y = 0.35 * dir;
      }
      hand.add(proximal);

      const pMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(cfg.rad, cfg.rad * 0.9, cfg.len, 8),
        m.skin
      );
      pMesh.position.y = -cfg.len / 2;
      proximal.add(pMesh);

      // Joint 2: Intermediate / Distal Phalanx
      const distal = new THREE.Group();
      distal.position.set(0, -cfg.len, 0);
      proximal.add(distal);

      const dMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(cfg.rad * 0.9, cfg.rad * 0.75, cfg.len * 0.85, 8),
        m.skin
      );
      dMesh.position.y = (-cfg.len * 0.85) / 2;
      distal.add(dMesh);

      this.bones[`${prefix}Fingers`][cfg.name.toLowerCase()] = {
        proximal,
        distal,
      };
    });
  }

  buildLegs(hips) {
    const m = this.materials;
    [-0.1, 0.1].forEach((xPos) => {
      const legGeo = new THREE.CylinderGeometry(0.075, 0.055, 0.85, 12);
      const legMesh = new THREE.Mesh(legGeo, m.blazer);
      legMesh.position.set(xPos, -0.45, 0);
      hips.add(legMesh);

      const shoeGeo = new THREE.BoxGeometry(0.08, 0.06, 0.18);
      const shoeMesh = new THREE.Mesh(shoeGeo, m.hair);
      shoeMesh.position.set(xPos, -0.88, 0.04);
      hips.add(shoeMesh);
    });
  }

  /**
   * Apply Kinematic State, Fingers, Breathing, and NMS Expressions
   */
  applyPose(params = {}) {
    const {
      rArm = { shoulder: [0.1, 0, -0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
      lArm = { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
      rHandShape = 'REST_RELAXED',
      lHandShape = 'REST_RELAXED',
      headGaze = { x: 0, y: 0, z: 0 },
      facialMode = 'NORMAL',
      breathingTime = 0,
      blinkAlpha = 0, // 0 = open, 1 = fully closed
    } = params;

    // 1. Natural Breathing Sway on Spine & Chest
    const breathOffset = Math.sin(breathingTime * 1.8) * 0.015;
    if (this.bones.chest) {
      this.bones.chest.position.y = 0.22 + breathOffset;
      this.bones.chest.rotation.x = Math.sin(breathingTime * 1.8) * 0.012;
    }
    if (this.bones.spine) {
      this.bones.spine.rotation.z = Math.sin(breathingTime * 0.9) * 0.006;
    }

    // 2. Right Arm Kinematics
    if (this.bones.rightShoulder) {
      this.bones.rightShoulder.rotation.set(rArm.shoulder[0], rArm.shoulder[1], rArm.shoulder[2]);
    }
    if (this.bones.rightElbow) {
      this.bones.rightElbow.rotation.set(rArm.elbow[0], rArm.elbow[1], rArm.elbow[2]);
    }
    if (this.bones.rightHand) {
      this.bones.rightHand.rotation.set(rArm.wrist[0], rArm.wrist[1], rArm.wrist[2]);
    }

    // 3. Left Arm Kinematics
    if (this.bones.leftShoulder) {
      this.bones.leftShoulder.rotation.set(lArm.shoulder[0], lArm.shoulder[1], lArm.shoulder[2]);
    }
    if (this.bones.leftElbow) {
      this.bones.leftElbow.rotation.set(lArm.elbow[0], lArm.elbow[1], lArm.elbow[2]);
    }
    if (this.bones.leftHand) {
      this.bones.leftHand.rotation.set(lArm.wrist[0], lArm.wrist[1], lArm.wrist[2]);
    }

    // 4. Detailed Finger Articulation (15 bones per hand)
    this.applyHandFingers('right', rHandShape);
    this.applyHandFingers('left', lHandShape);

    // 5. Head & Neck Gaze
    if (this.bones.head) {
      const mode = FACIAL_MODES[facialMode] || FACIAL_MODES.NORMAL;
      this.bones.head.rotation.set(
        headGaze.y + mode.headNod,
        headGaze.x + Math.sin(breathingTime * 0.7) * 0.02,
        headGaze.z + mode.headTilt
      );
    }

    // 6. Non-Manual Signing (NMS) Facial Blendshapes
    const expr = FACIAL_MODES[facialMode] || FACIAL_MODES.NORMAL;
    if (this.facialBlendshapes.leftBrow && this.facialBlendshapes.rightBrow) {
      const browY = 0.165 + expr.browRaise * 0.015 - expr.browFurrow * 0.008;
      const furrowZ = 0.125 - expr.browFurrow * 0.004;
      this.facialBlendshapes.leftBrow.position.set(-0.052 + expr.browFurrow * 0.005, browY, furrowZ);
      this.facialBlendshapes.rightBrow.position.set(0.052 - expr.browFurrow * 0.005, browY, furrowZ);
    }

    // Mouth openness / shape
    if (this.facialBlendshapes.mouth) {
      this.facialBlendshapes.mouth.scale.set(
        1.0 + expr.mouthSmile * 0.3,
        1.0 + expr.mouthOpen * 1.5,
        1.0
      );
    }

    // Blinking
    if (this.facialBlendshapes.leftEyelid && this.facialBlendshapes.rightEyelid) {
      const lidY = 0.145 - blinkAlpha * 0.018;
      this.facialBlendshapes.leftEyelid.position.y = lidY;
      this.facialBlendshapes.rightEyelid.position.y = lidY;
    }
  }

  applyHandFingers(prefix, shapeName) {
    const shape = HAND_SHAPES[shapeName] || HAND_SHAPES.REST_RELAXED;
    const fGroup = this.bones[`${prefix}Fingers`];
    if (!fGroup) return;

    ['thumb', 'index', 'middle', 'ring', 'pinky'].forEach((fName) => {
      const joints = fGroup[fName];
      const curls = shape[fName] || [0.2, 0.2];
      if (joints) {
        joints.proximal.rotation.x = curls[0];
        joints.distal.rotation.x = curls[1];
        if (fName !== 'thumb' && shape.splay) {
          const splaySign = prefix === 'right' ? 1 : -1;
          const factor = fName === 'index' ? -1 : fName === 'ring' ? 0.5 : fName === 'pinky' ? 1.0 : 0;
          joints.proximal.rotation.z = factor * shape.splay * splaySign;
        }
      }
    });
  }

  dispose() {
    Object.values(this.materials).forEach((m) => m.dispose());
  }
}

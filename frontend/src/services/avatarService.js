/**
 * 3D Avatar Kinematic Controller & VRM Service
 * Controls humanoid avatar bones, finger articulation, NMS facial expressions,
 * and smooth sign sequence playback transitions.
 */

import { 
  ISL_MOTION_LIBRARY, 
  resolveMotionPrimitive, 
  cubicEaseInOut,
  FACIAL_MODES,
  validateJointLimits 
} from './avatarMotionController';

export class AvatarService {
  constructor() {
    this.status = 'READY'; // 'IDLE', 'LOADING', 'READY', 'SIGNING', 'PAUSED', 'COMPLETED', 'ERROR', 'NO_MOTION_AVAILABLE'
    this.currentModel = 'avatar_aadya_grade2.vrm';
    this.playbackSpeed = 1.0;
    this.isPlaying = false;
    this.activeSignIndex = 0;
    this.signSequence = [];
    this.transitionTime = 0.25; // seconds
    this.listeners = {
      signChange: [],
      statusChange: [],
      playbackEnd: [],
      poseUpdate: [],
    };

    // Interpolation state
    this.prevPose = ISL_MOTION_LIBRARY.REST;
    this.targetPose = ISL_MOTION_LIBRARY.REST;
    this.poseProgress = 0.0;
  }

  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
    return () => {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    };
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error(`[AvatarService] Listener error on ${event}:`, err);
        }
      });
    }
  }

  setStatus(newStatus) {
    this.status = newStatus;
    this.emit('statusChange', { status: newStatus });
  }

  loadSequence(signs) {
    this.signSequence = signs || [];
    this.activeSignIndex = 0;
    this.prevPose = ISL_MOTION_LIBRARY.REST;
    if (this.signSequence.length > 0) {
      this.targetPose = resolveMotionPrimitive(this.signSequence[0].gloss);
      this.setStatus('READY');
    } else {
      this.targetPose = ISL_MOTION_LIBRARY.REST;
      this.setStatus('IDLE');
    }
    this.poseProgress = 0.0;
  }

  play() {
    if (!this.signSequence.length) {
      this.setStatus('NO_MOTION_AVAILABLE');
      return;
    }
    this.isPlaying = true;
    this.setStatus('SIGNING');
  }

  pause() {
    this.isPlaying = false;
    this.setStatus('PAUSED');
  }

  resume() {
    if (this.signSequence.length > 0) {
      this.isPlaying = true;
      this.setStatus('SIGNING');
    }
  }

  restart() {
    this.activeSignIndex = 0;
    this.prevPose = ISL_MOTION_LIBRARY.REST;
    if (this.signSequence.length > 0) {
      this.targetPose = resolveMotionPrimitive(this.signSequence[0].gloss);
    }
    this.poseProgress = 0.0;
    this.isPlaying = true;
    this.setStatus('SIGNING');
  }

  resetPose() {
    this.isPlaying = false;
    this.activeSignIndex = 0;
    this.prevPose = ISL_MOTION_LIBRARY.REST;
    this.targetPose = ISL_MOTION_LIBRARY.REST;
    this.poseProgress = 1.0;
    this.setStatus('READY');
  }

  skipNext() {
    if (this.activeSignIndex < this.signSequence.length - 1) {
      this.prevPose = this.targetPose;
      this.activeSignIndex++;
      this.targetPose = resolveMotionPrimitive(this.signSequence[this.activeSignIndex].gloss);
      this.poseProgress = 0.0;
      this.emit('signChange', {
        index: this.activeSignIndex,
        sign: this.signSequence[this.activeSignIndex],
      });
    }
  }

  previousSign() {
    if (this.activeSignIndex > 0) {
      this.prevPose = this.targetPose;
      this.activeSignIndex--;
      this.targetPose = resolveMotionPrimitive(this.signSequence[this.activeSignIndex].gloss);
      this.poseProgress = 0.0;
      this.emit('signChange', {
        index: this.activeSignIndex,
        sign: this.signSequence[this.activeSignIndex],
      });
    }
  }

  setSpeed(speedVal) {
    if (typeof speedVal === 'string') {
      this.playbackSpeed = parseFloat(speedVal) || 1.0;
    } else {
      this.playbackSpeed = speedVal || 1.0;
    }
  }

  /**
   * Update kinematic interpolation step (called inside requestAnimationFrame)
   * Smoothly eases between previous sign posture and target sign posture.
   */
  update(delta) {
    if (!this.isPlaying) {
      // Idle state
      return this.interpolatePoses(this.prevPose, this.targetPose, 1.0);
    }

    const currentSign = this.signSequence[this.activeSignIndex];
    if (!currentSign) {
      this.isPlaying = false;
      this.setStatus('COMPLETED');
      this.emit('playbackEnd', {});
      return ISL_MOTION_LIBRARY.REST;
    }

    const duration = (this.targetPose.duration || 0.7) / this.playbackSpeed;
    this.poseProgress += delta / duration;

    if (this.poseProgress >= 1.0) {
      // Advance to next sign token
      if (this.activeSignIndex < this.signSequence.length - 1) {
        this.prevPose = this.targetPose;
        this.activeSignIndex++;
        const nextSign = this.signSequence[this.activeSignIndex];
        this.targetPose = resolveMotionPrimitive(nextSign.gloss);
        this.poseProgress = 0.0;
        this.emit('signChange', {
          index: this.activeSignIndex,
          sign: nextSign,
        });
      } else {
        // Finished sequence
        this.isPlaying = false;
        this.setStatus('COMPLETED');
        this.emit('playbackEnd', {});
        return this.targetPose;
      }
    }

    const alpha = cubicEaseInOut(Math.min(1.0, this.poseProgress));
    return this.interpolatePoses(this.prevPose, this.targetPose, alpha);
  }

  interpolatePoses(poseA, poseB, t) {
    const lerpArr = (a, b) => [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    ];

    const rawPose = {
      rArm: {
        shoulder: lerpArr(poseA.rArm.shoulder, poseB.rArm.shoulder),
        elbow: lerpArr(poseA.rArm.elbow, poseB.rArm.elbow),
        wrist: lerpArr(poseA.rArm.wrist, poseB.rArm.wrist),
      },
      lArm: {
        shoulder: lerpArr(poseA.lArm.shoulder, poseB.lArm.shoulder),
        elbow: lerpArr(poseA.lArm.elbow, poseB.lArm.elbow),
        wrist: lerpArr(poseA.lArm.wrist, poseB.lArm.wrist),
      },
      rHandShape: t > 0.4 ? poseB.rHand : poseA.rHand,
      lHandShape: t > 0.4 ? poseB.lHand : poseA.lHand,
      headGaze: {
        x: poseA.headGaze.x + (poseB.headGaze.x - poseA.headGaze.x) * t,
        y: poseA.headGaze.y + (poseB.headGaze.y - poseA.headGaze.y) * t,
        z: poseA.headGaze.z + (poseB.headGaze.z - poseA.headGaze.z) * t,
      },
      facialMode: t > 0.3 ? poseB.facial : poseA.facial,
    };

    return validateJointLimits(rawPose);
  }
}

export const avatarService = new AvatarService();

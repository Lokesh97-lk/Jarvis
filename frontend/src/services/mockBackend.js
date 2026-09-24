/**
 * Mock Backend Simulation Service
 * Provides realistic progressive word-by-word streaming, multimodal context,
 * pipeline stage transitions, and telemetry events for full presentation/demonstration
 * without requiring the live Python backend to be pre-running.
 */

import { DEMO_SCENARIOS } from '../utils/constants';

export class MockBackend {
  constructor() {
    this.activeTimer = null;
    this.isSimulating = false;
  }

  /**
   * Run progressive streaming simulation for a scenario
   * @param {Object} scenario
   * @param {Function} callbacks { onWord, onPipelineStage, onGesture, onJarvis, onSigns, onComplete }
   */
  startStreamingDemo(scenario, callbacks = {}) {
    this.stopSimulation();
    this.isSimulating = true;

    const words = scenario.speechWords || [];
    let currentWordIdx = 0;
    const accumulatedWords = [];

    // Stage 1: Microphone & LID
    callbacks.onPipelineStage?.('lid', 'processing');
    callbacks.onPipelineStage?.('asr', 'processing');

    const streamNextWord = () => {
      if (!this.isSimulating) return;

      if (currentWordIdx < words.length) {
        const word = words[currentWordIdx];
        accumulatedWords.push(word);

        callbacks.onWord?.({
          partial: words.slice(0, currentWordIdx + 1),
          currentWord: word,
          accumulatedText: accumulatedWords.map((w) => w.text).join(' '),
          isComplete: false,
        });

        currentWordIdx++;
        // Natural speech cadence (200ms - 350ms per token)
        this.activeTimer = setTimeout(streamNextWord, 240);
      } else {
        // Speech stream finished -> Trigger Multimodal Context & JARVIS Reasoning
        callbacks.onWord?.({
          partial: words,
          currentWord: null,
          accumulatedText: scenario.originalTranscript,
          isComplete: true,
        });

        callbacks.onPipelineStage?.('asr', 'complete');
        callbacks.onPipelineStage?.('transcript', 'complete');
        callbacks.onPipelineStage?.('context', 'processing');

        // Stage 2: MediaPipe Gesture correlate
        if (scenario.gesture) {
          callbacks.onGesture?.(scenario.gesture);
        }

        this.activeTimer = setTimeout(() => {
          if (!this.isSimulating) return;
          callbacks.onPipelineStage?.('context', 'complete');
          callbacks.onPipelineStage?.('jarvis', 'processing');

          // Stage 3: JARVIS Semantic Reasoner
          this.activeTimer = setTimeout(() => {
            if (!this.isSimulating) return;
            callbacks.onJarvis?.(scenario.jarvis);
            callbacks.onPipelineStage?.('jarvis', 'complete');
            callbacks.onPipelineStage?.('isl', 'processing');

            // Stage 4: ISL Planner generates sign tokens
            this.activeTimer = setTimeout(() => {
              if (!this.isSimulating) return;
              callbacks.onSigns?.(scenario.signSequence);
              callbacks.onPipelineStage?.('isl', 'complete');
              callbacks.onPipelineStage?.('motion', 'processing');

              // Stage 5: 3D Avatar Motion
              this.activeTimer = setTimeout(() => {
                if (!this.isSimulating) return;
                callbacks.onPipelineStage?.('motion', 'complete');
                callbacks.onPipelineStage?.('avatar', 'active');
                callbacks.onComplete?.();
                this.isSimulating = false;
              }, 400);
            }, 500);
          }, 600);
        }, 400);
      }
    };

    streamNextWord();
  }

  stopSimulation() {
    this.isSimulating = false;
    if (this.activeTimer) {
      clearTimeout(this.activeTimer);
      this.activeTimer = null;
    }
  }
}

export const mockBackend = new MockBackend();

declare module 'hanzi-writer' {
  export interface HanziWriterOptions {
    width?: number;
    height?: number;
    padding?: number;
    strokeAnimationSpeed?: number;
    strokeFadeDuration?: number;
    strokeHighlightDuration?: number;
    strokeHighlightSpeed?: number;
    delayBetweenStrokes?: number;
    delayBetweenLoops?: number;
    strokeColor?: string;
    radicalColor?: string;
    highlightColor?: string;
    outlineColor?: string;
    drawingColor?: string;
    showOutline?: boolean;
    showCharacter?: boolean;
    drawingWidth?: number;
    showHintAfterMisses?: number;
    highlightOnComplete?: boolean;
    onComplete?: (data: unknown) => void;
    charDataLoader?: (char: string, onLoad: (data: unknown) => void, onError: (err?: unknown) => void) => void;
    leniency?: number;
  }

  export default class HanziWriter {
    static create(element: string | HTMLElement, character: string, options?: HanziWriterOptions): HanziWriter;
    quiz(options?: { onComplete?: (data: unknown) => void }): void;
    cancelQuiz(): void;
    animateCharacter(): void;
    hideCharacter(): void;
    showCharacter(): void;
  }
}

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
    onComplete?: (data: any) => void;
  }

  export default class HanziWriter {
    static create(element: string | HTMLElement, character: string, options?: HanziWriterOptions): HanziWriter;
    quiz(options?: any): void;
    cancelQuiz(): void;
    animateCharacter(): void;
    hideCharacter(): void;
    showCharacter(): void;
  }
}

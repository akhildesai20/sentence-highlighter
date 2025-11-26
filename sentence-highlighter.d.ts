/**
 * Sentence Highlighter - TypeScript Definitions
 * 
 * A lightweight, zero-dependency JavaScript library for sentence-by-sentence highlighting
 * in contenteditable elements.
 * 
 * @version 2.0.0
 * @license MIT
 * @author AKHIL DESAI <akhil.desai20@gmail.com>
 */

/**
 * Configuration options for SentenceHighlighter
 */
export interface SentenceHighlighterOptions {
  /** CSS class for all sentence elements. Default: 'sentence' */
  sentenceClass?: string;
  
  /** CSS class for active sentence. Default: 'sentence--active' */
  activeSentenceClass?: string;
  
  /** CSS class for container div. Default: 'paragraph' */
  containerClass?: string;
  
  /** Data attribute on sentence spans. Default: 'data-sentence-id' */
  sentenceDataAttribute?: string;
  
  /** Data attribute on active sentence. Default: 'data-sentence-active' */
  activeSentenceDataAttribute?: string;
  
  /** Enable focus mode (dim non-active sentences). Default: true */
  enableFocusMode?: boolean;
  
  /** Opacity for dimmed sentences (0-1). Default: 0.18 */
  focusModeDimOpacity?: number;
  
  /** Auto-scroll to keep caret centered. Default: true */
  autoScroll?: boolean;
  
  /** Scroll behavior: 'smooth' or 'auto'. Default: 'smooth' */
  scrollBehavior?: 'smooth' | 'auto';
  
  /** HTML tags treated as complete sentences. Default: ['h1', 'h2', 'h3'] */
  headingTags?: string[];
  
  /** Characters that end sentences. Default: ['.', '!', '?'] */
  sentenceEndings?: string[];
  
  /** Debounce time in ms for input events. Default: 100 */
  updateDebounce?: number;
  
  /** Throttle time in ms for navigation events. Default: 50 */
  updateThrottle?: number;
  
  /** Callback when sentences change. */
  onSentenceChange?: (sentences: Sentence[]) => void;
  
  /** Callback when active sentence changes. */
  onActiveSentenceChange?: (index: number, sentence: Sentence | null) => void;
}

/**
 * Sentence object representing a detected sentence
 */
export interface Sentence {
  /** Unique identifier for the sentence */
  id: string;
  
  /** The sentence text content */
  text: string;
  
  /** Character offset start position */
  start: number;
  
  /** Character offset end position */
  end: number;
  
  /** Whether this sentence is a heading */
  isHeading: boolean;
}

/**
 * SentenceHighlighter - Main class for sentence-by-sentence highlighting
 * 
 * Automatically detects sentences in a contenteditable element and highlights
 * the sentence containing the caret, dimming all other sentences.
 * 
 * @example
 * ```typescript
 * const editor = document.getElementById('editor') as HTMLElement;
 * const highlighter = new SentenceHighlighter(editor, {
 *   enableFocusMode: true,
 *   onActiveSentenceChange: (index, sentence) => {
 *     console.log(`Sentence ${index + 1}: ${sentence?.text}`);
 *   }
 * });
 * ```
 */
export declare class SentenceHighlighter {
  /**
   * Create a new SentenceHighlighter instance
   * 
   * @param editorElement - The contenteditable element to attach to
   * @param options - Configuration options
   * @throws {Error} If editorElement is not valid or not contenteditable
   */
  constructor(editorElement: HTMLElement, options?: SentenceHighlighterOptions);

  /**
   * Enable or disable focus mode
   * 
   * @param enabled - true to enable focus mode (dim non-active sentences), false to disable
   * 
   * @example
   * ```typescript
   * highlighter.setFocusMode(true);  // Enable focus mode
   * highlighter.setFocusMode(false); // Disable focus mode
   * ```
   */
  setFocusMode(enabled: boolean): void;

  /**
   * Toggle focus mode on/off
   * 
   * @returns The new focus mode state (true = enabled, false = disabled)
   * 
   * @example
   * ```typescript
   * const isEnabled = highlighter.toggleFocusMode(); // Toggle between enabled/disabled
   * ```
   */
  toggleFocusMode(): boolean;

  /**
   * Get array of all detected sentences
   * 
   * @returns Array of sentence objects with id, text, start, end, isHeading properties
   * 
   * @example
   * ```typescript
   * const sentences = highlighter.getSentences();
   * console.log(`Total sentences: ${sentences.length}`);
   * sentences.forEach((s, i) => {
   *   console.log(`Sentence ${i + 1}: "${s.text}"`);
   * });
   * ```
   */
  getSentences(): Sentence[];

  /**
   * Get the currently active sentence (the one containing the caret)
   * 
   * @returns The active sentence object, or null if no sentence is active
   * 
   * @example
   * ```typescript
   * const active = highlighter.getActiveSentence();
   * if (active) {
   *   console.log(`Active: "${active.text}"`);
   * }
   * ```
   */
  getActiveSentence(): Sentence | null;

  /**
   * Get the index of the currently active sentence
   * 
   * @returns Zero-based index of the active sentence, or -1 if no sentence is active
   * 
   * @example
   * ```typescript
   * const index = highlighter.getActiveSentenceIndex();
   * const total = highlighter.getSentences().length;
   * console.log(`Active: sentence ${index + 1} of ${total}`);
   * ```
   */
  getActiveSentenceIndex(): number;

  /**
   * Manually trigger a sentence detection and highlighting update
   * Useful when content is modified programmatically
   * 
   * @example
   * ```typescript
   * // After programmatically changing editor content
   * editor.textContent = "New content. With multiple sentences!";
   * highlighter.update(); // Re-detect and highlight sentences
   * ```
   */
  update(): void;

  /**
   * Destroy the highlighter instance and clean up all event listeners and DOM modifications
   * 
   * @example
   * ```typescript
   * // Clean up when removing the editor from the DOM
   * highlighter.destroy();
   * editor.remove();
   * ```
   */
  destroy(): void;
}

/**
 * Default export for ES6 modules
 */
export default SentenceHighlighter;


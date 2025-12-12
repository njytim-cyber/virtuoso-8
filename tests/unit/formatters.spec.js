import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { getNoteSymbol } from '@utils/formatters.jsx';

describe('formatters', () => {
    describe('getNoteSymbol', () => {
        it('should return eighth note for beatUnit 0.5', () => {
            expect(getNoteSymbol(0.5)).toBe('♪');
        });

        it('should return quarter note for beatUnit 1', () => {
            expect(getNoteSymbol(1)).toBe('♩');
        });

        it('should return dotted quarter note for beatUnit 1.5', () => {
            expect(getNoteSymbol(1.5)).toBe('♩.');
        });

        it('should return quarter note for unknown beatUnit', () => {
            expect(getNoteSymbol(2)).toBe('♩');
            expect(getNoteSymbol(0.25)).toBe('♩');
            expect(getNoteSymbol(3)).toBe('♩');
        });
    });

    // Note: formatTitle is harder to test without JSX rendering
    // It would require @testing-library/react setup
});

import { describe, it, expect } from 'vitest';
import { QUESTIONS } from '@data/questions';

describe('questions data', () => {
    it('should have exactly 42 questions', () => {
        expect(QUESTIONS).toHaveLength(42);
    });

    it('should have all required properties for each question', () => {
        QUESTIONS.forEach(q => {
            expect(q).toHaveProperty('id');
            expect(q).toHaveProperty('cat');
            expect(q).toHaveProperty('title');
            expect(q).toHaveProperty('time');
            expect(q).toHaveProperty('tempo');
            expect(q).toHaveProperty('beatUnit');
            expect(q).toHaveProperty('bow');
        });
    });

    it('should have correct category distribution', () => {
        const scales = QUESTIONS.filter(q => q.cat === 'Scales');
        const arpeggios = QUESTIONS.filter(q => q.cat === 'Arpeggios');
        const misc = QUESTIONS.filter(q => q.cat === 'Dominants, Diminished and Chromatics');
        const doubleStops = QUESTIONS.filter(q => q.cat === 'Double Stops');

        expect(scales.length).toBe(15);
        expect(arpeggios.length).toBe(10);
        expect(misc.length).toBe(12);
        expect(doubleStops.length).toBe(5);
    });

    it('should have unique IDs', () => {
        const ids = QUESTIONS.map(q => q.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(QUESTIONS.length);
    });

    it('should have valid time signatures', () => {
        const validTimeSigs = ['4/4', '6/8', '9/8'];
        QUESTIONS.forEach(q => {
            expect(validTimeSigs).toContain(q.time);
        });
    });

    it('should have valid beat units', () => {
        const validBeatUnits = [0.5, 1, 1.5];
        QUESTIONS.forEach(q => {
            expect(validBeatUnits).toContain(q.beatUnit);
        });
    });

    it('should have positive tempo values', () => {
        QUESTIONS.forEach(q => {
            expect(q.tempo).toBeGreaterThan(0);
            expect(q.tempo).toBeLessThan(200); // Reasonable upper limit
        });
    });

    it('should have valid bow types', () => {
        const validBowTypes = ['both', 'slurred', 'separate', 'broken_steps'];
        QUESTIONS.forEach(q => {
            expect(validBowTypes).toContain(q.bow);
        });
    });
});

// The 42 Questions for Grade 8 Violin Practice
export const QUESTIONS = [
    // I. Long Tonic Scales (3 Octaves)
    { id: 'I-1', cat: 'Scales', title: 'Ab Major Scale (3 Oct)', time: '4/4', tempo: 120, beatUnit: 1, bow: 'both' },
    { id: 'I-2', cat: 'Scales', title: 'G# Minor Melodic Scale (3 Oct)', time: '4/4', tempo: 120, beatUnit: 1, bow: 'both' },
    { id: 'I-3', cat: 'Scales', title: 'G# Minor Harmonic Scale (3 Oct)', time: '4/4', tempo: 120, beatUnit: 1, bow: 'both' },
    { id: 'I-4', cat: 'Scales', title: 'C Major Scale (3 Oct)', time: '4/4', tempo: 120, beatUnit: 1, bow: 'both' },
    { id: 'I-5', cat: 'Scales', title: 'C Minor Melodic Scale (3 Oct)', time: '4/4', tempo: 120, beatUnit: 1, bow: 'both' },
    { id: 'I-6', cat: 'Scales', title: 'C Minor Harmonic Scale (3 Oct)', time: '4/4', tempo: 120, beatUnit: 1, bow: 'both' },
    { id: 'I-7', cat: 'Scales', title: 'Db Major Scale (3 Oct)', time: '4/4', tempo: 120, beatUnit: 1, bow: 'both' },
    { id: 'I-8', cat: 'Scales', title: 'C# Minor Melodic Scale (3 Oct)', time: '4/4', tempo: 120, beatUnit: 1, bow: 'both' },
    { id: 'I-9', cat: 'Scales', title: 'C# Minor Harmonic Scale (3 Oct)', time: '4/4', tempo: 120, beatUnit: 1, bow: 'both' },
    { id: 'I-10', cat: 'Scales', title: 'Eb Major Scale (3 Oct)', time: '4/4', tempo: 120, beatUnit: 1, bow: 'both' },
    { id: 'I-11', cat: 'Scales', title: 'Eb Minor Melodic Scale (3 Oct)', time: '4/4', tempo: 120, beatUnit: 1, bow: 'both' },
    { id: 'I-12', cat: 'Scales', title: 'Eb Minor Harmonic Scale (3 Oct)', time: '4/4', tempo: 120, beatUnit: 1, bow: 'both' },
    { id: 'I-13', cat: 'Scales', title: 'E Major Scale (3 Oct)', time: '4/4', tempo: 120, beatUnit: 1, bow: 'both' },
    { id: 'I-14', cat: 'Scales', title: 'E Minor Melodic Scale (3 Oct)', time: '4/4', tempo: 120, beatUnit: 1, bow: 'both' },
    { id: 'I-15', cat: 'Scales', title: 'E Minor Harmonic Scale (3 Oct)', time: '4/4', tempo: 120, beatUnit: 1, bow: 'both' },

    // II. Arpeggios (3 Octaves) - 9/8 Time
    { id: 'II-1', cat: 'Arpeggios', title: 'Ab Major Arpeggio (3 Oct)', time: '9/8', tempo: 50, beatUnit: 1.5, bow: 'both' },
    { id: 'II-2', cat: 'Arpeggios', title: 'G# Minor Arpeggio (3 Oct)', time: '9/8', tempo: 50, beatUnit: 1.5, bow: 'both' },
    { id: 'II-3', cat: 'Arpeggios', title: 'C Major Arpeggio (3 Oct)', time: '9/8', tempo: 50, beatUnit: 1.5, bow: 'both' },
    { id: 'II-4', cat: 'Arpeggios', title: 'C Minor Arpeggio (3 Oct)', time: '9/8', tempo: 50, beatUnit: 1.5, bow: 'both' },
    { id: 'II-5', cat: 'Arpeggios', title: 'Db Major Arpeggio (3 Oct)', time: '9/8', tempo: 50, beatUnit: 1.5, bow: 'both' },
    { id: 'II-6', cat: 'Arpeggios', title: 'C# Minor Arpeggio (3 Oct)', time: '9/8', tempo: 50, beatUnit: 1.5, bow: 'both' },
    { id: 'II-7', cat: 'Arpeggios', title: 'Eb Major Arpeggio (3 Oct)', time: '9/8', tempo: 50, beatUnit: 1.5, bow: 'both' },
    { id: 'II-8', cat: 'Arpeggios', title: 'Eb Minor Arpeggio (3 Oct)', time: '9/8', tempo: 50, beatUnit: 1.5, bow: 'both' },
    { id: 'II-9', cat: 'Arpeggios', title: 'E Major Arpeggio (3 Oct)', time: '9/8', tempo: 50, beatUnit: 1.5, bow: 'both' },
    { id: 'II-10', cat: 'Arpeggios', title: 'E Minor Arpeggio (3 Oct)', time: '9/8', tempo: 50, beatUnit: 1.5, bow: 'both' },

    // III, IV, V. Dominants, Diminished and Chromatics
    { id: 'III-1', cat: 'Dominants, Diminished and Chromatics', title: 'Dominant 7th in Db (3 Oct)', time: '4/4', tempo: 76, beatUnit: 1, bow: 'both' },
    { id: 'III-2', cat: 'Dominants, Diminished and Chromatics', title: 'Dominant 7th in F (3 Oct)', time: '4/4', tempo: 76, beatUnit: 1, bow: 'both' },
    { id: 'III-3', cat: 'Dominants, Diminished and Chromatics', title: 'Dominant 7th in Ab (3 Oct)', time: '4/4', tempo: 76, beatUnit: 1, bow: 'both' },
    { id: 'III-4', cat: 'Dominants, Diminished and Chromatics', title: 'Dominant 7th in A (3 Oct)', time: '4/4', tempo: 76, beatUnit: 1, bow: 'both' },
    { id: 'IV-1', cat: 'Dominants, Diminished and Chromatics', title: 'Diminished 7th on C (2 Oct)', time: '4/4', tempo: 76, beatUnit: 1, bow: 'both' },
    { id: 'IV-2', cat: 'Dominants, Diminished and Chromatics', title: 'Diminished 7th on Eb (2 Oct)', time: '4/4', tempo: 76, beatUnit: 1, bow: 'both' },
    { id: 'IV-3', cat: 'Dominants, Diminished and Chromatics', title: 'Diminished 7th on E (2 Oct)', time: '4/4', tempo: 76, beatUnit: 1, bow: 'both' },
    { id: 'IV-4', cat: 'Dominants, Diminished and Chromatics', title: 'Diminished 7th on Ab (3 Oct)', time: '4/4', tempo: 76, beatUnit: 1, bow: 'both' },
    { id: 'V-1', cat: 'Dominants, Diminished and Chromatics', title: 'Chromatic on C (2 Oct)', time: '6/8', tempo: 120, beatUnit: 0.5, bow: 'both' },
    { id: 'V-2', cat: 'Dominants, Diminished and Chromatics', title: 'Chromatic on Eb (2 Oct)', time: '6/8', tempo: 120, beatUnit: 0.5, bow: 'both' },
    { id: 'V-3', cat: 'Dominants, Diminished and Chromatics', title: 'Chromatic on E (2 Oct)', time: '6/8', tempo: 120, beatUnit: 0.5, bow: 'both' },
    { id: 'V-4', cat: 'Dominants, Diminished and Chromatics', title: 'Chromatic on Ab (3 Oct)', time: '6/8', tempo: 120, beatUnit: 0.5, bow: 'both' },

    // VI. Double Stops
    { id: 'VI-1', cat: 'Double Stops', title: 'Double Stop 3rds in Bb Major (2 Oct)', time: '4/4', tempo: 120, beatUnit: 1, bow: 'broken_steps' },
    { id: 'VI-5', cat: 'Double Stops', title: 'Double Stop Octaves in D Major (1 Octave)', time: '4/4', tempo: 72, beatUnit: 1, bow: 'separate' },
    { id: 'VI-6', cat: 'Double Stops', title: 'Double Stop Octaves in G Minor Melodic (1 Octave)', time: '4/4', tempo: 72, beatUnit: 1, bow: 'separate' },
    { id: 'VI-7', cat: 'Double Stops', title: 'Double Stop Octaves in G Minor Harmonic (1 Octave)', time: '4/4', tempo: 72, beatUnit: 1, bow: 'separate' },
    { id: 'VI-8', cat: 'Double Stops', title: 'Double Stop 6ths in Eb Major (2 Oct)', time: '4/4', tempo: 72, beatUnit: 1, bow: 'separate' },
];

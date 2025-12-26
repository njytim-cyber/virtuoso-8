// Sheet music mapping - uses compressed JPEG images from cropped photos

export const SHEET_MUSIC_MAP = {
    // Scales I-1 to I-15
    'I-1': '/sheet-music/cropped/i_1.jpg',
    'I-2': '/sheet-music/cropped/i_2.jpg',
    'I-3': '/sheet-music/cropped/i_3.jpg',
    'I-4': '/sheet-music/cropped/i_4.jpg',
    'I-5': '/sheet-music/cropped/i_5.jpg',
    'I-6': '/sheet-music/cropped/i_6.jpg',
    'I-7': '/sheet-music/cropped/i_7.jpg',
    'I-8': '/sheet-music/cropped/i_8.jpg',
    'I-9': '/sheet-music/cropped/i_9.jpg',
    'I-10': '/sheet-music/cropped/i_10.jpg',
    'I-11': '/sheet-music/cropped/i_11.jpg',
    'I-12': '/sheet-music/cropped/i_12.jpg',
    'I-13': '/sheet-music/cropped/i_13.jpg',
    'I-14': '/sheet-music/cropped/i_14.jpg',
    'I-15': '/sheet-music/cropped/i_15.jpg',

    // Arpeggios II-1 to II-10
    'II-1': '/sheet-music/cropped/ii_1.jpg',
    'II-2': '/sheet-music/cropped/ii_2.jpg',
    'II-3': '/sheet-music/cropped/ii_3.jpg',
    'II-4': '/sheet-music/cropped/ii_4.jpg',
    'II-5': '/sheet-music/cropped/ii_5.jpg',
    'II-6': '/sheet-music/cropped/ii_6.jpg',
    'II-7': '/sheet-music/cropped/ii_7.jpg',
    'II-8': '/sheet-music/cropped/ii_8.jpg',
    'II-9': '/sheet-music/cropped/ii_9.jpg',
    'II-10': '/sheet-music/cropped/ii_10.jpg',

    // Dominant 7ths III-1 to III-4
    'III-1': '/sheet-music/cropped/iii_1.jpg',
    'III-2': '/sheet-music/cropped/iii_2.jpg',
    'III-3': '/sheet-music/cropped/iii_3.jpg',
    'III-4': '/sheet-music/cropped/iii_4.jpg',

    // Diminished 7ths IV-1 to IV-4
    'IV-1': '/sheet-music/cropped/iv_1.jpg',
    'IV-2': '/sheet-music/cropped/iv_2.jpg',
    'IV-3': '/sheet-music/cropped/iv_3.jpg',
    'IV-4': '/sheet-music/cropped/iv_4.jpg',

    // Chromatic Scales V-1 to V-4
    'V-1': '/sheet-music/cropped/v_1.jpg',
    'V-2': '/sheet-music/cropped/v_2.jpg',
    'V-3': '/sheet-music/cropped/v_3.jpg',
    'V-4': '/sheet-music/cropped/v_4.jpg',

    // Double Stops VI-1, VI-5 to VI-8
    'VI-1': '/sheet-music/cropped/vi_1.jpg',
    'VI-5': '/sheet-music/cropped/vi_5.jpg',
    'VI-6': '/sheet-music/cropped/vi_6.jpg',
    'VI-7': '/sheet-music/cropped/vi_7.jpg',
    'VI-8': '/sheet-music/cropped/vi_8.jpg',
};

// Get the sheet music image path for a question
export function getSheetMusicPath(questionId) {
    return SHEET_MUSIC_MAP[questionId] || null;
}

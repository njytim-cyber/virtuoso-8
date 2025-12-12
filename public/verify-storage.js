// LocalStorage Verification Test
console.log('=== LocalStorage Verification ===');

// Check userData
const userData = localStorage.getItem('virtuoso8_userData');
if (userData) {
    const parsed = JSON.parse(userData);
    console.log('✅ User Data Found:');
    console.log('  - Name:', parsed.name);
    console.log('  - Streaks:', parsed.streaks);
    console.log('  - Last Login:', parsed.lastLogin);
    console.log('  - Total Practice:', parsed.totalPractice);
    console.log('  - Tutorial Seen:', parsed.tutorialSeen);
} else {
    console.log('❌ No user data found in localStorage');
}

// Check history
const history = localStorage.getItem('virtuoso8_history');
if (history) {
    const parsed = JSON.parse(history);
    console.log('\n✅ Practice History Found:');
    console.log('  - Total sessions:', parsed.length);
    if (parsed.length > 0) {
        console.log('  - Latest entry:', {
            questionId: parsed[parsed.length - 1].questionId,
            score: parsed[parsed.length - 1].score,
            variant: parsed[parsed.length - 1].variant,
            dateString: parsed[parsed.length - 1].dateString
        });
    }
} else {
    console.log('❌ No history found in localStorage');
}

console.log('\n=== Verification Complete ===');

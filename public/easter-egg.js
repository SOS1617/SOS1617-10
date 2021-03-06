var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    65: 'a',
    66: 'b',
    69: 'e',
    75: 'k',
    82: 'r'
};
var audio = new Audio('glassbreaking.mp3');

// the 'official' Konami Code sequence
var konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];
var breakCode = ['b', 'r', 'e', 'a', 'k'];

// a variable to remember the 'position' the user has reached so far.
var konamiCodePosition = 0;
var breakCodePosition = 0;

// add keydown event listener
document.addEventListener('keydown', function(e) {
    // get the value of the key code from the key map
    var key = allowedKeys[e.keyCode];
    // get the value of the required key from the konami code
    var requiredKey = konamiCode[konamiCodePosition];
    var breakKey = breakCode[breakCodePosition];

    // compare the key with the required key
    if (key == requiredKey) {

        // move to the next key in the konami code sequence
        konamiCodePosition++;

        // if the last key is reached, activate cheats
        if (konamiCodePosition == konamiCode.length)
            activateCheats();
    }
    else
        konamiCodePosition = 0;

    // compare the key with the required key
    if (key == breakKey) {
        console.log(e.keyCode);
        // move to the next key in the konami code sequence
        breakCodePosition++;

        // if the last key is reached, activate cheats
        if (breakCodePosition == breakCode.length)
            activateBreakCheats();
    }
    else
        breakCodePosition = 0;
});

function activateCheats() {
    jQuery.noConflict();
    $('#easterEgg').modal('show');
}

function activateBreakCheats() {
    
    audio.play();
    document.getElementById("bodyHome").id = "breakBody";
    document.getElementById("glass-hidden").id = "glass-display";
}

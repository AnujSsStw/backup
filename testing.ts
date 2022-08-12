// Return true if the given string is a palindrome. Otherwise, return false.

// A palindrome is a word or sentence that's spelled the same way both forward and backward, ignoring punctuation, case, and spacing.

// Note: You'll need to remove all non-alphanumeric characters (punctuation, spaces and symbols) and turn everything into the same case (lower or upper case) in order to check for palindromes.

// We'll pass strings with varying formats, such as racecar, RaceCar, and race CAR among others.

function palindromes(str: string) {
    var newStr = str.toLowerCase().trim().replace(/-|(|)|_|!/g, "").split('').reverse().join();

    console.log(newStr)
    if (newStr === str) {
        return true;
    } else {
        return false;
    }
}

console.log(palindromes("_eye"));
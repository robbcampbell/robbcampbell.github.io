# wordle
Breaking down Wordle in vanilla JavaScript
<br>
<b>Demo: https://gauravbehere.github.io/wordle/</b>
<hr>
<img height="400" src="https://media-exp1.licdn.com/dms/image/C5622AQFjbn8pUlzMew/feedshare-shrink_800/0/1644127192299?e=1647475200&v=beta&t=ZuJmFOWhh8BWPnTjCh-xiZ2Mx_qnYUI2yHUUAfpPFAE">

## Features
- Unique puzzle everyday.
- Player can choose to play a random puzzle.
- User can share the score. (For now we are copying text to the clipboard,
  ideally we should prompt the share feature if the browser supports it).

## Building Blocks
- Word list (used for puzzle answers).
- Set of valid words (to check if the entered word is a valid word).
- UI Component - Board 6*5, to enter the words.
- UI Component - Keypad.
- UI placeholders - floating messages, popup to show answer or prompt for a random mode.  

## Logic 
- Setup keypad & board on start.
```
- Clean up the HTML for keypad & board.
- Set game trackers like user's state (current column, current row), words entered so far, score card etc to initial state.
- Check if it is a normal mode (day's puzzle) or random puzzle mode, pick the answer.
- Hide popups, messages if shown already.
```

- Bind listeners
```
- Attach a listener to consume system keyboard entries.
- Listeners on the keys in the onscreen keypad.
```

- On click of a key (system keyboard or on screen keypad)
```
- (A-Z,a-z) If current column is not at the end of the row, push the letter in the current row.
- (Back) If the current column is not at the start, pop a letter from the current row.
- (Enter) If the current column is at the end of the row, check the letters of the word.
```

- Checking a row, on enter
```
- Check if the current word has 5 letters, else show a message saying "not enough letters".
- If condition above passes, check if the current word is a valid word from our set of valid words.
- If all conditions above passes, check each letter.
- If a letter is at the correct index in the answer, mark the letter as green in the board & on screen keypad.
  (Check the code for flip animation).
- Else if a letter is partial match (exists in the answer but the index doesn't match), mark it yellow.
- Else mark that letter, grey.

- If the entered word is an exact match, show a floating message based on the current row. Show banner to share the score.
- If the current row count has reached max attempts, show answer.
- If both the above conditions are not true, move to the next row.
```

- Generating a score card
```
- While checking each row, the result of each letter match, we push in a 2D array.
- On share we loop through this 2D array & generate a string with unicode chars for each color & put that string in the clipboard.
```

- Getting a unique puzzle for a day
```
- Declare a start date (just the date no time) for the game.
- From today's date (just the date no time), get the difference from the start date in terms of days. 
  Pick the day diff as index from the word list.
```

- Getting the list of valid words
```
- I used an open API `https://v3.wordfinderapi.com/api/search?page_size=100&page_token=2&length=5&dictionary=wwf`
- Credit: https://word.tips/five-letter-words/
```

- Running locally
```
- npm i, in the root folder
- npm run dev
- hit localhost:3000
```

- Generating deployable bundle
```
npm run build
```

## All set? Go create your own wordle! 

## Further improvements
- Prompting navigator's share.
- Storing the progress in the local storage.
- User should be able to start the game directly in random mode.
- Better code structure, tests. (Most of it was done over a weekend, suggestions, PRs are welcome).

## Licence
MIT, Copyright (c) 2022 Gaurav
gaurav.techgeek@gmail.com

